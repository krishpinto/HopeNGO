# HopeNGO — NGO Platform
## Detailed Project Plan & Step-by-Step Execution Guide
### Stack: Next.js 16 · Firebase · shadcn/ui · Expo

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Roles & Permissions Matrix](#2-roles--permissions-matrix)
3. [Tech Stack & Versions](#3-tech-stack--versions)
4. [Firestore Data Model](#4-firestore-data-model)
5. [Phase 1 — Foundation](#5-phase-1--foundation)
6. [Phase 2 — Core Features](#6-phase-2--core-features)
7. [Phase 3 — Advanced Features](#7-phase-3--advanced-features)
8. [Phase 4 — Mobile App](#8-phase-4--mobile-app)
9. [Phase 5 — Polish & Launch](#9-phase-5--polish--launch)
10. [API Route Reference](#10-api-route-reference)
11. [Folder Structure](#11-folder-structure)
12. [Environment Variables](#12-environment-variables)
13. [Deployment Checklist](#13-deployment-checklist)

---

## 1. Project Overview

**HopeNGO** is a full-stack NGO management platform (web + mobile app) that connects three types of users:

| Role | Who They Are | Core Purpose |
|---|---|---|
| **Admin** | NGO staff/organizers | Create events, manage users, issue certificates, generate reports |
| **Volunteer** | Helpers at events | Apply to volunteer, view assignment instructions on dashboard |
| **Participant** | Public attendees | Register for events, download certificates from dashboard |

**Key Design Decisions:**
- No image uploads — banner images are external URLs pasted by admin
- Certificates are dynamically generated as PDFs via a Next.js API route (no storage needed)
- Firebase Auth handles all authentication; Firestore is the only database
- Firebase Admin SDK used in Next.js API routes for privileged operations

---

## 2. Roles & Permissions Matrix

### Admin
- ✅ Create / edit / cancel events with banner image URL
- ✅ Set max participant limit; registration auto-closes when full (Firestore transaction)
- ✅ Toggle participant registration open/closed per event
- ✅ Toggle volunteer registration open/closed per event
- ✅ Approve or reject volunteer account applications
- ✅ Approve or reject per-event volunteer applications
- ✅ View participant list + seat fill status per event
- ✅ Mark attendance (participant / volunteer) per event
- ✅ Issue certificates → appear on participant/volunteer dashboards
- ✅ Generate and download event PDF reports
- ✅ Post announcements (targeted by role)
- ✅ Activate / deactivate user accounts

### Volunteer
- ✅ Browse events accepting volunteers and submit applications
- ✅ Track application status: pending → approved / rejected
- ✅ View approved event details + volunteering instructions on dashboard
- ✅ View personal volunteering history
- ✅ Update profile (skills, contact, bio)
- ✅ Download certificates issued for volunteer service

### Participant
- ✅ Browse and register for public events
- ✅ View registered events on dashboard with event details
- ✅ Cancel registration before deadline
- ✅ View and download participation certificates (dynamically generated)
- ✅ View registration history
- ✅ Update personal profile

---

## 3. Tech Stack & Versions

### Web Frontend
| Package | Version | Purpose |
|---|---|---|
| `next` | `16.2.x` (latest) | Full-stack React framework |
| `react` / `react-dom` | `19.2.x` | UI library |
| `tailwindcss` | `4.x` | Utility-first CSS |
| `shadcn` (CLI) | `latest` (v4) | Component scaffolding |
| `react-hook-form` | `latest` | Form state management |
| `zod` | `latest` | Schema validation |
| `zustand` | `latest` | Client state management |
| `date-fns` | `latest` | Date utilities |
| `lucide-react` | `latest` | Icons |
| `jspdf` | `latest` | Certificate + report PDF generation |
| `jspdf-autotable` | `latest` | Tables in PDF reports |
| `qrcode` | `latest` | QR code generation for certificates |

### Backend / Auth / Database
| Package | Version | Purpose |
|---|---|---|
| `firebase` | `12.11.0` | Client SDK (Auth, Firestore) |
| `firebase-admin` | `13.7.0` | Server SDK (privileged ops in API routes) |

### Mobile App
| Package | Version | Purpose |
|---|---|---|
| `expo` | `SDK 52 (latest)` | React Native framework |
| `expo-router` | `latest` | File-based navigation |
| `@react-native-firebase/app` | `latest` | Firebase for React Native |
| `@react-native-firebase/auth` | `latest` | Firebase Auth on mobile |
| `@react-native-firebase/firestore` | `latest` | Firestore on mobile |
| `expo-print` | `latest` | Generate PDF on device |
| `expo-sharing` | `latest` | Share/save files on device |

---

## 4. Firestore Data Model

> Firestore is document-based. All IDs are auto-generated unless noted.

### Collection: `users`
```
users/{uid}              ← uid matches Firebase Auth UID
  email: string
  role: "admin" | "volunteer" | "participant"
  isApproved: boolean    ← false for volunteers until admin approves account
  isActive: boolean
  fullName: string
  phone: string
  city: string
  state: string
  occupation: string     ← volunteers only
  skills: string[]       ← volunteers only
  bio: string
  emergencyContact: string  ← volunteers only
  expoPushToken: string  ← mobile push token (updated on app open)
  createdAt: Timestamp
  updatedAt: Timestamp
```

### Collection: `events`
```
events/{eventId}
  title: string
  description: string
  eventType: string
  eventDate: Timestamp
  startTime: string          ← "10:00 AM"
  endTime: string
  venue: string
  city: string
  state: string
  bannerImageUrl: string     ← external URL pasted by admin (no upload)
  tags: string[]

  # Participant settings
  maxParticipants: number | null
  participantCount: number   ← denormalized counter, incremented atomically
  participantRegistrationOpen: boolean
  participantDeadline: Timestamp | null

  # Volunteer settings
  maxVolunteers: number | null
  volunteerCount: number     ← denormalized counter
  volunteerRegistrationOpen: boolean
  volunteerDeadline: Timestamp | null
  volunteerInstructions: string  ← only shown to approved volunteers

  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  isPublic: boolean
  createdBy: string          ← admin uid
  createdAt: Timestamp
  updatedAt: Timestamp
```

### Collection: `participantRegistrations`
```
participantRegistrations/{regId}
  eventId: string
  participantId: string      ← user uid
  participantName: string    ← denormalized for reports
  participantEmail: string   ← denormalized for reports
  registrationDate: Timestamp
  status: "registered" | "attended" | "absent" | "cancelled"
  attendanceMarkedAt: Timestamp | null
  attendanceMarkedBy: string | null  ← admin uid
  notes: string
```

### Collection: `volunteerApplications`
```
volunteerApplications/{appId}
  eventId: string
  volunteerId: string        ← user uid
  volunteerName: string      ← denormalized
  appliedAt: Timestamp
  status: "pending" | "approved" | "rejected" | "cancelled"
  reviewedAt: Timestamp | null
  reviewedBy: string | null  ← admin uid
  adminNotes: string
```

### Collection: `certificates`
```
certificates/{certId}
  certificateNumber: string  ← "ANTI-2025-{eventShort}-{seq}" (unique)
  eventId: string
  eventTitle: string         ← denormalized
  eventDate: Timestamp       ← denormalized
  recipientId: string        ← user uid
  recipientName: string      ← denormalized
  recipientRole: "participant" | "volunteer"
  issuedDate: Timestamp
  issuedBy: string           ← admin uid
  isVisible: boolean
  qrVerifyUrl: string        ← https://yourdomain.com/verify/{certificateNumber} (displays full visual certificate + download)
```

> **No PDF URL stored anywhere.** PDFs are generated on-demand every time a user hits the
> download endpoint. The Firestore document only stores the metadata needed to re-render it.

### Collection: `announcements`
```
announcements/{announcementId}
  title: string
  content: string
  targetAudience: "all" | "volunteers" | "participants" | "admins"
  priority: "low" | "normal" | "high" | "urgent"
  isPinned: boolean
  eventId: string | null     ← optional: link to specific event
  createdBy: string
  createdAt: Timestamp
  expiresAt: Timestamp | null
```

### Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function userRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isAdmin() { return userRole() == 'admin'; }
    function isVolunteer() { return userRole() == 'volunteer'; }
    function isParticipant() { return userRole() == 'participant'; }
    function isOwner(uid) { return request.auth.uid == uid; }

    match /users/{uid} {
      allow read: if isOwner(uid) || isAdmin();
      allow update: if isOwner(uid) || isAdmin();
      allow create: if request.auth != null;
    }

    match /events/{eventId} {
      allow read: if resource.data.isPublic == true || isAdmin();
      allow write: if isAdmin();
    }

    match /participantRegistrations/{regId} {
      allow read: if isAdmin() || isOwner(resource.data.participantId);
      allow create: if isParticipant() && isOwner(request.resource.data.participantId);
      allow update: if isAdmin();
    }

    match /volunteerApplications/{appId} {
      allow read: if isAdmin() || isOwner(resource.data.volunteerId);
      allow create: if isVolunteer() && isOwner(request.resource.data.volunteerId);
      allow update: if isAdmin();
    }

    match /certificates/{certId} {
      // Recipients can read their own; public can read visible certs (for QR verify)
      allow read: if isAdmin() || isOwner(resource.data.recipientId)
                    || resource.data.isVisible == true;
      allow write: if isAdmin();
    }

    match /announcements/{annId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
  }
}
```

---

## 5. Phase 1 — Foundation

**Duration:** ~2 weeks  
**Goal:** Scaffolding, Firebase setup, auth, protected routing

### Step 1.1 — Scaffold the Project

```bash
# This single command creates a full Next.js 16 + Tailwind v4 + shadcn project
npx shadcn@latest create

# When prompted:
#   Select template:  Next.js
#   Style:            new-york
#   Base color:       neutral
#   Project name:     hopengo

cd hopengo

# Upgrade to latest Next.js (16.2) explicitly if not already
npm install next@latest react@latest react-dom@latest

# Firebase SDKs (exact latest versions)
npm install firebase@12.11.0
npm install firebase-admin@13.7.0

# Form + validation
npm install react-hook-form @hookform/resolvers zod

# State management
npm install zustand

# PDF generation + QR codes (server-side certificate API)
npm install jspdf jspdf-autotable qrcode
npm install --save-dev @types/qrcode

# Utilities
npm install date-fns clsx lucide-react
```

> After scaffolding, add any additional shadcn components you need:
> ```bash
> npx shadcn@latest add button card table dialog badge input select tabs skeleton
> ```

### Step 1.2 — Firebase Project Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it `hopengo`
2. **Authentication** → Sign-in method → Enable **Email/Password**
3. **Firestore Database** → Create database → **Production mode** → choose region
4. Paste the security rules from Section 4 → **Publish**
5. **Project Settings → Service accounts** → **Generate new private key** → download JSON
6. Extract these values from the JSON into your `.env.local`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
7. **Project Settings → General → Your apps** → Add a **Web app** → copy the config object into `.env.local`

### Step 1.3 — Firebase Configuration Files

```typescript
// src/lib/firebase/client.ts  — browser-side only
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
```

```typescript
// src/lib/firebase/admin.ts  — server-side only (API routes, never import in client components)
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth }      from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminAuth = getAuth();
export const adminDb   = getFirestore();
```

### Step 1.4 — Auth Flow (Session Cookie Strategy)

Using Firebase's **session cookie** pattern: after the user logs in on the client, the app
sends the ID token to an API route which exchanges it for a long-lived HttpOnly session cookie.
Middleware then verifies this cookie on every protected request without client-side Firebase calls.

**Client: login action**
```typescript
// src/lib/auth/login.ts
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';

export async function login(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await credential.user.getIdToken();

  // Exchange for session cookie
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) throw new Error('Session creation failed');

  // Fetch role for redirect
  const profile = (await getDoc(doc(db, 'users', credential.user.uid))).data();

  if (!profile?.isActive) throw new Error('Account is deactivated');
  if (profile?.role === 'volunteer' && !profile?.isApproved) {
    throw new Error('PENDING_APPROVAL');
  }

  return profile?.role; // "admin" | "volunteer" | "participant"
}
```

**API route: session management**
```typescript
// app/api/auth/session/route.ts
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { idToken } = await req.json();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

  (await cookies()).set('session', sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return Response.json({ status: 'ok' });
}

export async function DELETE() {
  (await cookies()).delete('session');
  return Response.json({ status: 'ok' });
}
```

**Middleware: route protection**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const ROLE_PATHS: Record<string, string> = {
  admin: '/admin',
  volunteer: '/volunteer',
  participant: '/participant',
};

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify session via lightweight API call
  const verifyRes = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
    headers: { Cookie: `session=${session}` },
  });

  if (!verifyRes.ok) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { role } = await verifyRes.json();
  const allowedPrefix = ROLE_PATHS[role];

  // Redirect if accessing wrong role's section
  if (!pathname.startsWith(allowedPrefix)) {
    return NextResponse.redirect(new URL(`${allowedPrefix}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/volunteer/:path*', '/participant/:path*'],
};
```

**Registration logic:**
- **Participant** → `createUserWithEmailAndPassword` → Firestore `users/{uid}` with `role: "participant"`, `isApproved: true` → immediately active
- **Volunteer** → Same Firebase Auth creation → Firestore with `role: "volunteer"`, `isApproved: false` → redirected to `/pending-approval` after login until admin approves

---

## 6. Phase 2 — Core Features

**Duration:** ~4 weeks  
**Goal:** All primary CRUD per role, registration flow, seat tracking

### Step 2.1 — Events Module (Admin)

**Create Event form fields:**
- Title, Description, Event Type (dropdown)
- Event Date, Start Time, End Time
- Venue, City, State
- **Banner Image URL** — plain text input, admin pastes any image URL from the web
- Max Participants, Participant Registration Open (toggle), Participant Deadline
- Max Volunteers, Volunteer Registration Open (toggle), Volunteer Deadline
- Volunteer Instructions (textarea — shown to approved volunteers only)
- Tags (multi-input)
- Status (defaults to "upcoming")

**Rendering banner images:**
Since images are external URLs, use `next/image` with `unoptimized` or configure `remotePatterns` to allow all hosts:
```tsx
<img src={event.bannerImageUrl} alt={event.title} className="w-full h-48 object-cover rounded-lg" />
```

**API Route — Create Event:**
```typescript
// app/api/events/route.ts
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  // 1. Verify session cookie → assert role === 'admin'
  const session = (await cookies()).get('session')?.value;
  const decoded = await adminAuth.verifySessionCookie(session!, true);
  const userDoc = await adminDb.doc(`users/${decoded.uid}`).get();
  if (userDoc.data()?.role !== 'admin') return new Response('Forbidden', { status: 403 });

  // 2. Parse + validate with Zod
  const body = await req.json();
  // ... zod parse

  // 3. Write to Firestore
  const ref = await adminDb.collection('events').add({
    ...body,
    participantCount: 0,
    volunteerCount: 0,
    createdBy: decoded.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return Response.json({ id: ref.id });
}
```

### Step 2.2 — Participant Registration (Atomic with Auto-Close)

The registration API uses a **Firestore transaction** to atomically:
1. Check `participantRegistrationOpen` is `true`
2. Check `participantCount < maxParticipants`
3. Create the registration document
4. Increment `participantCount`
5. Flip `participantRegistrationOpen` to `false` if this was the last seat

```typescript
// app/api/registrations/route.ts
export async function POST(req: Request) {
  const { eventId } = await req.json();
  // ... verify session, get participant uid + name + email

  try {
    await adminDb.runTransaction(async (tx) => {
      const eventRef = adminDb.doc(`events/${eventId}`);
      const eventSnap = await tx.get(eventRef);
      const event = eventSnap.data()!;

      if (!event.participantRegistrationOpen) throw new Error('REGISTRATION_CLOSED');
      if (event.maxParticipants && event.participantCount >= event.maxParticipants) {
        throw new Error('EVENT_FULL');
      }

      // Check duplicate
      const existingQuery = await adminDb.collection('participantRegistrations')
        .where('eventId', '==', eventId)
        .where('participantId', '==', participantId)
        .where('status', '!=', 'cancelled')
        .limit(1)
        .get();
      if (!existingQuery.empty) throw new Error('ALREADY_REGISTERED');

      const regRef = adminDb.collection('participantRegistrations').doc();
      tx.set(regRef, {
        eventId, participantId, participantName, participantEmail,
        registrationDate: FieldValue.serverTimestamp(),
        status: 'registered',
        attendanceMarkedAt: null, attendanceMarkedBy: null, notes: '',
      });

      const newCount = event.participantCount + 1;
      const autoClose = event.maxParticipants ? newCount >= event.maxParticipants : false;
      tx.update(eventRef, {
        participantCount: FieldValue.increment(1),
        ...(autoClose && { participantRegistrationOpen: false }),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    return Response.json({ status: 'registered' });
  } catch (err: any) {
    const msg = err.message;
    if (msg === 'REGISTRATION_CLOSED') return Response.json({ error: 'Registration is closed' }, { status: 400 });
    if (msg === 'EVENT_FULL')          return Response.json({ error: 'Event is full' },           { status: 400 });
    if (msg === 'ALREADY_REGISTERED') return Response.json({ error: 'Already registered' },       { status: 400 });
    throw err;
  }
}
```

**Seat fill indicator component:**
```tsx
// src/components/events/SeatProgressBar.tsx
interface Props { current: number; max: number | null; }

export function SeatProgressBar({ current, max }: Props) {
  if (!max) return <p className="text-sm text-muted-foreground">Unlimited seats</p>;

  const pct = Math.min((current / max) * 100, 100);
  const color = pct < 70 ? 'bg-green-500' : pct < 90 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{current} registered</span>
        <span>{max - current} left</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
```

### Step 2.3 — Volunteer Application Flow

**Apply to volunteer:**
```typescript
// app/api/volunteer-applications/route.ts
// POST: Create application doc with status: "pending"
// Check: volunteerRegistrationOpen === true on event
// Check: no duplicate application exists
```

**Admin approval:**
```typescript
// app/api/volunteer-applications/[id]/route.ts
// PATCH body: { status: "approved" | "rejected", adminNotes?: string }
// Updates application doc + timestamps
```

**Volunteer dashboard data:**
- **Pending applications** → query `volunteerApplications` where `volunteerId == uid AND status == "pending"`
- **Approved events** → query where `status == "approved"` → for each, fetch the event doc to get `volunteerInstructions`
- **Rejected** → shown with admin notes if any

### Step 2.4 — Admin: Volunteer Account Approval

```typescript
// app/api/admin/users/[uid]/approve/route.ts
// PATCH: adminDb.doc(`users/${uid}`).update({ isApproved: true, updatedAt: serverTimestamp() })

// For rejection (delete account entirely):
// adminAuth.deleteUser(uid)  ← removes Firebase Auth account
// adminDb.doc(`users/${uid}`).delete()
```

Admin UI at `/admin/volunteers`:
- **Tab 1 — Account Approvals**: lists users where `role == "volunteer" AND isApproved == false`
- **Tab 2 — Event Applications**: filter by event, list applications with approve/reject

---

## 7. Phase 3 — Advanced Features

**Duration:** ~3 weeks  
**Goal:** Dynamic certificate PDF generation, event reports, announcements, analytics

### Step 3.1 — Dynamic Certificate Generation

No files stored anywhere. Every download generates the PDF fresh from Firestore metadata.

**Issue certificates (admin action):**
```typescript
// app/api/certificates/issue/route.ts
// POST body: { eventId, recipientIds: string[], recipientRole: "participant" | "volunteer" }

// For each recipient:
// 1. Get recipient name from users collection
// 2. Get sequence number: query certificates where eventId == eventId → count + 1
// 3. Generate cert number: ANTI-{YYYY}-{eventId.slice(0,6).toUpperCase()}-{String(seq).padStart(4,'0')}
//    e.g. ANTI-2025-ABC123-0001
// 4. Build qrVerifyUrl: `${APP_URL}/verify/${certNumber}`
// 5. Write to Firestore certificates collection
// → No PDF generated here, only metadata
```

**Download endpoint — generates PDF on every request:**
```typescript
// app/api/certificates/[certId]/download/route.ts
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function GET(req: Request, { params }: { params: Promise<{ certId: string }> }) {
  const { certId } = await params;

  // 1. Verify session — must be owner or admin
  const session = (await cookies()).get('session')?.value;
  const decoded = await adminAuth.verifySessionCookie(session!, true);

  // 2. Fetch certificate metadata
  const certSnap = await adminDb.doc(`certificates/${certId}`).get();
  if (!certSnap.exists) return new Response('Not found', { status: 404 });

  const cert = certSnap.data()!;
  if (cert.recipientId !== decoded.uid) {
    const user = await adminDb.doc(`users/${decoded.uid}`).get();
    if (user.data()?.role !== 'admin') return new Response('Forbidden', { status: 403 });
  }
  if (!cert.isVisible) return new Response('Not found', { status: 404 });

  // 3. Generate QR code as base64 data URL
  const qrDataUrl = await QRCode.toDataURL(cert.qrVerifyUrl, { width: 120, margin: 1 });

  // 4. Build PDF with jsPDF (landscape A4)
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Background
  doc.setFillColor(250, 250, 250);
  doc.rect(0, 0, 297, 210, 'F');

  // Outer border
  doc.setDrawColor(22, 163, 74);    // green-600
  doc.setLineWidth(3);
  doc.rect(8, 8, 281, 194);

  // Inner border
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, 273, 186);

  // NGO Name
  doc.setFontSize(30).setFont('helvetica', 'bold').setTextColor(17, 24, 39);
  doc.text('HOPENGO', 148.5, 38, { align: 'center' });

  // Subtitle
  doc.setFontSize(11).setFont('helvetica', 'normal').setTextColor(107, 114, 128);
  doc.text('CERTIFICATE OF ' + (cert.recipientRole === 'volunteer' ? 'VOLUNTEERING' : 'PARTICIPATION'),
           148.5, 50, { align: 'center' });

  // Divider
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.8);
  doc.line(40, 55, 257, 55);

  // Body
  doc.setFontSize(12).setTextColor(75, 85, 99);
  doc.text('This is to certify that', 148.5, 70, { align: 'center' });

  // Recipient name (large)
  doc.setFontSize(28).setFont('helvetica', 'bold').setTextColor(17, 24, 39);
  doc.text(cert.recipientName, 148.5, 90, { align: 'center' });

  // Role phrase
  const roleVerb = cert.recipientRole === 'volunteer' ? 'volunteered at' : 'participated in';
  doc.setFontSize(12).setFont('helvetica', 'normal').setTextColor(75, 85, 99);
  doc.text(`has successfully ${roleVerb}`, 148.5, 103, { align: 'center' });

  // Event title
  doc.setFontSize(18).setFont('helvetica', 'bold').setTextColor(17, 24, 39);
  doc.text(cert.eventTitle, 148.5, 117, { align: 'center' });

  // Event date
  const eventDate = cert.eventDate.toDate().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  doc.setFontSize(11).setFont('helvetica', 'normal').setTextColor(107, 114, 128);
  doc.text(`Held on ${eventDate}`, 148.5, 129, { align: 'center' });

  // Bottom bar
  doc.setFillColor(22, 163, 74);
  doc.rect(8, 176, 281, 0.8, 'F');

  // Footer text
  doc.setFontSize(9).setTextColor(107, 114, 128);
  doc.text(`Certificate No: ${cert.certificateNumber}`, 18, 185);
  const issuedDate = cert.issuedDate.toDate().toLocaleDateString('en-IN');
  doc.text(`Issued on: ${issuedDate}`, 148.5, 185, { align: 'center' });
  doc.text('Scan QR to verify', 252, 180, { align: 'center' });

  // QR Code
  doc.addImage(qrDataUrl, 'PNG', 237, 155, 38, 38);

  // Stream PDF
  const pdfBuffer = doc.output('arraybuffer');
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${cert.certificateNumber}.pdf"`,
    },
  });
}
```

**Public certificate verification page (`/verify/[certNumber]`):**

When someone scans the QR code on a downloaded certificate, they land on this page which
**renders the full certificate visually** — not just a text confirmation. This way the certificate
feels real and shareable, and the page itself acts as proof of authenticity.

```tsx
// app/(public)/verify/[certNumber]/page.tsx  — Server Component
import { adminDb } from '@/lib/firebase/admin';

interface Props { params: Promise<{ certNumber: string }> }

export default async function VerifyPage({ params }: Props) {
  const { certNumber } = await params;

  const snap = await adminDb.collection('certificates')
    .where('certificateNumber', '==', certNumber)
    .where('isVisible', '==', true)
    .limit(1)
    .get();

  if (snap.empty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800">Certificate Not Found</h1>
          <p className="text-gray-500 mt-2">This certificate number is invalid or has been revoked.</p>
          <p className="text-sm text-gray-400 mt-4">Ref: {certNumber}</p>
        </div>
      </div>
    );
  }

  const cert = snap.docs[0].data();
  const eventDate = cert.eventDate.toDate().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const issuedDate = cert.issuedDate.toDate().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const roleVerb = cert.recipientRole === 'volunteer' ? 'volunteered at' : 'participated in';
  const roleLabel = cert.recipientRole === 'volunteer' ? 'VOLUNTEERING' : 'PARTICIPATION';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 gap-6">

      {/* Authenticity badge — shown above the certificate */}
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700
                      rounded-full px-5 py-2 text-sm font-medium shadow-sm">
        <span className="text-green-500">✔</span>
        Verified Certificate — Issued by HopeNGO
      </div>

      {/* Certificate display card */}
      <div className="bg-white rounded-2xl shadow-xl border-4 border-green-600
                      w-full max-w-3xl px-12 py-10 text-center relative">

        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-green-500 rounded-tl-md" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-green-500 rounded-tr-md" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-green-500 rounded-bl-md" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-green-500 rounded-br-md" />

        {/* NGO Name */}
        <h1 className="text-3xl font-black tracking-widest text-gray-900 uppercase">HopeNGO</h1>

        {/* Certificate type */}
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mt-1">
          Certificate of {roleLabel}
        </p>

        {/* Divider */}
        <div className="my-5 h-px bg-green-500 w-2/3 mx-auto" />

        {/* Body */}
        <p className="text-gray-500 text-sm">This is to certify that</p>

        <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-1">{cert.recipientName}</h2>

        <p className="text-gray-500 text-sm mt-2">has successfully {roleVerb}</p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-2">{cert.eventTitle}</h3>

        <p className="text-gray-400 text-sm mt-2">Held on {eventDate}</p>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-100 w-full" />

        {/* Footer meta */}
        <div className="flex justify-between items-end text-xs text-gray-400">
          <div className="text-left">
            <p className="font-medium text-gray-500">Certificate No.</p>
            <p className="font-mono">{cert.certificateNumber}</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-500">Issued On</p>
            <p>{issuedDate}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-500">Issued By</p>
            <p>HopeNGO</p>
          </div>
        </div>
      </div>

      {/* Download button — generates PDF on demand */}
      <a
        href={`/api/certificates/${snap.docs[0].id}/download`}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold
                   px-8 py-3 rounded-full shadow transition text-sm"
        download
      >
        ↓ Download Certificate PDF
      </a>

      <p className="text-xs text-gray-400">
        This page is publicly accessible via the QR code on the original certificate.
      </p>
    </div>
  );
}
```

> The QR code embedded in the PDF encodes the URL `https://yourdomain.com/verify/{certificateNumber}`.
> When scanned, it opens this page — showing the full certificate visually, a verified badge,
> and a download button so the recipient can re-download the PDF directly from the verification page.

### Step 3.2 — Event Report PDF (Admin)

```typescript
// app/api/events/[eventId]/report/route.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  // 1. Verify admin session
  // 2. Parallel fetch: event doc, all registrations, all approved volunteer applications

  const [eventSnap, regsSnap, volsSnap] = await Promise.all([
    adminDb.doc(`events/${eventId}`).get(),
    adminDb.collection('participantRegistrations').where('eventId', '==', eventId).get(),
    adminDb.collection('volunteerApplications')
      .where('eventId', '==', eventId).where('status', '==', 'approved').get(),
  ]);

  const event = eventSnap.data()!;
  const regs  = regsSnap.docs.map(d => d.data());
  const vols  = volsSnap.docs.map(d => d.data());

  const attended = regs.filter(r => r.status === 'attended').length;
  const attendanceRate = regs.length > 0 ? Math.round((attended / regs.length) * 100) : 0;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Header
  doc.setFillColor(17, 24, 39);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setFontSize(20).setFont('helvetica', 'bold').setTextColor(255, 255, 255);
  doc.text('HOPENGO — Event Report', 14, 20);
  doc.setFontSize(11).setFont('helvetica', 'normal');
  doc.text(event.title, 14, 30);

  // Stats
  doc.setTextColor(17, 24, 39).setFontSize(11);
  const statsY = 50;
  doc.text(`Event Date: ${event.eventDate.toDate().toLocaleDateString('en-IN')}`, 14, statsY);
  doc.text(`Venue: ${event.venue}, ${event.city}`, 14, statsY + 8);
  doc.text(`Total Registrations: ${regs.length} / ${event.maxParticipants || '∞'}`, 14, statsY + 16);
  doc.text(`Attended: ${attended}`, 14, statsY + 24);
  doc.text(`Absent / No-show: ${regs.filter(r => r.status === 'absent').length}`, 14, statsY + 32);
  doc.text(`Attendance Rate: ${attendanceRate}%`, 14, statsY + 40);
  doc.text(`Volunteers: ${vols.length}`, 14, statsY + 48);

  // Participants table
  doc.setFontSize(13).setFont('helvetica', 'bold');
  doc.text('Participant List', 14, statsY + 60);

  autoTable(doc, {
    startY: statsY + 65,
    head: [['#', 'Name', 'Email', 'Registered On', 'Status']],
    body: regs.map((r, i) => [
      i + 1,
      r.participantName,
      r.participantEmail,
      r.registrationDate?.toDate().toLocaleDateString('en-IN'),
      r.status === 'attended' ? '✓ Attended' : r.status === 'absent' ? '✗ Absent' : r.status,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [17, 24, 39] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  // Volunteers table
  const volTableY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(13).setFont('helvetica', 'bold');
  doc.text('Volunteer List', 14, volTableY);

  autoTable(doc, {
    startY: volTableY + 5,
    head: [['#', 'Name', 'Status']],
    body: vols.map((v, i) => [i + 1, v.volunteerName, v.status]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 163, 74] },
  });

  const pdfBuffer = doc.output('arraybuffer');
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report-${event.title.replace(/\s+/g, '-')}.pdf"`,
    },
  });
}
```

### Step 3.3 — Announcements

**Admin creates announcement** at `/admin/announcements/create`:
fields: title, content, target audience, priority, pin toggle, optional event link, expiry date

**Dashboard display logic:**
```typescript
// Fetch for logged-in user with role "participant"
const snaps = await adminDb.collection('announcements')
  .where('targetAudience', 'in', ['all', 'participants'])
  .orderBy('isPinned', 'desc')
  .orderBy('createdAt', 'desc')
  .get();

// Client-side filter: hide expired
const active = snaps.docs.filter(d => {
  const exp = d.data().expiresAt;
  return !exp || exp.toDate() > new Date();
});
```

Priority rendering:
- `urgent` → red full-width banner at top of dashboard
- `high` → yellow banner
- `normal` / `low` → regular card in announcements list
- `isPinned` → always rendered above unpinned items

### Step 3.4 — Admin Analytics Dashboard

```typescript
// app/api/admin/dashboard/route.ts
// Run parallel Firestore count queries:

const [volCount, partCount, upcomingCount, certCount, totalRegs] = await Promise.all([
  adminDb.collection('users').where('role','==','volunteer').where('isApproved','==',true).count().get(),
  adminDb.collection('users').where('role','==','participant').count().get(),
  adminDb.collection('events').where('status','==','upcoming').count().get(),
  adminDb.collection('certificates').count().get(),
  adminDb.collection('participantRegistrations').where('status','!=','cancelled').count().get(),
]);

// Return counts, render as stat cards in the dashboard
```

Dashboard stat cards: Total Approved Volunteers, Total Participants, Upcoming Events, Total Certificates Issued, Total Registrations, Pending Volunteer Approvals.

---

## 8. Phase 4 — Mobile App

**Duration:** ~3 weeks

### Step 4.1 — Expo Project Setup

```bash
npx create-expo-app hopengo-app -t expo-template-blank-typescript
cd hopengo-app

# React Native Firebase
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore

# Required native setup:
# 1. Download google-services.json from Firebase Console → place in android/app/
# 2. Download GoogleService-Info.plist from Firebase Console → place in ios/
# 3. Follow full setup at: https://rnfirebase.io/

# Navigation
npm install expo-router

# PDF on device
npm install expo-print expo-sharing

# UI
npm install react-native-paper @expo/vector-icons
```

### Step 4.2 — Mobile Screens

**Participant App:**
```
app/
  (tabs)/
    index.tsx           → Event feed (upcoming + open for registration)
    my-events.tsx       → Registered events + status
    certificates.tsx    → My certificates + download button
    profile.tsx         → Edit profile, logout
  events/
    [id].tsx            → Event detail + Register button
```

**Volunteer App:**
```
app/
  (tabs)/
    index.tsx           → Events open for volunteering
    applications.tsx    → My applications with status
    assignments.tsx     → Approved events + volunteering instructions
    profile.tsx         → Edit profile, logout
```

### Step 4.3 — Certificate Download on Mobile

```typescript
// Fetches metadata from Firestore, builds HTML, renders to PDF via expo-print
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

async function downloadCertificate(cert: Certificate) {
  const eventDate = cert.eventDate.toDate().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 60px 40px;
                   border: 4px solid #16a34a; margin: 20px;">
        <h1 style="font-size: 32px; color: #111827; margin-bottom: 4px;">HOPENGO</h1>
        <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 4px;">
          Certificate of ${cert.recipientRole === 'volunteer' ? 'Volunteering' : 'Participation'}
        </p>
        <hr style="border-color: #16a34a; margin: 20px auto; width: 60%;" />
        <p style="color: #4b5563;">This is to certify that</p>
        <h2 style="font-size: 28px; color: #111827; margin: 8px 0;">${cert.recipientName}</h2>
        <p style="color: #4b5563;">
          has successfully ${cert.recipientRole === 'volunteer' ? 'volunteered at' : 'participated in'}
        </p>
        <h3 style="font-size: 20px; color: #111827;">${cert.eventTitle}</h3>
        <p style="color: #9ca3af;">Held on ${eventDate}</p>
        <p style="margin-top: 40px; font-size: 10px; color: #9ca3af;">
          Certificate No: ${cert.certificateNumber}
        </p>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html, base64: false });
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Save or Share Certificate',
  });
}
```

### Step 4.4 — Push Notifications

```typescript
// Store push token when app opens
import * as Notifications from 'expo-notifications';
import { updateDoc, doc } from '@react-native-firebase/firestore';

