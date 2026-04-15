# HopeNGO — NGO Platform
## Updated Project Plan v3/v4 — Complete Rebuild Guide
### Stack: Next.js 16 · Firebase · shadcn/ui · Expo

> **[v4 UPDATE NOTICE]**
> The platform journey has fundamentally shifted as per the latest requirements:
> - **Public Role Only (No Participants)**: There is no longer a Participant role, meaning the public cannot formally register, take up seat capacity, or get certificates. They can only view the events page and make donations.
> - **Volunteers are the sole end-users**: Volunteers register (requires Admin approval), apply/enroll for open events, attend, and receive Certificates once attendance is marked.
> - **Coordinator Reporting & Image Attendance**: Event Coordinators are assigned to events. When checking in attendees, they DO NOT use a digital checklist. Instead, they submit an **Event Report** containing event details and **Attendance as Image URLs** (e.g., photos of a sign-in sheet).
> - **Admin Verification**: The Admin receives the Coordinator's Event Report, views the uploaded attendance images, and manually marks attendance for the Volunteers, triggering their certificates.
> - **Custom Donation Links**: Admins can now create Custom Donation Links and view donations filtered by every event or campaign.
> 
> *The documentation below (v3) contains legacy references to "Participant registrations" and "Per-session digital attendance" which are superseded by the v4 rules above.*

---

## Table of Contents

