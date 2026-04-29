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
  apiKey: "AIzaSyBhpx8jJr2NmBhdFkgJPHxvHuxfIqdJ3yo",
  authDomain: "worldcup2026-tips.firebaseapp.com",
  projectId: "worldcup2026-tips",
  storageBucket: "worldcup2026-tips.firebasestorage.app",
  messagingSenderId: "561408695284",
  appId: "1:561408695284:web:51eb05a0b3a7d91b96b7a1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