async function registerPushToken(uid: string) {
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await firestore().doc(`users/${uid}`).update({ expoPushToken: token });
}

// Server-side (Next.js API route or Cloud Function) sends notifications:
await fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify([
    { to: pushToken, title: '🎉 Certificate Ready!',
      body: `Your certificate for "${eventTitle}" is ready to download.` },
  ]),
});
```

---

## 9. Phase 5 — Polish & Launch

**Duration:** ~1 week

### Step 9.1 — Email Notifications (Firebase Cloud Functions)

```bash
npm install -g firebase-tools
firebase init functions   # choose TypeScript
cd functions && npm install resend
```

```typescript
// functions/src/index.ts
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const onParticipantRegistration = onDocumentCreated(
  'participantRegistrations/{id}',
  async (event) => {
    const { participantEmail, participantName, eventTitle } = event.data!.data();
    await resend.emails.send({
      from: 'noreply@hopengo.org',
      to: participantEmail,
      subject: `Registration Confirmed — ${eventTitle}`,
      html: `<p>Hi ${participantName}, you're registered for <strong>${eventTitle}</strong>!</p>`,
    });
  }
);

export const onVolunteerApplicationUpdate = onDocumentUpdated(
  'volunteerApplications/{id}',
  async (event) => {
    const before = event.data!.before.data();
    const after  = event.data!.after.data();
    if (before.status === after.status) return; // no change

    if (after.status === 'approved' || after.status === 'rejected') {
      const userSnap = await getFirestore().doc(`users/${after.volunteerId}`).get();
      const email = userSnap.data()?.email;
      // Send approval/rejection email
    }
  }
);

