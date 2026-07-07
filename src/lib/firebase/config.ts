import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDXo0zaY2prlHlFRPYRVnXfNMkeIkc11UU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "retailconnect-b26fd.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "retailconnect-b26fd",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "retailconnect-b26fd.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "535318561217",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:535318561217:web:b5342b8e1c84a5efe76f40",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-8QZF1VBNDH"
};

// Initialize Firebase securely to prevent multiple instances
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Force Long Polling to bypass Turbopack WebSocket bug causing "client is offline"
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

// Analytics removed to prevent 403 Installations API errors if API Key is restricted
const analytics = null;

export { app, auth, db, analytics };
