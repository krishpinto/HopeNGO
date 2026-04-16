"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  MOCK_USERS,
  MOCK_EVENTS,
  MOCK_DONATIONS,
  MOCK_CERTIFICATES,
  MOCK_VOLUNTEER_APPLICATIONS,
} from "@/lib/mock-data";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  const seedDatabase = async () => {
    setLoading(true);
    setLogs(["Starting seed..."]);

    const password = "password123";

    try {
      // 1. Users & Auth
      addLog("Seeding users...");
      const authUids: Record<string, string> = {}; // map mock ID -> Auth UID

      for (const u of MOCK_USERS) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, u.email, password);
          authUids[u.id] = cred.user.uid;
          await setDoc(doc(db, "users", cred.user.uid), {
            fullName: u.name,
            email: u.email,
            role: u.role,
            isApproved: u.isApproved ?? true,
            createdAt: new Date().toISOString(),
          });
          addLog(`Created user ${u.email} -> ${cred.user.uid}`);
        } catch (err: any) {
          // If email already in use, just add a mock record directly for simplicity
          // Assuming user already run seed once
          addLog(`Error creating ${u.email} (maybe already exists?): ${err.message}`);
        }
      }

      // If we failed to map, fallback map the UID to same as mock ID
      const getUid = (mockId: string) => authUids[mockId] || mockId;

      // 2. Events
      addLog("Seeding events...");
      for (const e of MOCK_EVENTS) {
        await setDoc(doc(db, "events", e.id), {
          title: e.title,
          description: e.description,
          longDescription: e.longDescription,
          date: e.date,
          location: e.location,
          bannerImageUrl: e.bannerImageUrl,
          maxVolunteers: e.maxVolunteers,
          volunteerCount: e.volunteerCount,
          maxParticipants: e.maxParticipants,
          participantCount: e.participantCount,
          status: e.status,
          tags: e.tags,
          coordinatorId: e.coordinatorId ? getUid(e.coordinatorId) : null,
        });

        if (e.coordinatorReport) {
          await setDoc(doc(db, "eventReports", `report_${e.id}`), {
            eventId: e.id,
            coordinatorId: e.coordinatorId ? getUid(e.coordinatorId) : null,
            notes: e.coordinatorReport.notes,
            attendanceImages: e.coordinatorReport.attendanceImages,
            submittedAt: e.coordinatorReport.submittedAt,
          });
        }
      }

      // 3. Applications
      addLog("Seeding volunteer applications...");
      for (const a of MOCK_VOLUNTEER_APPLICATIONS) {
        await setDoc(doc(db, "volunteerApplications", a.id), {
          eventId: a.eventId,
          volunteerId: getUid(a.volunteerId),
          status: a.status,
          appliedAt: new Date().toISOString(),
        });
      }

      // 4. Certificates
      addLog("Seeding certificates...");
      for (const c of MOCK_CERTIFICATES) {
        // Find user by name logic from mock data (super hacky but works for seed)
        const mockUser = MOCK_USERS.find((u) => u.name === c.recipientName);
        await setDoc(doc(db, "certificates", c.id), {
          eventId: "unknown",
          eventTitle: c.eventTitle,
          recipientId: mockUser ? getUid(mockUser.id) : c.recipientName,
          recipientName: c.recipientName,
          issuedDate: c.date,
        });
      }

      // 5. Donations
      addLog("Seeding donations...");
      for (const d of MOCK_DONATIONS) {
        await setDoc(doc(db, "donations", d.id), {
          donorName: d.donorName,
          amount: d.amount,
          createdAt: d.date,
          status: d.status,
        });
      }

      addLog("Seed complete!");
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Database Seeder</h1>
      <button
        onClick={seedDatabase}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Seeding..." : "Start Seed"}
      </button>
      <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
        {logs.map((L, i) => (
          <div key={i}>{L}</div>
        ))}
      </div>
    </div>
  );
}