export const onCertificateIssued = onDocumentCreated(
  'certificates/{id}',
  async (event) => {
    const { recipientId, eventTitle } = event.data!.data();
    const userSnap = await getFirestore().doc(`users/${recipientId}`).get();
    const email = userSnap.data()?.email;
    const name  = userSnap.data()?.fullName;
    await resend.emails.send({
      from: 'noreply@hopengo.org',
      to: email,
      subject: `Your Certificate is Ready — ${eventTitle}`,
      html: `<p>Hi ${name}, your certificate for <strong>${eventTitle}</strong> is available on your dashboard.</p>`,
    });
  }
);
```

### Step 9.2 — Performance

- All event listing and dashboard pages → **Next.js Server Components** (Firestore reads server-side, no client waterfall)
- Add `loading.tsx` files for Suspense boundaries on every dashboard route
- Paginate event listings using Firestore cursor pagination (`startAfter`)
- Add `React.cache()` for repeated Firestore reads within a single request

**`next.config.ts` for external banner images:**
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
```

### Step 9.3 — Security Hardening

- Never import `src/lib/firebase/admin.ts` in Client Components — only in API routes and Server Components
- All write operations go through API routes with session verification (never direct Firestore client writes for sensitive ops)
- Rate-limit registration endpoint: use `@upstash/ratelimit` + Vercel KV (or simple in-memory via edge config)
- Sanitize announcement content if displaying as HTML (use `DOMPurify`)
- Set `Content-Security-Policy` headers in `middleware.ts`

