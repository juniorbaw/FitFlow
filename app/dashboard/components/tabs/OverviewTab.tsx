'use client'

import { useState } from "react";

const ORANGE = "#FF5C00";
const GREEN = "#00D26A";
const BLUE = "#3B82F6";
const YELLOW = "#FFB800";

export default function OverviewTab() {
  const [activeTab, setActiveTab] = useState("overview");
  const [hasData] = useState(true);

  const stats = hasData
    ? [
        { label: "Leads cette semaine", value: "47", change: "+23%", icon: "👥", color: ORANGE },
        { label: "Score moyen", value: "8.2", change: "+0.6", icon: "🎯", color: BLUE },
        { label: "DMs envoyés", value: "34", change: "+31%", icon: "✉️", color: "#fff" },
        { label: "Conversions", value: "12", change: "+44%", icon: "🏆", color: GREEN },
        { label: "Revenue estimé", value: "2 940€", change: "+38%", icon: "💰", color: ORANGE },
      ]
    : [
        { label: "Leads cette semaine", value: "0", icon: "👥", color: "#555" },
        { label: "Score moyen", value: "—", icon: "🎯", color: "#555" },
        { label: "DMs envoyés", value: "0", icon: "✉️", color: "#555" },
        { label: "Conversions", value: "0", icon: "🏆", color: "#555" },
        { label: "Revenue estimé", value: "0€", icon: "💰", color: "#555" },
      ];

  const leads = hasData
    ? [
        { user: "@fitgirl_23", comment: "Trop bien ! Tu proposes des programmes perso ?", score: 9, status: "converted", time: "14:32" },
        { user: "@muscle_tom", comment: "Wow ces résultats 💪 comment je fais pour commencer ?", score: 9, status: "dm_sent", time: "15:01" },
        { user: "@yoga_sarah", comment: "Super contenu ! Tu coaches aussi pour la souplesse ?", score: 8, status: "replied", time: "15:22" },
        { user: "@run_alex", comment: "Je veux perdre 10kg, tu peux m'aider ?", score: 8, status: "dm_sent", time: "16:45" },
        { user: "@noob_123", comment: "Pas mal 👍", score: 3, status: "ignored", time: "17:12" },
      ]
    : [];

  const chartBars = hasData ? [22, 35, 28, 45, 52, 38, 60] : [0, 0, 0, 0, 0, 0, 0];
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    dm_sent: { label: "DM envoyé", color: BLUE, bg: "rgba(59,130,246,0.1)" },
    converted: { label: "Converti ✓", color: GREEN, bg: "rgba(0,210,106,0.12)" },
    replied: { label: "Répondu", color: GREEN, bg: "rgba(0,210,106,0.08)" },
    ignored: { label: "Ignoré", color: "#555", bg: "rgba(255,255,255,0.04)" },
    pending: { label: "En attente", color: YELLOW, bg: "rgba(255,184,0,0.1)" },
  };

  const scoreBadge = (score: number) => {
    if (score >= 9) return { label: "VIP", color: ORANGE, bg: "rgba(255,92,0,0.12)" };
    if (score >= 7) return { label: "Standard", color: BLUE, bg: "rgba(59,130,246,0.12)" };
    return { label: "Low", color: "#666", bg: "rgba(255,255,255,0.04)" };
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050508", color: "#fafafa",
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* NAV */}
      <div style={{
        padding: "0 32px", height: 60, borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontWeight: 800, fontSize: 20 }}>Fit<span style={{ color: ORANGE }}>Flow</span></span>
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4 }}>
            {[
              { id: "overview", label: "📊 Vue d'ensemble" },
              { id: "leads", label: "👥 Leads" },
              { id: "autodm", label: "🤖 Auto-DM" },
              { id: "content", label: "🎨 Content AI" },
              { id: "revenue", label: "💰 Revenue" },
            ].map((tab) => (
              <span key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  background: activeTab === tab.id ? "rgba(255,92,0,0.12)" : "transparent",
                  color: activeTab === tab.id ? ORANGE : "#666",
                  transition: "all 0.15s"
                }}
              >{tab.label}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#888", padding: "8px 16px", borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6
          }}>📥 Exporter</button>
          <button style={{
            background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
            color: BLUE, padding: "8px 16px", borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>❓ Guide</button>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(0,210,106,0.08)", border: "1px solid rgba(0,210,106,0.15)",
            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: GREEN
          }}>
            <span style={{ width: 6, height: 6, background: GREEN, borderRadius: "50%", display: "inline-block" }} />
            Actif
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: ORANGE,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14, cursor: "pointer"
          }}>S</div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "28px 32px" }}>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 28 }}>
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
              {('change' in s) && s.change && (
                <div style={{
                  marginTop: 8, fontSize: 12, fontWeight: 700,
                  color: s.change.startsWith("+") ? GREEN : "#FF4D4D",
                  display: "flex", alignItems: "center", gap: 4
                }}>
                  {s.change.startsWith("+") ? "↑" : "↓"} {s.change}
                  <span style={{ color: "#555", fontWeight: 500 }}>vs sem. dernière</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 28 }}>
          {/* Bar Chart */}
          <div style={{
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: 24
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 24 }}>Leads par jour</div>
            {hasData ? (
              <div style={{ display: "flex", alignItems: "flex-end", height: 180, gap: 8, padding: "0 8px" }}>
                {chartBars.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#888" }}>{h}</span>
                    <div style={{
                      width: "100%", height: `${(h / 60) * 160}px`,
                      background: `linear-gradient(180deg, ${ORANGE}, ${ORANGE}25)`,
                      borderRadius: "6px 6px 2px 2px", minHeight: 4,
                      transition: "height 0.5s"
                    }} />
                    <span style={{ fontSize: 11, color: "#555" }}>{days[i]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
                  <p style={{ fontSize: 14, color: "#555" }}>Les données apparaîtront ici avec vos premiers leads</p>
                </div>
              </div>
            )}
          </div>

          {/* Donut Chart */}
          <div style={{
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: 24
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 24 }}>Répartition des leads</div>
            {hasData ? (
              <div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="20" />
                    <circle cx="80" cy="80" r="60" fill="none" stroke={ORANGE} strokeWidth="20"
                      strokeDasharray="113 264" strokeDashoffset="0" transform="rotate(-90 80 80)" />
                    <circle cx="80" cy="80" r="60" fill="none" stroke={BLUE} strokeWidth="20"
                      strokeDasharray="94 283" strokeDashoffset="-113" transform="rotate(-90 80 80)" />
                    <circle cx="80" cy="80" r="60" fill="none" stroke="#444" strokeWidth="20"
                      strokeDasharray="70 307" strokeDashoffset="-207" transform="rotate(-90 80 80)" />
                    <text x="80" y="76" textAnchor="middle" fill="white" fontSize="24" fontWeight="800">47</text>
                    <text x="80" y="94" textAnchor="middle" fill="#666" fontSize="11">leads</text>
                  </svg>
                </div>
                {[
                  { label: "VIP (9-10)", pct: "30%", color: ORANGE },
                  { label: "Standard (7-8)", pct: "45%", color: BLUE },
                  { label: "Low (<7)", pct: "25%", color: "#555" },
                ].map((d, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, display: "inline-block" }} />
                      <span style={{ fontSize: 13, color: "#aaa" }}>{d.label}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{d.pct}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🎯</div>
                  <p style={{ fontSize: 14, color: "#555" }}>Aucun lead à analyser</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RECENT LEADS */}
        <div style={{
          background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, padding: 24
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Derniers leads</div>
            <button style={{
              background: "none", border: "1px solid rgba(255,255,255,0.08)",
              color: ORANGE, padding: "6px 14px", borderRadius: 8,
              fontSize: 12, fontWeight: 600, cursor: "pointer"
            }}>Voir tout →</button>
          </div>

          {leads.length > 0 ? (
            <div>
              <div style={{
                display: "grid", gridTemplateColumns: "140px 1fr 100px 110px 70px",
                padding: "8px 16px", fontSize: 11, fontWeight: 700, color: "#444",
                textTransform: "uppercase", letterSpacing: 1, marginBottom: 4
              }}>
                <span>Lead</span>
                <span>Commentaire</span>
                <span>Score</span>
                <span style={{ textAlign: "center" }}>Statut</span>
                <span style={{ textAlign: "right" }}>Heure</span>
              </div>

              {leads.map((lead, i) => {
                const badge = scoreBadge(lead.score);
                const st = statusMap[lead.status];
                return (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "140px 1fr 100px 110px 70px",
                    padding: "14px 16px", alignItems: "center",
                    borderRadius: 10, cursor: "pointer",
                    background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                    transition: "background 0.15s"
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{lead.user}</span>
                    <span style={{
                      fontSize: 13, color: "#777",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      paddingRight: 16
                    }}>{lead.comment}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        background: badge.bg, color: badge.color,
                        padding: "3px 8px", borderRadius: 6,
                        fontSize: 10, fontWeight: 800
                      }}>{badge.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: badge.color }}>{lead.score}/10</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <span style={{
                        background: st.bg, color: st.color,
                        padding: "4px 12px", borderRadius: 20,
                        fontSize: 11, fontWeight: 700
                      }}>{st.label}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#555", textAlign: "right" }}>{lead.time}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🚀</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Aucun lead pour l&apos;instant</h3>
              <p style={{ fontSize: 14, color: "#666", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
                Vos premiers leads apparaîtront ici dès que l&apos;automatisation Instagram sera active.
                Publiez un post et regardez la magie opérer.
              </p>
              <button style={{
                marginTop: 20, padding: "12px 28px", borderRadius: 12,
                background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                border: "none", color: "white", fontWeight: 700,
                fontSize: 14, cursor: "pointer",
                boxShadow: `0 6px 20px ${ORANGE}30`
              }}>
                Configurer Instagram →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
