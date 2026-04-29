import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { FLAG_EMOJI } from "../data/matches";

export default function MatchCard({ match, isAdmin, onResultSaved }) {
  const { currentUser } = useAuth();
  const [tip, setTip] = useState({ homeScore: "", awayScore: "" });
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [adminResult, setAdminResult] = useState({ homeScore: "", awayScore: "" });
  const [loading, setLoading] = useState(true);

  const matchPassed = new Date(match.date) < new Date();

  useEffect(() => {
    async function load() {
      const [tipSnap, resultSnap] = await Promise.all([
        getDoc(doc(db, "tips", `${currentUser.uid}_${match.id}`)),
        getDoc(doc(db, "results", match.id)),
      ]);
      if (tipSnap.exists()) {
        const d = tipSnap.data();
        setTip({ homeScore: String(d.homeScore), awayScore: String(d.awayScore) });
        setSaved(true);
      }
      if (resultSnap.exists()) {
        const r = resultSnap.data();
        setResult(r);
        setAdminResult({ homeScore: String(r.homeScore), awayScore: String(r.awayScore) });
      }
      setLoading(false);
    }
    load();
  }, [match.id, currentUser.uid]);

  async function saveTip() {
    if (tip.homeScore === "" || tip.awayScore === "") return;
    const h = parseInt(tip.homeScore);
    const a = parseInt(tip.awayScore);
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return;
    await setDoc(doc(db, "tips", `${currentUser.uid}_${match.id}`), {
      userId: currentUser.uid,
      matchId: match.id,
      homeScore: h,
      awayScore: a,
      savedAt: new Date().toISOString(),
    });
    setSaved(true);
  }

  async function saveResult() {
    const h = parseInt(adminResult.homeScore);
    const a = parseInt(adminResult.awayScore);
    if (isNaN(h) || isNaN(a)) return;
    await setDoc(doc(db, "results", match.id), {
      matchId: match.id,
      homeScore: h,
      awayScore: a,
      recordedAt: new Date().toISOString(),
    });
    setResult({ homeScore: h, awayScore: a });
    if (onResultSaved) onResultSaved();
  }

  async function clearResult() {
    await deleteDoc(doc(db, "results", match.id));
    setResult(null);
    setAdminResult({ homeScore: "", awayScore: "" });
  }

  function getPoints() {
    if (!result || tip.homeScore === "") return null;
    const th = parseInt(tip.homeScore), ta = parseInt(tip.awayScore);
    const rh = result.homeScore, ra = result.awayScore;
    if (th === rh && ta === ra) return 3;
    if (Math.sign(th - ta) === Math.sign(rh - ra)) return 1;
    return 0;
  }

  const pts = getPoints();
  const homeFlag = FLAG_EMOJI[match.home] || "🏳️";
  const awayFlag = FLAG_EMOJI[match.away] || "🏳️";

  const dateStr = new Date(match.date).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });

  return (
    <div className={`match-card ${result ? "has-result" : ""} ${pts === 3 ? "pts-exact" : pts === 1 ? "pts-winner" : pts === 0 ? "pts-miss" : ""}`}>
      <div className="match-meta">
        <span className="match-group">Group {match.group}</span>
        <span className="match-date">{dateStr}</span>
      </div>

      <div className="match-teams">
        <div className="team home">
          <span className="flag">{homeFlag}</span>
          <span className="team-name">{match.home}</span>
        </div>

        {result ? (
          <div className="score-display">
            <span className="result-score">{result.homeScore} – {result.awayScore}</span>
            {pts !== null && (
              <span className={`pts-badge pts-${pts}`}>
                {pts === 3 ? "🎯 +3" : pts === 1 ? "✓ +1" : "✗ 0"}
              </span>
            )}
          </div>
        ) : (
          <div className="vs-badge">VS</div>
        )}

        <div className="team away">
          <span className="team-name">{match.away}</span>
          <span className="flag">{awayFlag}</span>
        </div>
      </div>

      {/* Tip input */}
      {!matchPassed && !result && (
        <div className="tip-row">
          <span className="tip-label">Your tip:</span>
          <input
            className="score-input"
            type="number" min="0" max="20"
            value={tip.homeScore}
            onChange={(e) => { setTip({ ...tip, homeScore: e.target.value }); setSaved(false); }}
            placeholder="0"
          />
          <span className="score-sep">–</span>
          <input
            className="score-input"
            type="number" min="0" max="20"
            value={tip.awayScore}
            onChange={(e) => { setTip({ ...tip, awayScore: e.target.value }); setSaved(false); }}
            placeholder="0"
          />
          <button
            className={`btn-save ${saved ? "saved" : ""}`}
            onClick={saveTip}
            disabled={saved || tip.homeScore === "" || tip.awayScore === ""}
          >
            {saved ? "✓ Saved" : "Save"}
          </button>
        </div>
      )}

      {matchPassed && !result && tip.homeScore !== "" && (
        <div className="tip-locked">
          🔒 Your tip: <strong>{tip.homeScore} – {tip.awayScore}</strong> <span className="awaiting">Awaiting result…</span>
        </div>
      )}

      {matchPassed && !result && tip.homeScore === "" && (
        <div className="tip-locked missed">No tip submitted</div>
      )}

      {result && tip.homeScore !== "" && (
        <div className="tip-locked">
          Your tip: <strong>{tip.homeScore} – {tip.awayScore}</strong>
        </div>
      )}

      {/* Admin result entry */}
      {isAdmin && (
        <div className="admin-row">
          <span className="admin-label">Admin result:</span>
          <input
            className="score-input"
            type="number" min="0" max="20"
            value={adminResult.homeScore}
            onChange={(e) => setAdminResult({ ...adminResult, homeScore: e.target.value })}
            placeholder="0"
          />
          <span className="score-sep">–</span>
          <input
            className="score-input"
            type="number" min="0" max="20"
            value={adminResult.awayScore}
            onChange={(e) => setAdminResult({ ...adminResult, awayScore: e.target.value })}
            placeholder="0"
          />
          <button className="btn-admin" onClick={saveResult}>Set</button>
          {result && <button className="btn-clear" onClick={clearResult}>Clear</button>}
        </div>
      )}

      <div className="match-venue">📍 {match.venue}</div>
    </div>
  );
}