### Step 9.4 — Deployment

**Web (Vercel):**
```bash
# Deploy
vercel --prod

# In Vercel dashboard → Settings → Environment Variables:
# Add all variables from Section 12
# IMPORTANT: For FIREBASE_PRIVATE_KEY, paste the raw value with literal \n characters
# Vercel handles the escaping correctly
```

**Cloud Functions:**
```bash
firebase deploy --only functions
```

**Mobile (EAS):**
```bash
npm install -g eas-cli
eas login
eas build --platform all --profile production
eas submit --platform android
eas submit --platform ios
```

---

## 10. API Route Reference

### Auth
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/auth/session` | Public | Exchange Firebase ID token for session cookie |
| DELETE | `/api/auth/session` | Auth | Logout — delete session cookie |
| GET | `/api/auth/verify` | Auth | Verify session and return role (used by middleware) |

### Events
| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List public events with optional filters |
| POST | `/api/events` | Admin | Create event |
| GET | `/api/events/[id]` | Public | Single event details |
| PATCH | `/api/events/[id]` | Admin | Update event fields |
| PATCH | `/api/events/[id]/toggle-participant-reg` | Admin | Flip participant registration open/closed |
| PATCH | `/api/events/[id]/toggle-volunteer-reg` | Admin | Flip volunteer registration open/closed |
| GET | `/api/events/[id]/report` | Admin | Generate + stream event PDF report |
| GET | `/api/events/[id]/registrations` | Admin | All participant registrations for event |
| GET | `/api/events/[id]/volunteer-applications` | Admin | All volunteer applications for event |

### Registrations
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/registrations` | Participant | Register (atomic transaction with auto-close) |
| DELETE | `/api/registrations/[id]` | Participant | Cancel registration |
| GET | `/api/registrations/my` | Participant | My registrations |
| PATCH | `/api/registrations/[id]/attendance` | Admin | Mark attended / absent |

