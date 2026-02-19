'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"
const BLUE = "#3B82F6"
const YELLOW = "#FFB800"

export function OverviewTab() {
  const [activeTab, setActiveTab] = useState("overview")
  const [leads, setLeads] = useState<any[]>([])
  const [dailyStats, setDailyStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      const { data: statsData } = await supabase
        .from('daily_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(7)

      setLeads(leadsData || [])
      setDailyStats(statsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalLeads = leads.length
  const avgScore = totalLeads > 0
    ? (leads.reduce((sum, l) => sum + (l.ai_score || 0), 0) / totalLeads).toFixed(1)
    : '0'
  const dmsSent = leads.filter(l => ['dm_sent', 'converted', 'replied'].includes(l.status)).length
  const conversions = leads.filter(l => l.status === 'converted').length
  const revenue = leads.reduce((sum, l) => sum + (l.revenue || 0), 0)

  const isDemoMode = totalLeads === 0

  const displayLeads = isDemoMode
    ? [
        { id: '1', username: 'fitgirl_23', ai_score: 9, status: 'converted', comment_text: 'Trop bien ! Tu proposes des programmes perso ?', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: '2', username: 'muscle_tom', ai_score: 9, status: 'dm_sent', comment_text: 'Wow ces résultats 💪 comment je fais pour commencer ?', created_at: new Date(Date.now() - 7200000).toISOString() },
        { id: '3', username: 'yoga_sarah', ai_score: 8, status: 'replied', comment_text: 'Super contenu ! Tu coaches aussi pour la souplesse ?', created_at: new Date(Date.now() - 10800000).toISOString() },
        { id: '4', username: 'run_alex', ai_score: 8, status: 'dm_sent', comment_text: 'Je veux perdre 10kg, tu peux m\'aider ?', created_at: new Date(Date.now() - 14400000).toISOString() },
        { id: '5', username: 'noob_123', ai_score: 3, status: 'ignored', comment_text: 'Pas mal 👍', created_at: new Date(Date.now() - 18000000).toISOString() },
      ]
    : leads.slice(0, 5)

  const stats = isDemoMode
    ? [
        { label: "Leads cette semaine", value: "47", change: "+23%", icon: "👥", color: ORANGE },
        { label: "Score moyen", value: "8.2", change: "+0.6", icon: "🎯", color: BLUE },
        { label: "DMs envoyés", value: "34", change: "+31%", icon: "✉️", color: "#fff" },
        { label: "Conversions", value: "12", change: "+44%", icon: "🏆", color: GREEN },
        { label: "Revenue estimé", value: "2 940€", change: "+38%", icon: "💰", color: ORANGE },
      ]
    : [
        { label: "Leads cette semaine", value: String(totalLeads), change: "", icon: "👥", color: ORANGE },
        { label: "Score moyen", value: `${avgScore}/10`, change: "", icon: "🎯", color: BLUE },
        { label: "DMs envoyés", value: String(dmsSent), change: "", icon: "✉️", color: "#fff" },
        { label: "Conversions", value: String(conversions), change: "", icon: "🏆", color: GREEN },
        { label: "Revenue estimé", value: `${revenue.toLocaleString('fr-FR')}€`, change: "", icon: "💰", color: ORANGE },
      ]

  const chartBars = isDemoMode
    ? [22, 35, 28, 45, 52, 38, 60]
    : dailyStats.slice().reverse().map(s => s.total_leads || 0)

  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    dm_sent: { label: "DM envoyé", color: BLUE, bg: "rgba(59,130,246,0.1)" },
    converted: { label: "Converti ✓", color: GREEN, bg: "rgba(0,210,106,0.12)" },
    replied: { label: "Répondu", color: GREEN, bg: "rgba(0,210,106,0.08)" },
    ignored: { label: "Ignoré", color: "#555", bg: "rgba(255,255,255,0.04)" },
    pending: { label: "En attente", color: YELLOW, bg: "rgba(255,184,0,0.1)" },
  }

  const scoreBadge = (score: number) => {
    if (score >= 9) return { label: "VIP", color: ORANGE, bg: "rgba(255,92,0,0.12)" }
    if (score >= 7) return { label: "Standard", color: BLUE, bg: "rgba(59,130,246,0.12)" }
    return { label: "Low", color: "#666", bg: "rgba(255,255,255,0.04)" }
  }

  const vipCount = isDemoMode ? 14 : leads.filter(l => (l.ai_score || 0) >= 9).length
  const standardCount = isDemoMode ? 21 : leads.filter(l => (l.ai_score || 0) >= 7 && (l.ai_score || 0) < 9).length
  const lowCount = isDemoMode ? 12 : leads.filter(l => (l.ai_score || 0) < 7).length

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 256 }}>
        <div style={{ width: 32, height: 32, border: `2px solid ${ORANGE}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }}></div>
        <span style={{ marginLeft: 12, color: "#888" }}>Chargement...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Mode démo banner */}
      {isDemoMode && (
        <div style={{
          background: "rgba(255,92,0,0.08)", border: "1px solid rgba(255,92,0,0.2)",
          borderRadius: 16, padding: "14px 20px",
          display: "flex", alignItems: "center", gap: 12
        }}>
          <span style={{ fontSize: 20 }}>📊</span>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: ORANGE }}>Mode Aperçu — </span>
            <span style={{ fontSize: 14, color: "#aaa" }}>Données de démonstration. Connectez Instagram pour voir vos vraies données.</span>
          </div>
        </div>
      )}

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
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
            {s.change && (
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
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
        {/* Bar Chart */}
        <div style={{
          background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, padding: 24
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 24 }}>Leads par jour</div>
          <div style={{ display: "flex", alignItems: "flex-end", height: 180, gap: 8, padding: "0 8px" }}>
            {chartBars.map((h, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#888" }}>{h}</span>
                <div style={{
                  width: "100%", height: `${Math.max((h / Math.max(...chartBars, 1)) * 160, 4)}px`,
                  background: `linear-gradient(180deg, ${ORANGE}, ${ORANGE}25)`,
                  borderRadius: "6px 6px 2px 2px",
                  transition: "height 0.5s"
                }} />
                <span style={{ fontSize: 11, color: "#555" }}>{days[i] || ''}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart */}
        <div style={{
          background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, padding: 24
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 24 }}>Répartition des leads</div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="20" />
              <circle cx="80" cy="80" r="60" fill="none" stroke={ORANGE} strokeWidth="20"
                strokeDasharray="113 264" strokeDashoffset="0" transform="rotate(-90 80 80)" />
              <circle cx="80" cy="80" r="60" fill="none" stroke={BLUE} strokeWidth="20"
                strokeDasharray="94 283" strokeDashoffset="-113" transform="rotate(-90 80 80)" />
              <circle cx="80" cy="80" r="60" fill="none" stroke="#444" strokeWidth="20"
                strokeDasharray="70 307" strokeDashoffset="-207" transform="rotate(-90 80 80)" />
              <text x="80" y="76" textAnchor="middle" fill="white" fontSize="24" fontWeight="800">{isDemoMode ? 47 : totalLeads}</text>
              <text x="80" y="94" textAnchor="middle" fill="#666" fontSize="11">leads</text>
            </svg>
          </div>
          {[
            { label: "VIP (9-10)", pct: isDemoMode ? "30%" : `${totalLeads > 0 ? Math.round(vipCount / totalLeads * 100) : 0}%`, color: ORANGE },
            { label: "Standard (7-8)", pct: isDemoMode ? "45%" : `${totalLeads > 0 ? Math.round(standardCount / totalLeads * 100) : 0}%`, color: BLUE },
            { label: "Low (<7)", pct: isDemoMode ? "25%" : `${totalLeads > 0 ? Math.round(lowCount / totalLeads * 100) : 0}%`, color: "#555" },
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

        {/* Header */}
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

        {displayLeads.map((lead, i) => {
          const badge = scoreBadge(lead.ai_score || lead.score || 0)
          const st = statusMap[lead.status] || statusMap['pending']
          return (
            <div key={lead.id} style={{
              display: "grid", gridTemplateColumns: "140px 1fr 100px 110px 70px",
              padding: "14px 16px", alignItems: "center",
              borderRadius: 10, cursor: "pointer",
              background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
              transition: "background 0.15s"
            }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>@{lead.username}</span>
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
                <span style={{ fontSize: 13, fontWeight: 800, color: badge.color }}>{lead.ai_score || lead.score || 0}/10</span>
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
          )
        })}

        {displayLeads.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🚀</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Aucun lead pour l'instant</h3>
            <p style={{ fontSize: 14, color: "#666", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
              Vos premiers leads apparaîtront ici dès que l'automatisation Instagram sera active.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
