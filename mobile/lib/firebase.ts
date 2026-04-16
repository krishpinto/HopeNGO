import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpjY7299qX-CnTRX7IYmKoGNgxcUAV5XI",
  authDomain: "hopengo-f2fda.firebaseapp.com",
  projectId: "hopengo-f2fda",
  storageBucket: "hopengo-f2fda.firebasestorage.app",
  messagingSenderId: "782743670757",
  appId: "1:782743670757:web:95fbae038044c36b14e90c",
  measurementId: "G-XJHNJZQEML"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Use explicit init for auth to avoid Metro warnings
let auth: Auth;
try {
   auth = initializeAuth(app);
} catch(e) {
   auth = (getApp() as any).auth ? (getApp() as any).auth() : (null as any);
}

export { app, db, auth };