### Volunteer Applications
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/volunteer-applications` | Volunteer | Apply to volunteer |
| DELETE | `/api/volunteer-applications/[id]` | Volunteer | Withdraw application |
| GET | `/api/volunteer-applications/my` | Volunteer | My applications |
| PATCH | `/api/volunteer-applications/[id]` | Admin | Approve or reject |

### Certificates
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/certificates/issue` | Admin | Issue certificates (writes Firestore only, no PDF) |
| GET | `/api/certificates/my` | Participant / Volunteer | My certificate list |
| GET | `/api/certificates/[id]/download` | Participant / Volunteer / Admin | Generate + stream PDF |
| GET | `/api/certificates/verify/[certNumber]` | Public | Verify certificate authenticity |

### Admin
| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Admin | Aggregate metrics |
| GET | `/api/admin/users` | Admin | All users list |
| PATCH | `/api/admin/users/[uid]/approve` | Admin | Approve volunteer account |
| PATCH | `/api/admin/users/[uid]/toggle-active` | Admin | Activate / deactivate user |

---

## 11. Folder Structure

```
hopengo/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── pending-approval/page.tsx
│   │   ├── (public)/
│   │   │   ├── page.tsx                         ← Landing
│   │   │   ├── events/
│   │   │   │   ├── page.tsx                     ← Public event listing
│   │   │   │   └── [eventId]/page.tsx
│   │   │   └── verify/[certNumber]/page.tsx     ← Public QR verification
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── events/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── create/page.tsx
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx
│   │   │       │       └── participants/page.tsx
│   │   │       ├── volunteers/page.tsx
│   │   │       ├── announcements/page.tsx
│   │   │       └── reports/page.tsx
│   │   ├── (volunteer)/
│   │   │   ├── layout.tsx
│   │   │   └── volunteer/
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── applications/page.tsx
│   │   │       └── history/page.tsx
│   │   ├── (participant)/
│   │   │   ├── layout.tsx
│   │   │   └── participant/
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── certificates/page.tsx
│   │   │       └── history/page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── session/route.ts
│   │       │   └── verify/route.ts
│   │       ├── events/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       ├── report/route.ts
│   │       │       ├── registrations/route.ts
│   │       │       ├── toggle-participant-reg/route.ts
│   │       │       ├── toggle-volunteer-reg/route.ts
│   │       │       └── volunteer-applications/route.ts
│   │       ├── registrations/
│   │       │   ├── route.ts
│   │       │   ├── my/route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       └── attendance/route.ts
│   │       ├── volunteer-applications/
│   │       │   ├── route.ts
│   │       │   ├── my/route.ts
│   │       │   └── [id]/route.ts
│   │       ├── certificates/
│   │       │   ├── issue/route.ts
│   │       │   ├── my/route.ts
│   │       │   ├── verify/[certNumber]/route.ts
│   │       │   └── [id]/download/route.ts
│   │       └── admin/
│   │           ├── dashboard/route.ts
│   │           └── users/[uid]/route.ts
│   ├── components/
│   │   ├── ui/                                  ← shadcn/ui components
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventForm.tsx
│   │   │   └── SeatProgressBar.tsx
│   │   ├── certificates/
│   │   │   └── CertificateCard.tsx
│   │   └── shared/
│   │       └── AnnouncementBanner.tsx
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── client.ts                        ← Browser Firebase (auth, db)
│   │   │   └── admin.ts                         ← Server Firebase Admin SDK
│   │   ├── auth/
│   │   │   ├── login.ts
│   │   │   └── useAuthUser.ts
│   │   └── utils/
│   │       ├── cert-number.ts                   ← Certificate number generator
│   │       └── format-date.ts
│   ├── hooks/
│   │   └── useAuthUser.ts
│   ├── store/
│   │   └── authStore.ts                         ← Zustand: current user + profile
│   └── types/
│       ├── firestore.ts                         ← TypeScript types for all Firestore docs
│       └── index.ts
├── middleware.ts                                ← Session-based route protection
├── next.config.ts
├── firestore.rules
├── .env.local
└── hopengo-app/                             ← Expo mobile app
    ├── app/
    │   ├── (tabs)/
    │   └── events/
    ├── components/
    └── lib/
```

