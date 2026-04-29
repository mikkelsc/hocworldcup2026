import React, { useState } from "react";
import { GROUP_STAGE_MATCHES, GROUPS } from "../data/matches";
import MatchCard from "./MatchCard";
import { useAuth } from "../contexts/AuthContext";

const ADMIN_EMAILS = ["REPLACE_WITH_YOUR_EMAIL@example.com"]; // Add admin emails here

export default function MatchesView() {
  const { currentUser } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState("ALL");
  const isAdmin = ADMIN_EMAILS.includes(currentUser?.email);

  const groups = ["ALL", ...Object.keys(GROUPS)];
  const filtered = selectedGroup === "ALL"
    ? GROUP_STAGE_MATCHES
    : GROUP_STAGE_MATCHES.filter((m) => m.group === selectedGroup);

  return (
    <div className="matches-view">
      <h2 className="section-title">⚽ Group Stage Matches</h2>

      <div className="group-tabs">
        {groups.map((g) => (
          <button
            key={g}
            className={`group-tab ${selectedGroup === g ? "active" : ""}`}
            onClick={() => setSelectedGroup(g)}
          >
            {g === "ALL" ? "All Groups" : `Group ${g}`}
          </button>
        ))}
      </div>

      {isAdmin && (
        <div className="admin-notice">
          🔑 Admin mode — you can enter match results below
        </div>
      )}

      <div className="matches-grid">
        {filtered.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
}
