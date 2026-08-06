'use client'

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const ORANGE = "#FF5C00";
const GREEN = "#00D26A";
const BLUE = "#3B82F6";
const YELLOW = "#FFB800";

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  dm_sent: { label: "DM envoyé", color: BLUE, bg: "rgba(59,130,246,0.1)" },
  converted: { label: "Converti ✓", color: GREEN, bg: "rgba(0,210,106,0.12)" },
  replied: { label: "Répondu", color: GREEN, bg: "rgba(0,210,106,0.08)" },
  ignored: { label: "Ignoré", color: "#555", bg: "rgba(255,255,255,0.04)" },
  pending: { label: "En attente", color: YELLOW, bg: "rgba(255,184,0,0.1)" },
};

function scoreBadge(score: number) {
  if (score >= 9) return { label: "VIP", color: ORANGE, bg: "rgba(255,92,0,0.12)" };
  if (score >= 7) return { label: "Standard", color: BLUE, bg: "rgba(59,130,246,0.12)" };
  return { label: "Low", color: "#666", bg: "rgba(255,255,255,0.04)" };
}

export function OverviewTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setLeads(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Calcul des vraies stats
  const totalLeads = leads.length;
  const avgScore = totalLeads > 0
    ? (leads.reduce((sum, l) => sum + (l.ai_score || 0), 0) / totalLeads).toFixed(1)
    : '—';
  const dmsSent = leads.filter(l => ['dm_sent', 'converted', 'replied'].includes(l.status)).length;
  const conversions = leads.filter(l => l.status === 'converted').length;
  const revenue = leads.reduce((sum, l) => sum + (l.revenue || 0), 0);

  const hasData = leads.length > 0;

  const stats = [
    { label: "Leads cette semaine", value: String(totalLeads), icon: "👥", color: ORANGE },
    { label: "Score moyen", value: hasData ? `${avgScore}` : '—', icon: "🎯", color: BLUE },
    { label: "DMs envoyés", value: String(dmsSent), icon: "✉️", color: "#fff" },
    { label: "Conversions", value: String(conversions), icon: "🏆", color: GREEN },
    { label: "Revenue estimé", value: `${revenue}€`, icon: "💰", color: ORANGE },
  ];

  // Répartition réelle
  const vipCount = leads.filter(l => (l.ai_score || 0) >= 9).length;
  const stdCount = leads.filter(l => (l.ai_score || 0) >= 7 && (l.ai_score || 0) < 9).length;
  const lowCount = leads.filter(l => (l.ai_score || 0) < 7).length;
  const total = totalLeads || 1;
  const vipPct = Math.round((vipCount / total) * 100);
  const stdPct = Math.round((stdCount / total) * 100);
  const lowPct = Math.round((lowCount / total) * 100);

  // Données bar chart : leads des 7 derniers jours groupés par jour
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const chartBars = Array(7).fill(0).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return leads.filter(l => {
      const ld = new Date(l.created_at);
      return ld.toDateString() === d.toDateString();
    }).length;
  });
  const maxBar = Math.max(...chartBars, 1);

  // Donut chart SVG dynamique
  const circumference = 2 * Math.PI * 60; // ~377
  const vipDash = (vipPct / 100) * circumference;
  const stdDash = (stdPct / 100) * circumference;
  const lowDash = (lowPct / 100) * circumference;

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <div style={{
          width: 40, height: 40, border: `3px solid ${ORANGE}`,
          borderTopColor: "transparent", borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
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
                    width: "100%", height: `${(h / maxBar) * 160}px`,
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
                    strokeDasharray={`${vipDash} ${circumference - vipDash}`}
                    strokeDashoffset="0" transform="rotate(-90 80 80)" />
                  <circle cx="80" cy="80" r="60" fill="none" stroke={BLUE} strokeWidth="20"
                    strokeDasharray={`${stdDash} ${circumference - stdDash}`}
                    strokeDashoffset={`-${vipDash}`} transform="rotate(-90 80 80)" />
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#444" strokeWidth="20"
                    strokeDasharray={`${lowDash} ${circumference - lowDash}`}
                    strokeDashoffset={`-${vipDash + stdDash}`} transform="rotate(-90 80 80)" />
                  <text x="80" y="76" textAnchor="middle" fill="white" fontSize="24" fontWeight="800">{totalLeads}</text>
                  <text x="80" y="94" textAnchor="middle" fill="#666" fontSize="11">leads</text>
                </svg>
              </div>
              {[
                { label: "VIP (9-10)", pct: `${vipPct}%`, color: ORANGE },
                { label: "Standard (7-8)", pct: `${stdPct}%`, color: BLUE },
                { label: "Low (<7)", pct: `${lowPct}%`, color: "#555" },
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
              const badge = scoreBadge(lead.ai_score || 0);
              const st = statusMap[lead.status] || statusMap.pending;
              return (
                <div key={lead.id || i} style={{
                  display: "grid", gridTemplateColumns: "140px 1fr 100px 110px 70px",
                  padding: "14px 16px", alignItems: "center",
                  borderRadius: 10, cursor: "pointer",
                  background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                  transition: "background 0.15s"
                }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>@{lead.username || lead.instagram_username || '—'}</span>
                  <span style={{
                    fontSize: 13, color: "#777",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    paddingRight: 16
                  }}>{lead.comment_text || lead.comment || '—'}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      background: badge.bg, color: badge.color,
                      padding: "3px 8px", borderRadius: 6,
                      fontSize: 10, fontWeight: 800
                    }}>{badge.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: badge.color }}>{lead.ai_score || 0}/10</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{
                      background: st.bg, color: st.color,
                      padding: "4px 12px", borderRadius: 20,
                      fontSize: 11, fontWeight: 700
                    }}>{st.label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#555", textAlign: "right" }}>
                    {new Date(lead.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
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
  );
}
