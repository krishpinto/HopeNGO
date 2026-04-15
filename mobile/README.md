# Deferred: Mobile Application (Expo)

This folder is intended to hold the Expo-based React Native mobile application for HopeNGO.

**Why Deferred:**
This presentation MVP focuses on a high-fidelity web experience to validate the workflows, aesthetic direction, and user roles (Admin, Volunteer, Coordinator) with stakeholders. The mobile application and native push notifications have been intentionally postponed to a future phase.

**Future Implementation Scope:**
- Setup `expo-router` for file-based navigation.
- Configure `@react-native-firebase/app`, `auth`, and `firestore`.
- Build Volunteer/Participant QR scanning for coordinators to assist with attendance logic (though v4 has moved to image-based records, QR functionality could still serve as digital verification).
- On-device PDF generation using `expo-print` for Certificates.
