# Deferred: Backend & Security Infrastructure

This folder is intended to hold the robust Firebase Cloud Functions and hard-wired security rules for HopeNGO.

**Why Deferred:**
This presentation MVP utilizes local mock data services to allow for a rapid, believable, and visually polished demonstration of the interface and workflows. Fully wiring Firestore triggers, security rules, and production deployment integrations are intentionally deferred.

**Future Implementation Scope:**
- Write and deploy `firestore.rules`.
- Implement `firebase-admin` cloud functions for automated PDF certificate generation upon attendance marking.
- Setup transactional emails using `Firebase Extensions` or SendGrid for donation receipts.
- Implement strictly checked role logic inside Edge middleware with live Firebase user claims.
