import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import MatchCard from "./MatchCard";
import { useAuth } from "../contexts/AuthContext";

const ADMIN_EMAILS = ["mikkel.schou@carlsberg.com"];

export default function KnockoutView() {
  const { currentUser } = useAuth();
  const [knockoutMatches, setKnockoutMatches] = useState([]);
  const isAdmin = ADMIN_EMAILS.includes(currentUser?.email);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "knockoutMatches"));
      const matches = [];
      snap.forEach((d) => matches.push({ id: d.id, ...d.data() }));
      matches.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setKnockoutMatches(matches);
    }
    load();
  }, []);

  const stages = ["Round of 32", "Round of 16", "Quarter-Finals", "Semi-Finals", "Third Place", "Final"];
  const byStage = stages.reduce((acc, s) => {
    acc[s] = knockoutMatches.filter((m) => m.stage === s);
    return acc;
  }, {});

  const hasAny = knockoutMatches.length > 0;

  return (
    <div className="knockout-view">
      <h2 className="section-title">🏆 Knockout Stage</h2>

      {!hasAny ? (
        <div className="knockout-placeholder">
          <div className="ko-icon">⏳</div>
          <h3>Knockout matches will appear here</h3>
          <p>Once the group stage is complete, the knockout bracket will be automatically populated based on final standings.</p>
          <div className="ko-bracket-preview">
            {stages.map((s) => (
              <div key={s} className="ko-stage-preview">
                <span className="ko-stage-name">{s}</span>
                <span className="ko-stage-matches">
                  {s === "Round of 32" ? "32 matches" :
                   s === "Round of 16" ? "16 matches" :
                   s === "Quarter-Finals" ? "8 matches" :
                   s === "Semi-Finals" ? "4 matches" :
                   s === "Third Place" ? "1 match" : "1 match"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        stages.map((stage) =>
          byStage[stage]?.length > 0 && (
            <div key={stage} className="ko-stage-section">
              <h3 className="ko-stage-title">{stage}</h3>
              <div className="matches-grid">
                {byStage[stage].map((match) => (
                  <MatchCard key={match.id} match={match} isAdmin={isAdmin} />
                ))}
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}