1. [What Changed from v2](#1-what-changed-from-v2)
2. [Roles & Permissions Matrix](#2-roles--permissions-matrix)
3. [Tech Stack & Versions](#3-tech-stack--versions)
4. [Firestore Data Model](#4-firestore-data-model)
5. [Critical Fixes — Localhost & Hardcoded URLs](#5-critical-fixes--localhost--hardcoded-urls)
6. [Phase 1 — Foundation Updates](#6-phase-1--foundation-updates)
7. [Phase 2 — Core Feature Updates](#7-phase-2--core-feature-updates)
8. [Phase 3 — Advanced Features](#8-phase-3--advanced-features)
9. [Phase 4 — Recurring Events System](#9-phase-4--recurring-events-system)
10. [Phase 5 — Donations Page](#10-phase-5--donations-page)
11. [Phase 6 — Mobile App](#11-phase-6--mobile-app)
12. [Phase 7 — Polish & Launch](#12-phase-7--polish--launch)
13. [API Route Reference](#13-api-route-reference)
14. [Folder Structure](#14-folder-structure)
15. [Environment Variables](#15-environment-variables)
16. [Deployment Checklist](#16-deployment-checklist)

---

## 1. What Changed from v2

| Area | v2 (Old) | v3 (New) |
|---|---|---|
| Roles | Admin, Volunteer, Participant | Admin, Volunteer, Event Coordinator (Participant removed) |
| Participant login | Existed | Removed — public can register for events without an account |
| Event Coordinator | Did not exist | New role: admin assigns events, coordinator manages them |
| Donations | Did not exist | New `/donations` public page + nav link |
| Recurring events | Not supported | Full system: monthly workshops with per-session attendance |
| Auto certificates | Manual only | Auto-issued when all sessions of a recurring event are attended |
| Volunteer registration | From event page only | Also from volunteer dashboard directly |
| Attendance (recurring) | Single mark | Per-session date-based tracking |
| Admin/Coordinator stats | Not on dashboard | Full event statistics on both dashboards |
| Localhost hardcode | Present in several places | Fully removed — uses `NEXT_PUBLIC_APP_URL` everywhere |
| Certificate flow | Manual admin trigger | Auto-triggered on recurring event completion |

---

## 2. Roles & Permissions Matrix

### Admin
- ✅ Create / edit / cancel events (regular + recurring)
- ✅ Set max participant limit with auto-close on full
- ✅ Toggle participant / volunteer registration open/closed per event
- ✅ Approve or reject volunteer account registrations
- ✅ Approve or reject event coordinator account registrations
- ✅ Approve or reject per-event volunteer applications
- ✅ Search users and assign an event coordinator to any event
- ✅ View participant list + seat fill status per event
- ✅ Mark attendance per event (or per session for recurring)
- ✅ Manually issue certificates at any time
- ✅ Auto-certificate system handles recurring events automatically
- ✅ Generate and download event PDF reports
- ✅ Post announcements (targeted by role)
- ✅ Activate / deactivate user accounts
- ✅ Full event statistics on dashboard (registrations, attendance rate, certs issued)
- ✅ View donations received

### Event Coordinator
- ✅ Account created only after admin approval
- ✅ View assigned events on dashboard
- ✅ Upload event-related files/documents (post-event report, photos list, notes) via URL
- ✅ Mark attendance for participants and volunteers at their assigned events
- ✅ View event statistics: registrations, attendance rate, seat fill for assigned events
- ✅ View volunteer list for assigned events
- ✅ View participant list for assigned events
- ✅ Cannot create events, cannot assign other coordinators, cannot issue certificates

### Volunteer
- ✅ Account created only after admin approval
- ✅ Browse upcoming events on dashboard and apply to volunteer directly (no need to go to event page)
- ✅ Track application status: pending → approved / rejected
- ✅ View approved event details + volunteering instructions on dashboard
- ✅ View personal volunteering history
- ✅ Update profile (skills, contact, bio)
- ✅ Download certificates issued for volunteer service

### Public (No Login Required)
- ✅ Browse public events at `/events`
- ✅ Register for events (name + email + phone — no account needed)
- ✅ View and download certificate via `/verify/[certNumber]` (QR link)
- ✅ Visit `/donations` page

---

## 3. Tech Stack & Versions

### Web Frontend
| Package | Version | Purpose |
|---|---|---|
| `next` | `16.2.x` | Full-stack React framework |
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

### New Additions
| Package | Version | Purpose |
|---|---|---|
| `@upstash/ratelimit` | `latest` | Rate limiting on public registration endpoint |

---

## 4. Firestore Data Model

### Collection: `users`
```
users/{uid}
  email: string
  role: "admin" | "volunteer" | "event_coordinator"
  isApproved: boolean       ← false until admin approves (volunteers + coordinators)
  isActive: boolean
  fullName: string
  phone: string
  city: string
  state: string
  occupation: string        ← volunteers only
  skills: string[]          ← volunteers only
  bio: string
  emergencyContact: string  ← volunteers only
  expoPushToken: string
  createdAt: Timestamp
  updatedAt: Timestamp
```

### Collection: `events`
```
events/{eventId}
  title: string
  description: string
  eventType: string
  isRecurring: boolean          ← NEW: true for monthly workshops etc.
  recurringDay: number | null   ← NEW: day of month (e.g. 15 = every 15th)
  recurringMonth: string        ← NEW: "monthly" | "weekly" | null
  totalSessions: number | null  ← NEW: total sessions for recurring (e.g. 6 months = 6)

  eventDate: Timestamp          ← for one-time events; first session date for recurring
  startTime: string
  endTime: string
  venue: string
  city: string
  state: string
  bannerImageUrl: string        ← external URL only, no upload
  tags: string[]

  # Participant settings (participants register without account)
  maxParticipants: number | null
  participantCount: number
  participantRegistrationOpen: boolean
  participantDeadline: Timestamp | null

  # Volunteer settings
  maxVolunteers: number | null
  volunteerCount: number
  volunteerRegistrationOpen: boolean
  volunteerDeadline: Timestamp | null
  volunteerInstructions: string

  # Coordinator assignment
  coordinatorId: string | null  ← NEW: uid of assigned event coordinator
  coordinatorName: string | null

  # Coordinator uploads (URLs)
  coordinatorUploads: Array<{   ← NEW
    label: string
    url: string
    uploadedAt: Timestamp
  }>

  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  isPublic: boolean
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
```

### Collection: `eventSessions` (NEW — for recurring events)
```
eventSessions/{sessionId}
  eventId: string               ← parent recurring event
  sessionNumber: number         ← 1, 2, 3...
  sessionDate: Timestamp        ← actual date of this session
  attendanceOpen: boolean       ← admin/coordinator can open attendance
  attendanceClosed: boolean     ← locked after marking
  createdAt: Timestamp
```

### Collection: `participantRegistrations`
```
participantRegistrations/{regId}
  eventId: string
  participantName: string       ← collected at registration (no account needed)
  participantEmail: string
  participantPhone: string      ← NEW
  registrationDate: Timestamp
  status: "registered" | "attended" | "absent" | "cancelled"

  # For recurring events — per-session attendance
  sessionAttendance: {          ← NEW: map of sessionId → "attended" | "absent" | null
    [sessionId: string]: "attended" | "absent" | null
  }
  sessionsAttended: number      ← NEW: count of attended sessions
  certificateAutoIssued: boolean ← NEW: true once auto-cert fires

  attendanceMarkedAt: Timestamp | null
  attendanceMarkedBy: string | null
  notes: string
```

### Collection: `volunteerApplications`
```
volunteerApplications/{appId}
  eventId: string
  volunteerId: string
  volunteerName: string
  appliedAt: Timestamp
  status: "pending" | "approved" | "rejected" | "cancelled"
  reviewedAt: Timestamp | null
  reviewedBy: string | null
  adminNotes: string

  # For recurring events — per-session attendance
  sessionAttendance: {          ← NEW
    [sessionId: string]: "attended" | "absent" | null
  }
  sessionsAttended: number
```

### Collection: `certificates`
```
certificates/{certId}
  certificateNumber: string     ← "HOPE-{YYYY}-{eventShort}-{seq}"
  eventId: string
  eventTitle: string
  eventDate: Timestamp
  recipientName: string         ← for participants (no uid needed)
  recipientEmail: string        ← NEW: used to link to participant registration
  recipientId: string | null    ← uid for volunteers/coordinators; null for public participants
  recipientRole: "participant" | "volunteer" | "event_coordinator"
  issuedDate: Timestamp
  issuedBy: string | null       ← admin uid; null if auto-issued
  isAutoIssued: boolean         ← NEW: true if triggered by recurring completion
  isVisible: boolean
  qrVerifyUrl: string
```

### Collection: `donations` (NEW)
```
donations/{donationId}
  donorName: string
  donorEmail: string
  amount: number
  currency: string              ← "INR"
  message: string | null
  paymentMethod: string         ← "upi" | "bank_transfer" | "other"
  transactionId: string | null  ← donor fills this in after paying
  status: "pending" | "verified" | "rejected"
  verifiedBy: string | null     ← admin uid
  createdAt: Timestamp
```

### Collection: `announcements`
```
announcements/{id}
  title: string
  content: string
  targetAudience: "all" | "volunteers" | "coordinators" | "admins"
  priority: "low" | "normal" | "high" | "urgent"
  isPinned: boolean
  eventId: string | null
  createdBy: string
  createdAt: Timestamp
  expiresAt: Timestamp | null
```

### Updated Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function userRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isAdmin() { return userRole() == 'admin'; }
    function isCoordinator() { return userRole() == 'event_coordinator'; }
    function isVolunteer() { return userRole() == 'volunteer'; }
    function isOwner(uid) { return request.auth.uid == uid; }
    function isApproved() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isApproved == true;
    }

    match /users/{uid} {
      allow read: if isOwner(uid) || isAdmin();
      allow update: if isOwner(uid) || isAdmin();
      allow create: if request.auth != null;
    }

    match /events/{eventId} {
      allow read: if resource.data.isPublic == true || isAdmin()
                    || (isCoordinator() && resource.data.coordinatorId == request.auth.uid);
      allow write: if isAdmin();
    }

    match /eventSessions/{sessionId} {
      allow read: if isAdmin() || isCoordinator();
      allow write: if isAdmin();
    }

    // Public participants register without auth — allow unauthenticated create
    match /participantRegistrations/{regId} {
      allow read: if isAdmin()
                    || (isCoordinator() && get(/databases/$(database)/documents/events/$(resource.data.eventId)).data.coordinatorId == request.auth.uid);
      allow create: if true;   // public registration, no auth required
      allow update: if isAdmin() || isCoordinator();
    }

    match /volunteerApplications/{appId} {
      allow read: if isAdmin() || isOwner(resource.data.volunteerId)
                    || isCoordinator();
      allow create: if isVolunteer() && isApproved() && isOwner(request.resource.data.volunteerId);
      allow update: if isAdmin() || isCoordinator();
    }

    match /certificates/{certId} {
      allow read: if isAdmin() || isOwner(resource.data.recipientId)
                    || resource.data.isVisible == true;
      allow write: if isAdmin();
    }

    match /announcements/{annId} {
      allow read: if request.auth != null || resource.data.targetAudience == 'all';
      allow write: if isAdmin();
    }

    match /donations/{donId} {
      allow create: if true;   // public can submit donations
      allow read: if isAdmin();
      allow update: if isAdmin();
    }
  }
}
```

---

## 5. Critical Fixes — Localhost & Hardcoded URLs

This is the **most urgent fix** since you are already on Vercel and seeing issues.

### Root Cause
Anywhere `http://localhost:3000` appears hardcoded in the codebase must be replaced with
a dynamic base URL helper. These typically appear in:
- Middleware `fetch()` calls (verifying session)
- Certificate QR code URL generation
- API routes that construct absolute URLs

### Fix — Create a Base URL Utility

```typescript
// src/lib/utils/base-url.ts

/**
 * Returns the absolute base URL of the app.
 * Works in both server-side (API routes, Server Components) and client-side contexts.
 * Never hardcodes localhost.
 */
export function getBaseUrl(): string {
  // Browser: use window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server: use NEXT_PUBLIC_APP_URL from environment
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Vercel auto-provides this during builds and runtime
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback for local dev only
  return 'http://localhost:3000';
}
```

### Fix — Middleware (most common breakage on Vercel)

The middleware calls `/api/auth/verify` using a full URL. On Vercel, the `request.nextUrl.origin`
approach also breaks in edge runtime. Use the `x-forwarded-host` header instead:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Use firebase-admin directly in middleware — avoids the internal fetch entirely
    // NOTE: middleware runs in Node.js runtime (not Edge) so admin SDK works here
    const decoded = await adminAuth.verifySessionCookie(session, true);
    const role = decoded.role as string; // set as custom claim OR fetch from Firestore

    const ROLE_PATHS: Record<string, string> = {
      admin: '/admin',
      event_coordinator: '/coordinator',
      volunteer: '/volunteer',
    };

    const allowedPrefix = ROLE_PATHS[role];

    if (!allowedPrefix || !pathname.startsWith(allowedPrefix)) {
      return NextResponse.redirect(new URL(`${allowedPrefix ?? '/login'}/dashboard`, request.url));
    }

    return NextResponse.next();
  } catch {
    // Session invalid or expired
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/coordinator/:path*', '/volunteer/:path*'],
};
```

> **Important:** Set the user's role as a **Firebase custom claim** so it's embedded in the
> session cookie and readable in middleware without a Firestore fetch on every request:
>
> ```typescript
> // When approving a user in /api/admin/users/[uid]/approve/route.ts
> await adminAuth.setCustomUserClaims(uid, { role: 'volunteer' });
> // Also set on initial registration for admin:
> await adminAuth.setCustomUserClaims(uid, { role: 'admin' });
> ```

### Fix — QR Code URL in Certificates

```typescript
// BEFORE (broken on Vercel):
const qrVerifyUrl = `http://localhost:3000/verify/${certNumber}`;

// AFTER (correct):
import { getBaseUrl } from '@/lib/utils/base-url';
const qrVerifyUrl = `${getBaseUrl()}/verify/${certNumber}`;
```

### Fix — Session API Route Internal Fetch

```typescript
// BEFORE (broken):
const verifyRes = await fetch(`http://localhost:3000/api/auth/verify`, { ... });

// AFTER — don't use internal fetch at all; call adminAuth directly (shown in middleware above)
```

### Environment Variable for Vercel

Make sure this is set in your **Vercel dashboard → Settings → Environment Variables**:
```env
NEXT_PUBLIC_APP_URL=https://your-actual-domain.vercel.app
```
And update it to your custom domain once you have one.

---

## 6. Phase 1 — Foundation Updates

### 6.1 — Remove Participant Role from Auth

Participants no longer have accounts. They register for events using just name + email + phone.
Remove any participant-related auth code, registration page, and Firestore user creation for participants.

**What to delete:**
- `app/(auth)/register/page.tsx` participant option (keep volunteer + coordinator options)
- Any `role === 'participant'` checks in middleware
- Participant dashboard routes

**Public registration stays** — but it writes to `participantRegistrations` directly, not `users`.

### 6.2 — Add Event Coordinator Role to Auth

```typescript
// Registration page now offers two choices:
// 1. Volunteer
// 2. Event Coordinator

// Both create users/{uid} with isApproved: false
// Admin must approve before they can log in

// On registration, set custom claim immediately (but isApproved: false):
// Note: custom claim role is set, but middleware ALSO checks isApproved from Firestore
// So the claim alone doesn't grant access — admin approval is still required
await adminAuth.setCustomUserClaims(uid, { role: 'event_coordinator' });
```

### 6.3 — Updated Middleware with Coordinator Path

```typescript
// middleware.ts — updated matcher
export const config = {
  matcher: ['/admin/:path*', '/coordinator/:path*', '/volunteer/:path*'],
};

const ROLE_PATHS = {
  admin: '/admin',
  event_coordinator: '/coordinator',
  volunteer: '/volunteer',
};
```

### 6.4 — Updated Navigation (Public)

The public nav now has:
- Home (`/`)
- Events (`/events`)
- **Donations (`/donations`)** ← NEW
- Login (`/login`)

```tsx
// src/components/shared/PublicNav.tsx
const navLinks = [
  { label: 'Home',      href: '/' },
  { label: 'Events',    href: '/events' },
  { label: 'Donations', href: '/donations' },
  { label: 'Login',     href: '/login' },
];
```

---

## 7. Phase 2 — Core Feature Updates

### 7.1 — Public Event Registration (No Account Required)

Participants register for events without creating an account.
The form collects name, email, phone and writes directly to `participantRegistrations`.

```typescript
// app/api/registrations/route.ts
export async function POST(req: Request) {
  const { eventId, participantName, participantEmail, participantPhone } = await req.json();

  // No session check — this is public
  // Validate input with Zod
  const schema = z.object({
    eventId: z.string(),
    participantName: z.string().min(2),
    participantEmail: z.string().email(),
    participantPhone: z.string().min(10),
  });
  const data = schema.parse({ eventId, participantName, participantEmail, participantPhone });

  // Atomic transaction (same as before — check seats, increment, auto-close)
  await adminDb.runTransaction(async (tx) => {
    const eventRef = adminDb.doc(`events/${data.eventId}`);
    const eventSnap = await tx.get(eventRef);
    const event = eventSnap.data()!;

    if (!event.participantRegistrationOpen) throw new Error('REGISTRATION_CLOSED');
    if (event.maxParticipants && event.participantCount >= event.maxParticipants) {
      throw new Error('EVENT_FULL');
    }

    // Check duplicate by email for this event
    const dupQuery = await adminDb.collection('participantRegistrations')
      .where('eventId', '==', data.eventId)
      .where('participantEmail', '==', data.participantEmail)
      .where('status', '!=', 'cancelled')
      .limit(1).get();
    if (!dupQuery.empty) throw new Error('ALREADY_REGISTERED');

    const regRef = adminDb.collection('participantRegistrations').doc();
    tx.set(regRef, {
      ...data,
      registrationDate: FieldValue.serverTimestamp(),
      status: 'registered',
      sessionAttendance: {},
      sessionsAttended: 0,
      certificateAutoIssued: false,
      attendanceMarkedAt: null,
      attendanceMarkedBy: null,
      notes: '',
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
}
```

### 7.2 — Volunteer Dashboard: Register for Events Directly

Volunteers can see available events and apply to volunteer directly from their dashboard —
no need to navigate to the event page.

```tsx
// app/(volunteer)/volunteer/dashboard/page.tsx
// Server Component — fetches:
// 1. User's existing applications (to show status)
// 2. Events where volunteerRegistrationOpen === true AND status === 'upcoming'
//    AND user hasn't already applied

// Renders two sections:
// Section A: "Available Events" — cards with "Apply to Volunteer" button inline
// Section B: "My Applications" — status tracker
// Section C: "My Certificates" — dedicated section to view/download earned Volunteer certificates
// Note: This Certificates section must also be implemented identically in the Mobile App dashboard.

// The Apply button calls POST /api/volunteer-applications directly from the dashboard
```

**Inline apply component:**
```tsx
// src/components/volunteer/InlineApplyButton.tsx
'use client';
import { useState } from 'react';

export function InlineApplyButton({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'applied' | 'error'>('idle');

  async function handleApply() {
    setStatus('loading');
    const res = await fetch('/api/volunteer-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    });
    setStatus(res.ok ? 'applied' : 'error');
  }

  if (status === 'applied') return <span className="text-green-600 text-sm font-medium">✓ Applied</span>;

  return (
    <button
      onClick={handleApply}
      disabled={status === 'loading'}
      className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-lg transition disabled:opacity-50"
    >
      {status === 'loading' ? 'Applying...' : 'Apply to Volunteer'}
    </button>
  );
}
```

### 7.3 — Event Coordinator: Assigned Events Dashboard

```tsx
// app/(coordinator)/coordinator/dashboard/page.tsx
// Fetches events where coordinatorId === currentUser.uid

// Dashboard shows:
// 1. Assigned events list (with event stats)
// 2. For each event: participant count, volunteer count, attendance rate, sessions progress
// 3. Quick action: "Mark Attendance" button per event
// 4. Upload section: add URL + label to coordinatorUploads array on event doc
```

**Event statistics card (shared between Admin and Coordinator):**
```tsx
// src/components/events/EventStatsCard.tsx
interface EventStats {
  participantCount: number;
  maxParticipants: number | null;
  volunteerCount: number;
  attendedCount: number;
  totalSessions?: number;
  completedSessions?: number;
}

export function EventStatsCard({ stats, eventTitle }: { stats: EventStats; eventTitle: string }) {
  const fillPct = stats.maxParticipants
    ? Math.round((stats.participantCount / stats.maxParticipants) * 100)
    : null;
  const attendRate = stats.participantCount > 0
    ? Math.round((stats.attendedCount / stats.participantCount) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/40 rounded-xl">
      <div className="text-center">
        <p className="text-2xl font-bold">{stats.participantCount}{stats.maxParticipants ? `/${stats.maxParticipants}` : ''}</p>
        <p className="text-xs text-muted-foreground">Registrations</p>
        {fillPct !== null && (
          <div className="mt-1 h-1.5 bg-muted rounded-full">
            <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${fillPct}%` }} />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold">{stats.volunteerCount}</p>
        <p className="text-xs text-muted-foreground">Volunteers</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold">{attendRate}%</p>
        <p className="text-xs text-muted-foreground">Attendance Rate</p>
      </div>
      {stats.totalSessions && (
        <div className="text-center">
          <p className="text-2xl font-bold">{stats.completedSessions}/{stats.totalSessions}</p>
          <p className="text-xs text-muted-foreground">Sessions Done</p>
        </div>
      )}
    </div>
  );
}
```

### 7.4 — Coordinator Event Report & Image Attendance

Instead of digitally checking off attendees per session, the Coordinator submits a holistic **Event Report** once an event concludes. This report includes event outcome details and **Attendance Image URLs** (e.g., photos of signed paper sheets).

```typescript
// app/api/events/[id]/coordinator-report/route.ts
export async function POST(req: Request) {
  // 1. Verify session — must be event_coordinator assigned to this event
  const session = (await cookies()).get('session')?.value;
  const decoded = await adminAuth.verifySessionCookie(session!, true);

  const eventSnap = await adminDb.doc(`events/${params.id}`).get();
  if (eventSnap.data()?.coordinatorId !== decoded.uid) {
    return new Response('Forbidden', { status: 403 });
  }

  const { reportNotes, attendanceImageUrls } = await req.json();
  const schema = z.object({
    reportNotes: z.string().min(10),
    attendanceImageUrls: z.array(z.string().url()).min(1),
  });
  const data = schema.parse({ reportNotes, attendanceImageUrls });

  await adminDb.doc(`events/${params.id}`).update({
    coordinatorReport: {
      notes: data.reportNotes,
      attendanceImages: data.attendanceImageUrls,
      submittedAt: Timestamp.now(),
    },
    status: 'completed',
    updatedAt: FieldValue.serverTimestamp(),
  });

  return Response.json({ status: 'ok' });
}
```

*Admin Verification:* Once the Coordinator submits this report, the Admin views the `attendanceImages` and manually issues Certificates for the Volunteers listed on those sheets.

### 7.5 — Admin: Assign Event Coordinator

```tsx
// app/(admin)/admin/events/[id]/page.tsx
// New section: "Assign Coordinator"

// Search input → calls GET /api/admin/users?role=event_coordinator&search=query
// Returns list of approved coordinators matching search
// Admin clicks "Assign" → PATCH /api/events/[id]/assign-coordinator
// { coordinatorId, coordinatorName }
```

```typescript
// app/api/events/[id]/assign-coordinator/route.ts
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Verify admin session
  const { coordinatorId } = await req.json();

  const coordinatorSnap = await adminDb.doc(`users/${coordinatorId}`).get();
  const coordinator = coordinatorSnap.data();

  if (!coordinator || coordinator.role !== 'event_coordinator' || !coordinator.isApproved) {
    return Response.json({ error: 'Invalid coordinator' }, { status: 400 });
  }

  await adminDb.doc(`events/${id}`).update({
    coordinatorId,
    coordinatorName: coordinator.fullName,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return Response.json({ status: 'ok' });
}
```

### 7.6 — Admin Dashboard Statistics

```tsx
// app/(admin)/admin/dashboard/page.tsx — Server Component

// Parallel Firestore queries:
const [
  volunteerCount, coordinatorCount, upcomingCount,
  certCount, totalRegs, pendingApprovals, donationStats
] = await Promise.all([
  adminDb.collection('users').where('role','==','volunteer').where('isApproved','==',true).count().get(),
  adminDb.collection('users').where('role','==','event_coordinator').where('isApproved','==',true).count().get(),
  adminDb.collection('events').where('status','==','upcoming').count().get(),
  adminDb.collection('certificates').count().get(),
  adminDb.collection('participantRegistrations').where('status','!=','cancelled').count().get(),
  adminDb.collection('users').where('isApproved','==',false).count().get(),
  adminDb.collection('donations').where('status','==','verified').get(),
]);

const totalDonations = donationStats.docs.reduce((sum, d) => sum + d.data().amount, 0);

// Render stat cards:
// Total Volunteers | Total Coordinators | Upcoming Events | Certificates Issued
// Total Registrations | Pending Approvals (badge) | Total Donations (INR)

// Recent events section with EventStatsCard per event
```

---

## 8. Phase 3 — Advanced Features

### 8.1 — Certificate Number Format Update

Update prefix from `ANTI-` to `HOPE-`:

```typescript
// src/lib/utils/cert-number.ts
export function generateCertNumber(eventId: string, seq: number): string {
  const year = new Date().getFullYear();
  const eventShort = eventId.slice(0, 6).toUpperCase();
  const seqPadded = String(seq).padStart(4, '0');
  return `HOPE-${year}-${eventShort}-${seqPadded}`;
  // e.g. HOPE-2025-ABC123-0001
}
```

### 8.2 — Certificate for Public Participants (No recipientId)

Since participants no longer have accounts, certificates are linked by email instead of uid.

```typescript
// app/api/certificates/issue/route.ts
// For participant certificates:
// recipientId: null  (no user account)
// recipientEmail: participant's email from participantRegistrations doc
// recipientName: participant's name from participantRegistrations doc

// The verify page (/verify/[certNumber]) is public — no auth needed — so this works fine
```

**Download for public participants:**
The verification page `/verify/[certNumber]` shows the certificate and has a download button.
Since participants have no account, they access their certificate exclusively via the QR code.

### 8.3 — Updated Certificate Verify Page

No changes needed to the visual design — it already works for public access.
Just make sure the download link uses `getBaseUrl()`:

```tsx
// app/(public)/verify/[certNumber]/page.tsx
import { getBaseUrl } from '@/lib/utils/base-url';

// The download href:
<a href={`${getBaseUrl()}/api/certificates/${certDocId}/download`} download>
  ↓ Download Certificate PDF
</a>
```

---

## 9. Phase 4 — Recurring Events System [COMPLETED]

This is the most complex new feature. Recurring events (like monthly workshops) have multiple
sessions, each with their own attendance. Once all sessions are completed and attendance is
marked, certificates are **automatically issued** to everyone who attended.

### 9.1 — Creating a Recurring Event

Additional fields on the event creation form when "Recurring Event" is toggled on:

```tsx
// Event form — recurring section
isRecurring: boolean toggle
recurringMonth: "monthly" | "weekly"
recurringDay: number (1-31, day of month for monthly; 0-6 for day of week for weekly)
totalSessions: number (e.g. 6 for a 6-month workshop series)
// eventDate = first session date (auto-calculated or manually set)
```

**Creating sessions automatically when event is created:**
```typescript
// app/api/events/route.ts — after creating the event doc
if (body.isRecurring && body.totalSessions) {
  const batch = adminDb.batch();
  let sessionDate = new Date(body.eventDate); // first session date

  for (let i = 1; i <= body.totalSessions; i++) {
    const sessionRef = adminDb.collection('eventSessions').doc();
    batch.set(sessionRef, {
      eventId: eventRef.id,
      sessionNumber: i,
      sessionDate: Timestamp.fromDate(sessionDate),
      attendanceOpen: false,
      attendanceClosed: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Advance to next session date
    if (body.recurringMonth === 'monthly') {
      sessionDate = addMonths(sessionDate, 1); // date-fns addMonths
    } else if (body.recurringMonth === 'weekly') {
      sessionDate = addWeeks(sessionDate, 1);
    }
  }

  await batch.commit();
}
```

### 9.2 — Per-Session Attendance Marking

When admin or coordinator opens attendance for a session:

```typescript
// app/api/events/[id]/sessions/[sessionId]/attendance/route.ts

// GET: fetch all registrations for this event, show attendance status for this session
// PATCH body: { registrationId: string, status: "attended" | "absent" }

export async function PATCH(req: Request, { params }) {
  const { id: eventId, sessionId } = await params;
  // Verify admin or coordinator assigned to this event

  const { registrationId, status } = await req.json();
  const regRef = adminDb.doc(`participantRegistrations/${registrationId}`);

  // Update session attendance map
  await regRef.update({
    [`sessionAttendance.${sessionId}`]: status,
    sessionsAttended: status === 'attended'
      ? FieldValue.increment(1)
      : FieldValue.increment(0),
    attendanceMarkedAt: FieldValue.serverTimestamp(),
    attendanceMarkedBy: decoded.uid,
  });

  return Response.json({ status: 'ok' });
}
```

**Close session attendance:**
```typescript
// PATCH /api/events/[id]/sessions/[sessionId]/close
// Sets attendanceClosed: true on the session
// Then calls checkAndAutoIssueCertificates(eventId)
```

### 9.3 — Auto-Certificate on Completion (Key Feature)

When the **last session** of a recurring event has its attendance closed, the system
automatically checks each participant's attendance record and issues certificates to
everyone who attended all (or a configured minimum number of) sessions.

```typescript
// src/lib/certificates/auto-issue.ts

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { generateCertNumber } from '@/lib/utils/cert-number';
import { getBaseUrl } from '@/lib/utils/base-url';

export async function checkAndAutoIssueCertificates(eventId: string) {
  // 1. Get all sessions for this event
  const sessionsSnap = await adminDb.collection('eventSessions')
    .where('eventId', '==', eventId)
    .orderBy('sessionNumber')
    .get();

  const sessions = sessionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const totalSessions = sessions.length;

  // 2. Check if ALL sessions are closed
  const allClosed = sessions.every(s => s.attendanceClosed);
  if (!allClosed) return; // not done yet

  // 3. Get the event doc
  const eventSnap = await adminDb.doc(`events/${eventId}`).get();
  const event = eventSnap.data()!;

  // 4. Get all participant registrations for this event
  const regsSnap = await adminDb.collection('participantRegistrations')
    .where('eventId', '==', eventId)
    .where('status', '!=', 'cancelled')
    .get();

  // 5. Get count of already issued certs (for sequential numbering)
  const existingCertsSnap = await adminDb.collection('certificates')
    .where('eventId', '==', eventId)
    .count().get();
  let seq = existingCertsSnap.data().count;

  const batch = adminDb.batch();

  for (const regDoc of regsSnap.docs) {
    const reg = regDoc.data();

    // Skip if cert already auto-issued
    if (reg.certificateAutoIssued) continue;

    // Count attended sessions for this participant
    const attendedCount = Object.values(reg.sessionAttendance || {})
      .filter(v => v === 'attended').length;

    // Issue cert if attended at least half the sessions (configurable threshold)
    const MINIMUM_SESSIONS = Math.ceil(totalSessions / 2);
    if (attendedCount < MINIMUM_SESSIONS) continue;

    seq++;
    const certNumber = generateCertNumber(eventId, seq);
    const qrVerifyUrl = `${getBaseUrl()}/verify/${certNumber}`;

    const certRef = adminDb.collection('certificates').doc();
    batch.set(certRef, {
      certificateNumber: certNumber,
      eventId,
      eventTitle: event.title,
      eventDate: event.eventDate,
      recipientName: reg.participantName,
      recipientEmail: reg.participantEmail,
      recipientId: null,  // public participant, no account
      recipientRole: 'participant',
      issuedDate: Timestamp.now(),
      issuedBy: null,
      isAutoIssued: true,
      isVisible: true,
      qrVerifyUrl,
    });

    // Mark registration as cert issued
    batch.update(regDoc.ref, { certificateAutoIssued: true });
  }

  // Also issue for approved volunteers
  const volsSnap = await adminDb.collection('volunteerApplications')
    .where('eventId', '==', eventId)
    .where('status', '==', 'approved')
    .get();

  for (const volDoc of volsSnap.docs) {
    const vol = volDoc.data();

    const attendedCount = Object.values(vol.sessionAttendance || {})
      .filter(v => v === 'attended').length;

    const MINIMUM_SESSIONS = Math.ceil(totalSessions / 2);
    if (attendedCount < MINIMUM_SESSIONS) continue;

    seq++;
    const certNumber = generateCertNumber(eventId, seq);
    const qrVerifyUrl = `${getBaseUrl()}/verify/${certNumber}`;

    // Fetch volunteer name from users collection
    const userSnap = await adminDb.doc(`users/${vol.volunteerId}`).get();
    const user = userSnap.data()!;

    const certRef = adminDb.collection('certificates').doc();
    batch.set(certRef, {
      certificateNumber: certNumber,
      eventId,
      eventTitle: event.title,
      eventDate: event.eventDate,
      recipientName: user.fullName,
      recipientEmail: user.email,
      recipientId: vol.volunteerId,
      recipientRole: 'volunteer',
      issuedDate: Timestamp.now(),
      issuedBy: null,
      isAutoIssued: true,
      isVisible: true,
      qrVerifyUrl,
    });
  }

  await batch.commit();

  // Update event status to completed
  await adminDb.doc(`events/${eventId}`).update({
    status: 'completed',
    updatedAt: FieldValue.serverTimestamp(),
  });
}
```

**Call this function when closing a session:**
```typescript
// app/api/events/[id]/sessions/[sessionId]/close/route.ts
import { checkAndAutoIssueCertificates } from '@/lib/certificates/auto-issue';

export async function PATCH(req: Request, { params }) {
  const { id: eventId, sessionId } = await params;
  // Verify admin or coordinator

  await adminDb.doc(`eventSessions/${sessionId}`).update({
    attendanceClosed: true,
  });

  // Check if all sessions are now closed → auto-issue certs if so
  await checkAndAutoIssueCertificates(eventId);

  return Response.json({ status: 'ok' });
}
```

### 9.4 — Recurring Event UI

**Admin event detail page — sessions panel:**
```
Sessions for "Monthly Workshop Series"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session 1 — Jan 15, 2025   ✅ Closed   45/50 attended
Session 2 — Feb 15, 2025   ✅ Closed   42/50 attended
Session 3 — Mar 15, 2025   🟡 Open     [Mark Attendance] [Close Session]
Session 4 — Apr 15, 2025   ⏳ Upcoming
Session 5 — May 15, 2025   ⏳ Upcoming
Session 6 — Jun 15, 2025   ⏳ Upcoming

Progress: 3/6 sessions completed
Auto-certificate threshold: attended ≥ 3 sessions
```

**Admin attendance marking UI for a session:**
- Table: participant name, email, attendance toggle (Attended / Absent)
- Bulk actions: "Mark All Present", "Mark All Absent"
- Save button → updates all session attendance in one batch write
- Close Session button → locks attendance + triggers auto-cert check

---

## 10. Phase 5 — Donations Page [COMPLETED]

### 10.1 — Public Donations Page (`/donations`)

The donations page is purely informational + a form to record intent. Since this is an NGO
and actual payment processing (Razorpay etc.) requires business registration, the flow is:
1. Donor fills form with name, email, amount, message
2. Donor sees bank/UPI details to transfer manually
3. Donor submits transaction ID after transferring
4. Admin verifies and marks as confirmed

```tsx
// app/(public)/donations/page.tsx

export default function DonationsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Support Our Mission</h1>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Your donation helps HopeNGO run events, support communities, and create
          opportunities for volunteers and participants across India.
        </p>
      </div>

      {/* Impact stats */}
      <div className="grid grid-cols-3 gap-6 mb-12 text-center">
        <div className="bg-green-50 rounded-xl p-6">
          <p className="text-3xl font-bold text-green-700">500+</p>
          <p className="text-sm text-gray-500">Events Conducted</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6">
          <p className="text-3xl font-bold text-green-700">2000+</p>
          <p className="text-sm text-gray-500">Lives Impacted</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6">
          <p className="text-3xl font-bold text-green-700">300+</p>
          <p className="text-sm text-gray-500">Active Volunteers</p>
        </div>
      </div>

      {/* Payment details + form side by side */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Payment info */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">How to Donate</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">UPI ID</p>
              <p className="font-mono bg-gray-50 rounded px-3 py-2 mt-1">hopengo@upi</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Bank Transfer</p>
              <div className="bg-gray-50 rounded px-3 py-2 mt-1 space-y-1">
                <p>Account Name: HopeNGO Foundation</p>
                <p>Account No: XXXX XXXX XXXX</p>
                <p>IFSC: XXXXXXXXX</p>
                <p>Bank: State Bank of India</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            After transferring, fill the form and submit your transaction ID so we can
            acknowledge your donation.
          </p>
        </div>

        {/* Donation form */}
        <DonationForm />
      </div>
    </div>
  );
}
```

**Donation form component:**
```tsx
// src/components/donations/DonationForm.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  donorName:     z.string().min(2),
  donorEmail:    z.string().email(),
  amount:        z.number().min(1),
  paymentMethod: z.enum(['upi', 'bank_transfer', 'other']),
  transactionId: z.string().optional(),
  message:       z.string().max(300).optional(),
});

export function DonationForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    reset();
    // Show success toast
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Record Your Donation</h2>
      {/* Fields: name, email, amount, payment method, transaction ID, message */}
      {/* Submit button */}
    </form>
  );
}
```

**API route:**
```typescript
// app/api/donations/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  // Validate with Zod
  await adminDb.collection('donations').add({
    ...body,
    status: 'pending',
    verifiedBy: null,
    createdAt: FieldValue.serverTimestamp(),
  });
  return Response.json({ status: 'ok' });
}
```

### 10.2 — Admin Donations View

```tsx
// app/(admin)/admin/donations/page.tsx
// Table: donor name, email, amount, method, transaction ID, date, status
// Actions: Verify (set status: 'verified') | Reject (set status: 'rejected')
// Summary stat card on admin dashboard: Total verified donations (INR)
```

---

## 11. Phase 6 — Mobile App [COMPLETED]

Mobile app targets volunteers and event coordinators only (no participant accounts).
Participants access events via browser.

### 11.1 — Updated Expo Setup

```bash
npx create-expo-app hopengo-app -t expo-template-blank-typescript
cd hopengo-app
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npm install expo-router expo-print expo-sharing
npm install react-native-paper @expo/vector-icons
```

### 11.2 — Volunteer App Screens

```
app/
  (tabs)/
    index.tsx         → Dashboard: my applications + available events with inline Apply
    assignments.tsx   → Approved events + volunteering instructions
    history.tsx       → Past events
    profile.tsx       → Edit profile, logout
```

### 11.3 — Event Coordinator App Screens

```
app/
  (tabs)/
    index.tsx         → Assigned events with stats
    attendance/
      [sessionId].tsx → Mark attendance per session
    uploads.tsx       → Add URL uploads to event
    profile.tsx       → Edit profile, logout
```

### 11.4 — Session Attendance on Mobile

```typescript
// Mobile attendance marking with offline support
// Use Firestore's enablePersistence() so coordinators can mark attendance
// even with poor connectivity at event venues, and sync when back online

import firestore from '@react-native-firebase/firestore';

// Enable offline persistence
firestore().settings({ persistence: true });
```

---

## 12. Phase 7 — Polish & Launch

### 12.1 — Full Localhost Audit Checklist

Search your entire codebase for these patterns and replace all with `getBaseUrl()`:

```bash
# Run this in your project root to find all occurrences
grep -r "localhost:3000" src/ --include="*.ts" --include="*.tsx"
grep -r "localhost:3000" app/ --include="*.ts" --include="*.tsx"
grep -r "http://localhost" src/ --include="*.ts" --include="*.tsx"
grep -r "http://localhost" app/ --include="*.ts" --include="*.tsx"
```

Common places to check:
- `src/lib/firebase/admin.ts` — any URL used in cookie domain
- All certificate generation code (QR URL)
- `middleware.ts` — any internal fetch calls
- Any `fetch('/api/...')` that was accidentally made absolute

### 12.2 — `next.config.ts` Final

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow all external image URLs (for banner images)
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  // Ensure firebase-admin doesn't get bundled client-side
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
```

### 12.3 — Vercel `vercel.json`

```json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 30
    }
  }
}
```

The certificate PDF generation and report generation can take a few seconds —
the default 10s timeout on Vercel hobby plan may cut them off. Set `maxDuration: 30` on API routes.

---

## 13. API Route Reference

### Auth
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/auth/session` | Public | Exchange Firebase ID token for session cookie |
| DELETE | `/api/auth/session` | Auth | Logout |
| GET | `/api/auth/verify` | Auth | Verify session + return role |

### Events
| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List public events |
| POST | `/api/events` | Admin | Create event (regular or recurring) |
| GET | `/api/events/[id]` | Public | Event detail |
| PATCH | `/api/events/[id]` | Admin | Update event |
| PATCH | `/api/events/[id]/assign-coordinator` | Admin | Assign coordinator |
| PATCH | `/api/events/[id]/toggle-participant-reg` | Admin | Toggle participant reg |
| PATCH | `/api/events/[id]/toggle-volunteer-reg` | Admin | Toggle volunteer reg |
| POST | `/api/events/[id]/coordinator-upload` | Coordinator | Add URL upload |
| GET | `/api/events/[id]/report` | Admin / Coordinator | PDF report |
| GET | `/api/events/[id]/registrations` | Admin / Coordinator | Participant list |
| GET | `/api/events/[id]/volunteer-applications` | Admin / Coordinator | Volunteer list |

### Sessions (Recurring Events)
| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/events/[id]/sessions` | Admin / Coordinator | List sessions |
| PATCH | `/api/events/[id]/sessions/[sessionId]/open` | Admin / Coordinator | Open attendance |
| PATCH | `/api/events/[id]/sessions/[sessionId]/attendance` | Admin / Coordinator | Mark per-person |
| PATCH | `/api/events/[id]/sessions/[sessionId]/close` | Admin / Coordinator | Close + trigger auto-cert |

### Registrations (Public Participants)
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/registrations` | Public (no auth) | Register for event |
| DELETE | `/api/registrations/[id]` | Public (by email token) | Cancel registration |
| GET | `/api/events/[id]/registrations` | Admin / Coordinator | All registrations |
| PATCH | `/api/registrations/[id]/attendance` | Admin / Coordinator | Mark single-event attendance |

### Volunteer Applications
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/volunteer-applications` | Volunteer | Apply (from dashboard or event page) |
| DELETE | `/api/volunteer-applications/[id]` | Volunteer | Withdraw |
| GET | `/api/volunteer-applications/my` | Volunteer | My applications |
| PATCH | `/api/volunteer-applications/[id]` | Admin | Approve / reject |

### Certificates
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/certificates/issue` | Admin | Manual issue |
| GET | `/api/certificates/[id]/download` | Public (cert owner) / Admin | Stream PDF |
| GET | `/api/certificates/verify/[certNumber]` | Public | Verify (renders page) |

### Donations
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/api/donations` | Public | Submit donation record |
| GET | `/api/donations` | Admin | List all donations |
| PATCH | `/api/donations/[id]/verify` | Admin | Verify or reject |

### Admin
| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Admin | Aggregate stats |
| GET | `/api/admin/users` | Admin | List users (with role + search filters) |
| PATCH | `/api/admin/users/[uid]/approve` | Admin | Approve + set custom claim |
| PATCH | `/api/admin/users/[uid]/toggle-active` | Admin | Activate / deactivate |

---

## 14. Folder Structure

```
hopengo/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx          ← Volunteer or Event Coordinator only
│   │   │   └── pending-approval/page.tsx
│   │   ├── (public)/
│   │   │   ├── page.tsx                   ← Landing (with Donations CTA)
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [eventId]/page.tsx
│   │   │   ├── donations/page.tsx         ← NEW
│   │   │   └── verify/[certNumber]/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── dashboard/page.tsx     ← With full stats
│   │   │       ├── events/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── create/page.tsx    ← Supports recurring toggle
│   │   │       │   └── [id]/
│   │   │       │       ├── page.tsx       ← Assign coordinator section
│   │   │       │       ├── participants/page.tsx
│   │   │       │       └── sessions/page.tsx  ← NEW: recurring sessions
│   │   │       ├── volunteers/page.tsx
│   │   │       ├── coordinators/page.tsx  ← NEW
│   │   │       ├── announcements/page.tsx
│   │   │       ├── donations/page.tsx     ← NEW
│   │   │       └── reports/page.tsx
│   │   ├── (coordinator)/                 ← NEW (replaces participant)
│   │   │   ├── layout.tsx
│   │   │   └── coordinator/
│   │   │       ├── dashboard/page.tsx     ← Assigned events + stats
│   │   │       ├── events/[id]/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── attendance/page.tsx
│   │   │       │   └── sessions/[sessionId]/page.tsx
│   │   │       └── uploads/page.tsx
│   │   ├── (volunteer)/
│   │   │   ├── layout.tsx
│   │   │   └── volunteer/
│   │   │       ├── dashboard/page.tsx     ← Now includes inline apply
│   │   │       ├── applications/page.tsx
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
│   │       │       ├── volunteer-applications/route.ts
│   │       │       ├── assign-coordinator/route.ts     ← NEW
│   │       │       ├── coordinator-upload/route.ts     ← NEW
│   │       │       ├── toggle-participant-reg/route.ts
│   │       │       ├── toggle-volunteer-reg/route.ts
│   │       │       └── sessions/                       ← NEW
│   │       │           ├── route.ts
│   │       │           └── [sessionId]/
│   │       │               ├── attendance/route.ts
│   │       │               ├── open/route.ts
│   │       │               └── close/route.ts
│   │       ├── registrations/
│   │       │   ├── route.ts               ← Public, no auth
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       └── attendance/route.ts
│   │       ├── volunteer-applications/
│   │       │   ├── route.ts
│   │       │   ├── my/route.ts
│   │       │   └── [id]/route.ts
│   │       ├── certificates/
│   │       │   ├── issue/route.ts
│   │       │   ├── verify/[certNumber]/route.ts
│   │       │   └── [id]/download/route.ts
│   │       ├── donations/                  ← NEW
│   │       │   ├── route.ts
│   │       │   └── [id]/verify/route.ts
│   │       └── admin/
│   │           ├── dashboard/route.ts
│   │           └── users/[uid]/route.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventForm.tsx              ← Updated with recurring fields
│   │   │   ├── EventStatsCard.tsx         ← NEW: shared admin + coordinator
│   │   │   ├── SeatProgressBar.tsx
│   │   │   └── SessionsPanel.tsx          ← NEW: recurring session list
│   │   ├── certificates/
│   │   │   └── CertificateCard.tsx
│   │   ├── donations/
│   │   │   └── DonationForm.tsx           ← NEW
│   │   ├── volunteer/
│   │   │   └── InlineApplyButton.tsx      ← NEW
│   │   └── shared/
│   │       ├── PublicNav.tsx              ← Updated with Donations link
│   │       └── AnnouncementBanner.tsx
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── client.ts
│   │   │   └── admin.ts
│   │   ├── auth/
│   │   │   ├── login.ts
│   │   │   └── useAuthUser.ts
│   │   ├── certificates/
│   │   │   └── auto-issue.ts              ← NEW: recurring auto-cert logic
│   │   ├── email/
│   │   │   └── send.ts                    ← NEW: Resend wrapper
│   │   └── utils/
│   │       ├── base-url.ts                ← NEW: fixes localhost issue
│   │       ├── cert-number.ts
│   │       └── format-date.ts
│   ├── hooks/
│   │   └── useAuthUser.ts
│   ├── store/
│   │   └── authStore.ts
│   └── types/
│       ├── firestore.ts
│       └── index.ts
├── middleware.ts
├── next.config.ts
├── vercel.json                            ← NEW: increase API timeout
├── firestore.rules
└── .env.local
```

---

## 15. Environment Variables

```env
# .env.local

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDpjY7299qX-CnTRX7IYmKoGNgxcUAV5XI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hopengo-f2fda.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hopengo-f2fda
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=782743670757
NEXT_PUBLIC_FIREBASE_APP_ID=1:782743670757:web:95fbae038044c36b14e90c

# Firebase Admin
FIREBASE_PROJECT_ID=hopengo-f2fda
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@hopengo-f2fda.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# App URL — CRITICAL: must be set correctly on Vercel, never localhost in production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME=HopeNGO

# Email
RESEND_API_KEY=re_...

# Recurring event minimum attendance threshold (fraction, e.g. 0.5 = 50% of sessions)
NEXT_PUBLIC_MIN_ATTENDANCE_FRACTION=0.5
```

---

## 16. Deployment Checklist

### Immediate Fixes (Do First)
- [ ] Create `src/lib/utils/base-url.ts` with `getBaseUrl()` function
- [ ] Run `grep -r "localhost:3000"` and replace every occurrence with `getBaseUrl()`
- [ ] Set `NEXT_PUBLIC_APP_URL=https://your-actual-vercel-url.app` in Vercel env vars
- [ ] Add `vercel.json` with `maxDuration: 30` for API routes
- [ ] Add `serverExternalPackages: ['firebase-admin']` to `next.config.ts`
- [ ] Set Firebase custom claims on existing users via Admin SDK

### Firebase Console
- [ ] Update Firestore security rules (Section 4 — new rules for coordinator + public registration)
- [ ] Add new composite indexes:
  - `eventSessions`: `eventId ASC, sessionNumber ASC`
  - `participantRegistrations`: `eventId ASC, certificateAutoIssued ASC`
  - `donations`: `status ASC, createdAt DESC`
  - `users`: `role ASC, isApproved ASC`

### Vercel
- [ ] `NEXT_PUBLIC_APP_URL` set to actual production URL (not localhost)
- [ ] `RESEND_API_KEY` set
- [ ] Redeploy after adding `vercel.json`

### Data Migration (Existing Data)
- [ ] Update all existing `certificates` documents: change `certificateNumber` prefix from `ANTI-` to `HOPE-` if desired (or leave old ones as-is)
- [ ] Set `isRecurring: false` on all existing events (if field was not present before)
- [ ] Set `isAutoIssued: false` on all existing certificates
- [ ] For existing volunteers: ensure custom claim `{ role: 'volunteer' }` is set via Admin SDK

### Testing Before Launch
- [ ] Public registration flow (no account) → confirm, attend, receive cert email
- [ ] Recurring event: create 3-session event → mark attendance per session → close all → confirm auto-certs issued
- [ ] Coordinator: register → admin approves → assigned to event → can mark attendance → stats visible on dashboard
- [ ] Volunteer: register from dashboard inline button → apply → admin approves → see instructions
- [ ] Donations page: submit form → admin verifies → stat updates on dashboard
- [ ] QR code on certificate → opens verify page → shows full visual cert → download works
- [ ] All certificate download URLs use production domain (not localhost)

---

## Milestone Summary

| Phase | Key Deliverables |
|---|---|
| Immediate | Fix localhost hardcoding, add `base-url.ts`, set Vercel env, add `vercel.json` |
| Phase 1 | Remove participant auth, add coordinator role, update nav with Donations |
| Phase 2 | Public registration (no account), volunteer inline apply, coordinator dashboard with stats |
| Phase 3 | Certificate number format, public participant certs by email |
| Phase 4 | Recurring events system, per-session attendance, auto-certificate issuance |
| Phase 5 | Donations page + admin view |
| Phase 6 | Mobile app for volunteers + coordinators |
| Phase 7 | Email notifications via Resend, full localhost audit, Vercel deployment fixes |

---

*Project: HopeNGO — NGO Management Platform*
*Stack: Next.js 16.2 · firebase@12.11.0 · firebase-admin@13.7.0 · shadcn/ui CLI v4 · Expo SDK 52*
*Version: 3.0 — Major Update (Coordinator role, Recurring Events, Donations, Localhost Fix)*