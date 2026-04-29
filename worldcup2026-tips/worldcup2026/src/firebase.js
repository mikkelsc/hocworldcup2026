// ============================================================
// FIREBASE SETUP — Replace these values with your own!
// ============================================================
// 1. Go to https://console.firebase.google.com
// 2. Click "Add project" → name it "worldcup2026-tips" → Create
// 3. Go to Project Settings (gear icon) → "Your apps" → </> (Web)
// 4. Register app, copy the firebaseConfig object below
// 5. In Firebase Console: go to Authentication → Sign-in method → Enable "Email/Password"
// 6. Go to Firestore Database → Create database → Start in test mode → Choose a region
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
