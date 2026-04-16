import { collection, doc, getDoc, getDocs, query, where, setDoc, addDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Ensure schema consistency with Web

export async function getEvents() {
  const q = query(collection(db, "events"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getEventById(id: string) {
  const d = await getDoc(doc(db, "events", id));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() };
}

export async function getEventsByCoordinator(coordinatorId: string) {
  const q = query(collection(db, "events"), where("coordinatorId", "==", coordinatorId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getVolunteerApplications(volunteerId: string) {
  const q = query(collection(db, "volunteerApplications"), where("volunteerId", "==", volunteerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getEventApplications(eventId: string) {
  const q = query(collection(db, "volunteerApplications"), where("eventId", "==", eventId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

export async function getVolunteerCertificates(volunteerId: string) {
  const q = query(collection(db, "certificates"), where("recipientId", "==", volunteerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getUser(uid: string) {
  const d = await getDoc(doc(db, "users", uid));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() };
}

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
  return { id: d.id, ...d.data() };
}
