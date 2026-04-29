import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function Leaderboard() {
  const { currentUser } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [usersSnap, tipsSnap, resultsSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "tips")),
        getDocs(collection(db, "results")),
      ]);

      const results = {};
      resultsSnap.forEach((d) => { results[d.id] = d.data(); });

      const tipsByUser = {};
      tipsSnap.forEach((d) => {
        const { userId, matchId, homeScore, awayScore } = d.data();
        if (!tipsByUser[userId]) tipsByUser[userId] = {};
        tipsByUser[userId][matchId] = { homeScore, awayScore };
      });

      const users = [];
      usersSnap.forEach((d) => {
        const uid = d.id;
        const user = d.data();
        let points = 0;
        let exact = 0;
        let winner = 0;

        const userTips = tipsByUser[uid] || {};
        Object.entries(userTips).forEach(([matchId, tip]) => {
          const result = results[matchId];
          if (!result || result.homeScore === undefined) return;
          const th = Number(tip.homeScore);
          const ta = Number(tip.awayScore);
          const rh = Number(result.homeScore);
          const ra = Number(result.awayScore);
          if (th === rh && ta === ra) {
            points += 3; exact++;
          } else if (Math.sign(th - ta) === Math.sign(rh - ra)) {
            points += 1; winner++;
          }
        });

        users.push({ uid, name: user.displayName || user.email, points, exact, winner, totalTips: Object.keys(userTips).length });
      });

      users.sort((a, b) => b.points - a.points || b.exact - a.exact);
      setPlayers(users);
      setLoading(false);
    }
    load();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="leaderboard">
      <h2 className="section-title">⚽ Leaderboard</h2>
      {loading ? (
        <div className="loading-spinner">Loading standings…</div>
      ) : players.length === 0 ? (
        <div className="empty-state">No tips recorded yet. Be the first to tip!</div>
      ) : (
        <div className="lb-table">
          <div className="lb-header">
            <span>#</span>
            <span>Player</span>
            <span>Tips</span>
            <span>🎯 Exact</span>
            <span>✓ Winner</span>
            <span>Points</span>
          </div>
          {players.map((p, i) => (
            <div key={p.uid} className={`lb-row ${p.uid === currentUser?.uid ? "lb-me" : ""} ${i < 3 ? "lb-podium" : ""}`}>
              <span className="lb-rank">
                {i < 3 ? medals[i] : `${i + 1}`}
              </span>
              <span className="lb-name">
                {p.name}
                {p.uid === currentUser?.uid && <span className="you-badge">You</span>}
              </span>
              <span className="lb-stat">{p.totalTips}</span>
              <span className="lb-stat gold">{p.exact}</span>
              <span className="lb-stat">{p.winner}</span>
              <span className="lb-points">{p.points} <span className="pts-label">pts</span></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
