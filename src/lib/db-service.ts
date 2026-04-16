import { collection, doc, getDoc, getDocs, query, where, Timestamp, setDoc, addDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { EventData } from "./mock-data";

// --- Events ---
export async function getEvents(): Promise<EventData[]> {
  const q = query(collection(db, "events"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData));
}

export async function getEventById(id: string): Promise<EventData | null> {
  const d = await getDoc(doc(db, "events", id));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as EventData;
}

export async function getEventsByCoordinator(coordinatorId: string): Promise<EventData[]> {
  const q = query(collection(db, "events"), where("coordinatorId", "==", coordinatorId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData));
}

// --- Applications ---
export async function getVolunteerApplications(volunteerId: string) {
  const q = query(collection(db, "volunteerApplications"), where("volunteerId", "==", volunteerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
}

export async function getEventApplications(eventId: string) {
  const q = query(collection(db, "volunteerApplications"), where("eventId", "==", eventId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
}

export async function createApplication(eventId: string, volunteerId: string) {
  await addDoc(collection(db, "volunteerApplications"), {
    eventId,
    volunteerId,
    status: "pending",
    appliedAt: new Date().toISOString()
  });
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  await updateDoc(doc(db, "volunteerApplications", applicationId), { status });
}

// --- Certificates ---
export async function getVolunteerCertificates(volunteerId: string) {
  const q = query(collection(db, "certificates"), where("recipientId", "==", volunteerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
}

// --- Users ---
export async function getUser(uid: string) {
  const d = await getDoc(doc(db, "users", uid));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as any;
}

export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
}

// --- Donations ---
export async function submitDonation(data: any) {
  await addDoc(collection(db, "donations"), {
    ...data,
    createdAt: new Date().toISOString(),
    status: "verified" // auto verify for MVP
  });
}

export async function getDonations() {
  const snapshot = await getDocs(collection(db, "donations"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
}

// --- Reports ---
export async function submitReport(eventId: string, coordinatorId: string, data: any) {
  await setDoc(doc(db, "eventReports", `report_${eventId}`), {
    eventId,
    coordinatorId,
    ...data,
    submittedAt: new Date().toISOString()
  });
}

export async function getReport(eventId: string) {
  const d = await getDoc(doc(db, "eventReports", `report_${eventId}`));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as any;
}