---

## 12. Environment Variables

```env
# .env.local — Next.js Web (NEVER commit this file)

# ── Firebase Client (safe to expose, prefixed NEXT_PUBLIC) ──────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hopengo.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hopengo
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc

# ── Firebase Admin (server-only, NEVER use NEXT_PUBLIC prefix) ──────────────
FIREBASE_PROJECT_ID=hopengo
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@hopengo.iam.gserviceaccount.com
# Paste private key exactly as in service-account JSON, keeping literal \n
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvA...\n-----END PRIVATE KEY-----\n"

# ── App ────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=HopeNGO

# ── Email (Cloud Functions) ─────────────────────────────────────────────────
RESEND_API_KEY=re_...
```

```env
# hopengo-app/.env — Expo Mobile App
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_API_URL=https://yourdomain.com
```

---

## 13. Deployment Checklist

### Firebase Console
- [ ] Firestore security rules published (Section 4)
- [ ] Firebase Auth → Email/Password enabled
- [ ] Composite Firestore indexes created:
  - `events`: `status ASC, eventDate ASC`
  - `participantRegistrations`: `eventId ASC, status ASC`
  - `volunteerApplications`: `eventId ASC, status ASC`
  - `announcements`: `targetAudience ASC, isPinned DESC, createdAt DESC`
