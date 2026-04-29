import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError("Display name is required"); setLoading(false); return; }
        await signup(form.email, form.password, form.name.trim());
      }
    } catch (err) {
      const msgs = {
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/email-already-in-use": "Email already registered.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/invalid-email": "Invalid email address.",
      };
      setError(msgs[err.code] || "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-trophy">🏆</div>
        <h1 className="auth-title">World Cup<br /><span>2026 Tips</span></h1>
        <p className="auth-subtitle">Predict. Compete. Glory.</p>

        <div className="auth-tabs">
          <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setError(""); }}>
            Sign In
          </button>
          <button className={`tab ${mode === "signup" ? "active" : ""}`} onClick={() => { setMode("signup"); setError(""); }}>
            Register
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === "signup" && (
            <div className="input-group">
              <label>Display Name</label>
              <input name="name" type="text" placeholder="Your name on the leaderboard" value={form.name} onChange={handle} required />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handle} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required />
          </div>
          {error && <div className="auth-error">⚠️ {error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Loading…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-scoring">
          <div className="scoring-rule"><span className="pts gold">3 pts</span> Exact score correct</div>
          <div className="scoring-rule"><span className="pts">1 pt</span> Correct winner / draw</div>
        </div>
      </div>
    </div>
  );
}
