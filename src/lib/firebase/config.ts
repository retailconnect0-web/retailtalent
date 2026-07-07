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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: any = {};
let db: any = {};
const analytics = null;

if (typeof window !== "undefined") {
  try {
    auth = getAuth(app);
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true
    });
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { app, auth, db, analytics };
