import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDXo0zaY2prlHlFRPYRVnXfNMkeIkc11UU",
  authDomain: "retailconnect-b26fd.firebaseapp.com",
  projectId: "retailconnect-b26fd",
  storageBucket: "retailconnect-b26fd.firebasestorage.app",
  messagingSenderId: "535318561217",
  appId: "1:535318561217:web:b5342b8e1c84a5efe76f40",
  measurementId: "G-8QZF1VBNDH"
};

export const getFirebaseApp = () => {
  return !getApps().length ? initializeApp(firebaseConfig) : getApp();
};

export const getFirebaseAuth = async () => {
  const { getAuth } = await import("firebase/auth");
  return getAuth(getFirebaseApp());
};

export const getFirebaseDb = async () => {
  const { initializeFirestore } = await import("firebase/firestore");
  return initializeFirestore(getFirebaseApp(), {
    experimentalForceLongPolling: true
  });
};

