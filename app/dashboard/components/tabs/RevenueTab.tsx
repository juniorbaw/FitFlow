'use client'

import { useState } from "react";

const ORANGE = "#FF5C00";
const GREEN = "#00D26A";
const BLUE = "#3B82F6";

export default function RevenueTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [period, setPeriod] = useState("month");

  const stats = [
    { label: "Revenue Total", value: "4 740€", change: "+34%", icon: "💰", color: ORANGE },
    { label: "Revenue / Client", value: "245€", change: "+12%", icon: "📈", color: BLUE },
    { label: "Clients Totaux", value: "19", change: "+6", icon: "👥", color: GREEN },
    { label: "ROI", value: "890%", change: "+120%", icon: "🎯", color: ORANGE },
  ];

  const weeklyData = [
    { label: "Sem 1", auto: 580, manual: 297 },
    { label: "Sem 2", auto: 720, manual: 497 },
    { label: "Sem 3", auto: 940, manual: 297 },
    { label: "Sem 4", auto: 1100, manual: 497 },
  ];

  const maxRevenue = Math.max(...weeklyData.map(w => w.auto + w.manual));

  const recentConversions = [
    { user: "@fitgirl_23", amount: 297, program: "Programme 12 semaines", date: "19 fév", source: "auto" },
    { user: "@muscle_tom", amount: 497, program: "Coaching Premium 3 mois", date: "18 fév", source: "auto" },
    { user: "@yoga_sarah", amount: 197, program: "Plan Nutrition 8 sem", date: "17 fév", source: "auto" },
    { user: "@diet_marie", amount: 297, program: "Programme 12 semaines", date: "16 fév", source: "manual" },
    { user: "@run_alex", amount: 497, program: "Coaching Premium 3 mois", date: "15 fév", source: "auto" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Revenue</h1>
          <p style={{ fontSize: 14, color: "#666" }}>Suivez vos revenus générés via FitFlow</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3 }}>
            {[
              { id: "week", label: "Semaine" },
              { id: "month", label: "Mois" },
              { id: "year", label: "Année" },
            ].map(p => (
              <button key={p.id}
                onClick={() => setPeriod(p.id)}
                style={{
                  padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  border: "none", cursor: "pointer",
                  background: period === p.id ? "rgba(255,92,0,0.12)" : "transparent",
                  color: period === p.id ? ORANGE : "#666"
                }}
              >{p.label}</button>
            ))}
          </div>
          <button
            onClick={() => setShowAddModal(!showAddModal)}
            style={{
              background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
              border: "none", borderRadius: 10, color: "white",
              padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              boxShadow: `0 4px 16px ${ORANGE}25`
            }}
          >+ Ajouter un revenu</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "22px 20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</span>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: GREEN, display: "flex", alignItems: "center", gap: 4 }}>
              ↑ {s.change}
              <span style={{ color: "#555", fontWeight: 500 }}>vs mois dernier</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>

        {/* Revenue Chart */}
        <div style={{
          background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, padding: 28
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Revenus par semaine</span>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888" }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: ORANGE, display: "inline-block" }} />
                Via Auto-DM
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888" }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: BLUE, display: "inline-block" }} />
                Ajouté manuellement
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", height: 200, gap: 20, padding: "0 8px" }}>
            {weeklyData.map((w, i) => {
              const totalH = ((w.auto + w.manual) / maxRevenue) * 180;
              const autoH = (w.auto / (w.auto + w.manual)) * totalH;
              const manualH = (w.manual / (w.auto + w.manual)) * totalH;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa" }}>
                    {(w.auto + w.manual).toLocaleString()}€
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
                    <div style={{
                      height: manualH, width: "100%",
                      background: BLUE, borderRadius: "6px 6px 0 0"
                    }} />
                    <div style={{
                      height: autoH, width: "100%",
                      background: `linear-gradient(180deg, ${ORANGE}, ${ORANGE}50)`,
                      borderRadius: "0 0 6px 6px"
                    }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#555" }}>{w.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Split */}
        <div style={{
          background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, padding: 28
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, display: "block", marginBottom: 24 }}>Répartition</span>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="55" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="16" />
              <circle cx="70" cy="70" r="55" fill="none" stroke={ORANGE} strokeWidth="16"
                strokeDasharray="230 115" strokeDashoffset="0" transform="rotate(-90 70 70)" />
              <circle cx="70" cy="70" r="55" fill="none" stroke={BLUE} strokeWidth="16"
                strokeDasharray="115 230" strokeDashoffset="-230" transform="rotate(-90 70 70)" />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              background: "rgba(255,92,0,0.06)", borderRadius: 12, padding: "14px 16px",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: ORANGE, display: "inline-block" }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Auto-DM</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: ORANGE }}>3 340€</div>
                <div style={{ fontSize: 11, color: "#666" }}>70%</div>
              </div>
            </div>
            <div style={{
              background: "rgba(59,130,246,0.06)", borderRadius: 12, padding: "14px 16px",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: BLUE, display: "inline-block" }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Manuel</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: BLUE }}>1 400€</div>
                <div style={{ fontSize: 11, color: "#666" }}>30%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Conversions */}
      <div style={{
        background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: 28
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Dernières conversions</span>
          <button style={{
            background: "none", border: "1px solid rgba(255,255,255,0.08)",
            color: ORANGE, padding: "6px 14px", borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: "pointer"
          }}>Voir tout →</button>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "150px 1fr 100px 100px 80px",
          padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#444",
          textTransform: "uppercase", letterSpacing: 1, marginBottom: 4
        }}>
          <span>Client</span>
          <span>Programme</span>
          <span>Montant</span>
          <span>Source</span>
          <span style={{ textAlign: "right" }}>Date</span>
        </div>

        {recentConversions.map((c, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "150px 1fr 100px 100px 80px",
            padding: "14px 16px", alignItems: "center",
            borderRadius: 10,
            background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent"
          }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{c.user}</span>
            <span style={{ fontSize: 13, color: "#888" }}>{c.program}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: GREEN }}>+{c.amount}€</span>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: c.source === "auto" ? ORANGE : BLUE,
              background: c.source === "auto" ? "rgba(255,92,0,0.1)" : "rgba(59,130,246,0.1)",
              padding: "4px 10px", borderRadius: 6, display: "inline-block"
            }}>
              {c.source === "auto" ? "Auto-DM" : "Manuel"}
            </span>
            <span style={{ fontSize: 12, color: "#555", textAlign: "right" }}>{c.date}</span>
          </div>
        ))}
      </div>

      {/* Add Revenue Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            background: "#111", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: 32, width: 440
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>💰 Ajouter un revenu</h3>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Montant (€)</label>
              <input type="number" placeholder="297" style={{
                width: "100%", padding: "12px 16px", borderRadius: 10,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "white", fontSize: 15, outline: "none", fontFamily: "inherit"
              }} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Client (optionnel)</label>
              <input type="text" placeholder="@username" style={{
                width: "100%", padding: "12px 16px", borderRadius: 10,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "white", fontSize: 14, outline: "none", fontFamily: "inherit"
              }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Description</label>
              <input type="text" placeholder="Programme 12 semaines" style={{
                width: "100%", padding: "12px 16px", borderRadius: 10,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "white", fontSize: 14, outline: "none", fontFamily: "inherit"
              }} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button style={{
                flex: 1, padding: "14px",
                background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                border: "none", borderRadius: 12, color: "white",
                fontSize: 15, fontWeight: 700, cursor: "pointer"
              }}>Ajouter</button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: "14px 24px", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
                  color: "#888", fontSize: 13, fontWeight: 600, cursor: "pointer"
                }}
              >Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