- [ ] Firebase project upgraded to **Blaze plan** (required for Cloud Functions + outbound HTTP)
- [ ] Cloud Functions deployed: `firebase deploy --only functions`

### Vercel
- [ ] All environment variables added in Vercel dashboard
- [ ] `FIREBASE_PRIVATE_KEY` value uses literal `\n` (not actual newlines) — Vercel handles this correctly
- [ ] `next.config.ts` includes `images.remotePatterns` to allow all HTTPS image URLs
- [ ] Custom domain configured and DNS pointed

### Pre-Launch Testing
- [ ] **Participant flow**: Register → attend event → admin issues cert → participant downloads PDF
- [ ] **Volunteer flow**: Register → admin approves account → apply to event → admin approves → see instructions
- [ ] **Admin flow**: Create event → manage registrations → mark attendance → issue certs → download report
- [ ] **Auto-close**: Register until `maxParticipants` is hit → confirm `participantRegistrationOpen` flips to `false` atomically
- [ ] **Certificate QR**: Scan QR code on downloaded PDF → opens `/verify/[certNumber]` → shows ✅ authentic
- [ ] **Banner images**: Confirm external image URLs render correctly on event cards
- [ ] **Session expiry**: Log in → wait for session expiry → confirm redirect to login

### Mobile (EAS)
- [ ] `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) from **production** Firebase project
- [ ] `eas.json` production profile configured
- [ ] App Store / Play Store developer accounts set up

---

## Milestone Summary

| Phase | Duration | Key Deliverables |
|---|---|---|
| Phase 1 — Foundation | 2 weeks | Firebase + Next.js 16 setup, session cookie auth, role-based middleware |
| Phase 2 — Core Features | 4 weeks | Event CRUD, atomic participant registration, volunteer applications, seat auto-close |
| Phase 3 — Advanced Features | 3 weeks | Dynamic certificate PDF, event report PDF, announcements, admin analytics |
| Phase 4 — Mobile App | 3 weeks | Expo app (participant + volunteer), mobile certificate download, push notifications |
| Phase 5 — Polish & Launch | 1 week | Cloud Functions email triggers, rate limiting, security hardening, deployment |
| **Total** | **~13 weeks** | Full platform live on web + mobile |

---

*Project: HopeNGO — NGO Management Platform*
*Stack: Next.js 16.2 · firebase@12.11.0 · firebase-admin@13.7.0 · shadcn/ui CLI v4 · Expo SDK 52*
*Version: 2.0 — Firebase Edition (no image storage, dynamic certificate generation)*