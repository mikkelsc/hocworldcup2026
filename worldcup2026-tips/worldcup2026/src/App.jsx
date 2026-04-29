import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthPage from "./components/AuthPage";
import MatchesView from "./components/MatchesView";
import KnockoutView from "./components/KnockoutView";
import Leaderboard from "./components/Leaderboard";

function AppContent() {
  const { currentUser, userProfile, logout } = useAuth();
  const [tab, setTab] = useState("groups");

  if (!currentUser) return <AuthPage />;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="header-trophy">🏆</span>
          <div>
            <h1 className="header-title">A Home of Carlsberg World Cup 2026 Predictions Game</h1>
            <p className="header-sub">Tips & Predictions</p>
          </div>
        </div>
        <div className="header-right">
          <span className="header-user">
            👤 {userProfile?.displayName || currentUser.email}
          </span>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      </header>

      <nav className="main-nav">
        <button className={`nav-tab ${tab === "groups" ? "active" : ""}`} onClick={() => setTab("groups")}>
          ⚽ Group Stage
        </button>
        <button className={`nav-tab ${tab === "knockout" ? "active" : ""}`} onClick={() => setTab("knockout")}>
          🏆 Knockout
        </button>
        <button className={`nav-tab ${tab === "leaderboard" ? "active" : ""}`} onClick={() => setTab("leaderboard")}>
          🥇 Leaderboard
        </button>
      </nav>

      <main className="app-main">
        {tab === "groups" && <MatchesView />}
        {tab === "knockout" && <KnockoutView />}
        {tab === "leaderboard" && <Leaderboard />}
      </main>

      <footer className="app-footer">
        <p>⚽ FIFA World Cup 2026 · USA, Canada & Mexico · June–July 2026</p>
        <p className="footer-scoring">Scoring: Exact score = 3pts · Correct winner/draw = 1pt</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
