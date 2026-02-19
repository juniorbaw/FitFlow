'use client'

import { useState } from "react";

const ORANGE = "#FF5C00";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div style={{
      minHeight: "100vh", background: "#050508", color: "#fafafa",
      fontFamily: "'Inter', -apple-system, sans-serif",
      display: "flex"
    }}>
      {/* LEFT - Form */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", padding: 40
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Logo */}
          <div style={{ marginBottom: 48 }}>
            <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>
              Fit<span style={{ color: ORANGE }}>Flow</span>
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>
            {isSignup ? "Créer un compte" : "Bon retour"} 👋
          </h1>
          <p style={{ fontSize: 15, color: "#888", marginBottom: 36 }}>
            {isSignup
              ? "Commencez à convertir vos commentaires en clients"
              : "Connectez-vous pour accéder à votre dashboard"
            }
          </p>

          {/* Facebook OAuth */}
          <button style={{
            width: "100%", padding: "14px", borderRadius: 12,
            background: "#1877F2", border: "none", color: "white",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            marginBottom: 24
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continuer avec Facebook
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>ou par email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {isSignup && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#888", display: "block", marginBottom: 8 }}>Nom complet</label>
                <input
                  type="text" value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  style={{
                    width: "100%", padding: "14px 18px", borderRadius: 12,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "white", fontSize: 14, outline: "none", fontFamily: "inherit",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => { e.target.style.borderColor = `${ORANGE}50`; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>
            )}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#888", display: "block", marginBottom: 8 }}>Email</label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                style={{
                  width: "100%", padding: "14px 18px", borderRadius: 12,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "white", fontSize: 14, outline: "none", fontFamily: "inherit",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => { e.target.style.borderColor = `${ORANGE}50`; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#888" }}>Mot de passe</label>
                {!isSignup && (
                  <a href="#" style={{ fontSize: 12, color: ORANGE, textDecoration: "none", fontWeight: 600 }}>
                    Mot de passe oublié ?
                  </a>
                )}
              </div>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "14px 18px", borderRadius: 12,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "white", fontSize: 14, outline: "none", fontFamily: "inherit",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => { e.target.style.borderColor = `${ORANGE}50`; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
              />
            </div>
          </div>

          {/* Submit */}
          <button style={{
            width: "100%", padding: "15px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
            color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
            marginTop: 24, boxShadow: `0 8px 32px ${ORANGE}30`
          }}>
            {isSignup ? "Créer mon compte" : "Se connecter"}
          </button>

          {/* Toggle signup/login */}
          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#666" }}>
            {isSignup ? "Déjà un compte ? " : "Pas encore de compte ? "}
            <span
              onClick={() => setIsSignup(!isSignup)}
              style={{ color: ORANGE, cursor: "pointer", fontWeight: 700 }}
            >
              {isSignup ? "Se connecter →" : "Créer un compte →"}
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT - Visual */}
      <div style={{
        flex: 1, background: "linear-gradient(135deg, rgba(255,92,0,0.04), rgba(255,92,0,0.01))",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: 60, position: "relative", overflow: "hidden",
        borderLeft: "1px solid rgba(255,255,255,0.04)"
      }}>
        <div style={{
          position: "absolute", top: "20%", right: "-10%",
          width: 500, height: 500,
          background: `radial-gradient(circle, ${ORANGE}08, transparent 70%)`,
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, lineHeight: 1.15, marginBottom: 16 }}>
            +3 à 5 clients<br />
            <span style={{ color: ORANGE }}>par semaine</span><br />
            en automatique
          </h2>
          <p style={{ fontSize: 15, color: "#666", marginBottom: 40 }}>
            Rejoignez les coachs qui ont déjà transformé<br />leur Instagram en machine à clients.
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 340, margin: "0 auto" }}>
            {[
              { val: "30s", label: "Temps de réponse" },
              { val: "85%", label: "Taux de réponse" },
              { val: "24/7", label: "Automatisation" },
              { val: "890%", label: "ROI moyen" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "18px 12px"
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: ORANGE, marginBottom: 2 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{
            marginTop: 40, background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: 24, textAlign: "left", maxWidth: 360, margin: "40px auto 0"
          }}>
            <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>
              &ldquo;FitFlow a changé ma façon de prospecter. Je signe 4-5 clients par semaine juste avec mes posts Instagram.&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: "rgba(255,92,0,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 14, color: ORANGE
              }}>M</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Marc D.</div>
                <div style={{ fontSize: 11, color: "#555" }}>Coach Fitness · 32K followers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
