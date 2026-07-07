import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXo0zaY2prlHlFRPYRVnXfNMkeIkc11UU",
  authDomain: "retailconnect-b26fd.firebaseapp.com",
  projectId: "retailconnect-b26fd",
  storageBucket: "retailconnect-b26fd.firebasestorage.app",
  messagingSenderId: "535318561217",
  appId: "1:535318561217:web:b5342b8e1c84a5efe76f40",
  measurementId: "G-8QZF1VBNDH"
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
