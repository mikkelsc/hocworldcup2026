# ⚽ World Cup 2026 Tips — Setup Guide

This guide walks you through deploying your tipping site for free in about 15 minutes.
**No coding knowledge needed** — just follow the steps in order.

---

## What you'll set up

| Service | Purpose | Cost |
|---|---|---|
| **Firebase** | User accounts + storing tips/results | Free forever (Spark plan) |
| **Netlify** | Hosts the website with a shareable link | Free forever |

---

## STEP 1 — Set up Firebase (5 min)

Firebase stores user logins and all tips/results.

1. Go to **https://console.firebase.google.com**
2. Sign in with a Google account
3. Click **"Add project"** → name it `worldcup2026-tips` → Continue → Create project
4. Once created, click the **`</>`** (Web) icon to add a web app
5. Name the app `worldcup2026` → **don't** tick Firebase Hosting → Register app
6. You'll see a `firebaseConfig` object like this:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "worldcup2026-tips.firebaseapp.com",
     projectId: "worldcup2026-tips",
     ...
   };
   ```
7. **Copy these values** — you'll need them in Step 3

### Enable Authentication
1. In the left sidebar → **Authentication** → Get started
2. Click **Email/Password** → Enable the first toggle → Save

### Enable Firestore Database
1. In the left sidebar → **Firestore Database** → Create database
2. Select **"Start in test mode"** → Next → Choose any region near you → Done

### Set Firestore security rules (important!)
1. In Firestore → **Rules** tab
2. Replace the content with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /tips/{tipId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    match /results/{matchId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Admin only — see note below
    }
    match /knockoutMatches/{matchId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```
3. Click **Publish**

> ⚠️ **Note on admin access:** By default any logged-in user can enter results. To restrict result entry to just you, add your email to the `ADMIN_EMAILS` array in `src/components/MatchesView.jsx` and `src/components/KnockoutView.jsx`. Then tighten the Firestore rules above by replacing `allow write: if request.auth != null;` with stricter admin UID checks.

---

## STEP 2 — Edit the code (2 min)

You need to paste your Firebase config into the project.

1. Open the file **`src/firebase.js`** in a text editor
2. Replace the placeholder values with your actual Firebase config:

```js
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",           // ← paste yours here
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID",
};
```

3. Open **`src/components/MatchesView.jsx`** — find this line near the top:
```js
const ADMIN_EMAILS = ["REPLACE_WITH_YOUR_EMAIL@example.com"];
```
Replace with your actual email address (you'll be the admin who enters results).

4. Do the same in **`src/components/KnockoutView.jsx`**

---

## STEP 3 — Deploy to Netlify (5 min)

### Option A — Drag & Drop (easiest, no account needed initially)

1. Install dependencies and build the app:
   - Install **Node.js** from https://nodejs.org (LTS version)
   - Open a terminal in the project folder
   - Run: `npm install`
   - Run: `npm run build`
   - This creates a `dist/` folder
2. Go to **https://app.netlify.com** → Sign up (free) with GitHub or email
3. On the dashboard, drag and drop the **`dist/`** folder onto the page
4. Netlify gives you a URL like `https://random-name-123456.netlify.app` — share this!

### Option B — GitHub + Auto-deploy (recommended for future updates)

1. Push this project to a GitHub repo
2. On Netlify → **"Import from Git"** → Connect GitHub → Select your repo
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy** — every future push auto-deploys

---

## STEP 4 — First use

1. Visit your Netlify URL
2. Click **Register** and create your admin account using the email you set in `ADMIN_EMAILS`
3. Share the URL with your friends — they register their own accounts
4. **Tipping:** Users submit score predictions before each match kicks off
5. **Entering results:** Only you (admin) will see the result entry fields. Enter the final score after each match.

---

## Scoring Rules

| Prediction | Points |
|---|---|
| Exact score (e.g. 2-1 when result is 2-1) | **3 points** |
| Correct winner or draw (but wrong score) | **1 point** |
| Wrong outcome | **0 points** |

---

## Knockout Stage

After the group stage, you can manually add knockout matches in Firestore:
1. Go to Firebase Console → Firestore → Add collection `knockoutMatches`
2. Add a document for each knockout match with fields:
   - `stage`: "Round of 32" / "Round of 16" / "Quarter-Finals" / "Semi-Finals" / "Third Place" / "Final"
   - `home`: team name (e.g. "France")
   - `away`: team name (e.g. "Brazil")
   - `date`: date string (e.g. "2026-07-04")
   - `venue`: venue name
   - `group`: leave empty or set to "KO"
   - `sortOrder`: number for ordering (1, 2, 3...)

---

## Troubleshooting

| Problem | Fix |
|---|---|
| White screen after deploy | Check browser console for errors. Usually a wrong Firebase config value. |
| "Permission denied" in Firebase | Check your Firestore Rules are published correctly |
| Can't log in | Make sure Email/Password auth is enabled in Firebase Console |
| Tips not saving | Make sure you're logged in and the Firestore rules allow writes |

---

Good luck and enjoy the World Cup! 🏆🇺🇸🇨🇦🇲🇽
