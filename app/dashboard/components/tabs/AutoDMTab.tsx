'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"
const BLUE = "#3B82F6"
const YELLOW = "#FFB800"

export function AutoDMTab() {
  const [score, setScore] = useState(7)
  const [limit, setLimit] = useState(50)
  const [autoDmEnabled, setAutoDmEnabled] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)
  const [defaultMsg, setDefaultMsg] = useState(
    "Salut ! J'ai vu ton commentaire 💪 Tu cherches à transformer ton physique ? J'ai créé un programme sur-mesure qui pourrait t'intéresser. Discutons-en !"
  )
  const [templates, setTemplates] = useState([
    {
      id: "vip",
      label: "Template VIP",
      score: "9-10",
      color: ORANGE,
      bg: "rgba(255,92,0,0.06)",
      border: "rgba(255,92,0,0.15)",
      msg: "Salut {username} ! 🔥 J'ai lu ton commentaire et je sens que tu es vraiment motivé(e). J'ai un programme qui pourrait te correspondre parfaitement. On en discute ?",
    },
    {
      id: "standard",
      label: "Template Standard",
      score: "7-8",
      color: BLUE,
      bg: "rgba(59,130,246,0.06)",
      border: "rgba(59,130,246,0.15)",
      msg: "Hey {username} ! 👋 Merci pour ton commentaire. Si tu cherches à progresser, j'ai peut-être quelque chose pour toi. Ça t'intéresse ?",
    },
  ])
  const [leads, setLeads] = useState<any[]>([])
  const [stats, setStats] = useState({ sent: 0, replied: 0, converted: 0 })

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('leads')
      .select('*')
      .in('status', ['dm_sent', 'replied', 'converted'])
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) {
      setLeads(data)
      setStats({
        sent: data.filter(l => ['dm_sent', 'replied', 'converted'].includes(l.status)).length,
        replied: data.filter(l => ['replied', 'converted'].includes(l.status)).length,
        converted: data.filter(l => l.status === 'converted').length,
      })
    }
  }

  const isDemoMode = leads.length === 0

  const dmHistory = isDemoMode
    ? [
        { username: 'fitgirl_23', ai_score: 9, dm_content: "Salut fitgirl_23 ! 🔥 J'ai lu ton commentaire...", status: "replied", created_at: new Date(Date.now() - 3600000).toISOString() },
        { username: 'muscle_tom', ai_score: 8, dm_content: "Hey muscle_tom ! 👋 Merci pour ton commentaire...", status: "dm_sent", created_at: new Date(Date.now() - 7200000).toISOString() },
        { username: 'yoga_sarah', ai_score: 9, dm_content: "Salut yoga_sarah ! 🔥 J'ai lu ton commentaire...", status: "converted", created_at: new Date(Date.now() - 10800000).toISOString() },
        { username: 'run_alex', ai_score: 7, dm_content: "Hey run_alex ! 👋 Merci pour ton commentaire...", status: "dm_sent", created_at: new Date(Date.now() - 14400000).toISOString() },
      ]
    : leads

  const dmsSentToday = isDemoMode ? 12 : stats.sent
  const responseRate = isDemoMode ? 67 : (stats.sent > 0 ? Math.round((stats.replied / stats.sent) * 100) : 0)
  const conversionsCount = isDemoMode ? 4 : stats.converted

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    dm_sent: { label: "Envoyé", color: BLUE, bg: "rgba(59,130,246,0.1)" },
    replied: { label: "Répondu", color: GREEN, bg: "rgba(0,210,106,0.1)" },
    converted: { label: "Converti ✓", color: GREEN, bg: "rgba(0,210,106,0.15)" },
    pending: { label: "En attente", color: YELLOW, bg: "rgba(255,184,0,0.1)" },
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header Card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,92,0,0.08), rgba(255,92,0,0.02))",
        border: "1px solid rgba(255,92,0,0.12)",
        borderRadius: 20, padding: 32
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Auto-DM Intelligent</h1>
            <p style={{ fontSize: 14, color: "#888" }}>
              Les prospects qualifiés reçoivent automatiquement un DM personnalisé par l'IA
            </p>
          </div>
          {/* Toggle */}
          <div
            onClick={() => setAutoDmEnabled(!autoDmEnabled)}
            style={{
              width: 52, height: 28, borderRadius: 14, cursor: "pointer",
              background: autoDmEnabled ? GREEN : "rgba(255,255,255,0.1)",
              padding: 3, transition: "all 0.2s", display: "flex",
              alignItems: "center",
              justifyContent: autoDmEnabled ? "flex-end" : "flex-start"
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "white", transition: "all 0.2s" }} />
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "DMs envoyés aujourd'hui", value: `${dmsSentToday} / ${limit}`, sub: "limite quotidienne" },
            { label: "Taux de réponse", value: `${responseRate}%`, sub: "cette semaine", color: GREEN },
            { label: "Conversions via Auto-DM", value: String(conversionsCount), sub: "ce mois", color: ORANGE },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 12, color: "#666", fontWeight: 600, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color || "white" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, padding: 32
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>⚙️</span> Configuration
        </h2>

        {/* Score Slider */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>Score minimum pour Auto-DM</label>
            <span style={{ fontSize: 16, fontWeight: 800, color: ORANGE }}>{score}/10</span>
          </div>
          <div style={{ position: "relative", height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
            <div style={{
              position: "absolute", left: 0, top: 0, height: "100%",
              width: `${(score / 10) * 100}%`,
              background: `linear-gradient(90deg, ${ORANGE}, #FF8A00)`,
              borderRadius: 4, transition: "width 0.2s"
            }} />
            <input
              type="range" min="1" max="10" value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              style={{ position: "absolute", top: -8, left: 0, width: "100%", height: 24, opacity: 0, cursor: "pointer" }}
            />
            <div style={{
              position: "absolute", top: -6,
              left: `calc(${(score / 10) * 100}% - 10px)`,
              width: 20, height: 20, borderRadius: "50%",
              background: ORANGE, border: "3px solid #050508",
              boxShadow: `0 0 12px ${ORANGE}60`,
              transition: "left 0.2s", pointerEvents: "none"
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#444" }}>1</span>
            <span style={{ fontSize: 11, color: "#444" }}>10</span>
          </div>
          <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
            → Seuls les leads avec un score ≥ {score} recevront un DM automatique
          </p>
        </div>

        {/* Daily Limit */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10 }}>
            Limite quotidienne de DMs
          </label>
          <input
            type="number" value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            style={{
              width: "100%", padding: "14px 18px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)", color: "white",
              fontSize: 15, fontWeight: 600, outline: "none", boxSizing: "border-box"
            }}
          />
          <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
            → Recommandé : 50-100/jour pour éviter les restrictions Instagram
          </p>
        </div>

        {/* Default Message */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10 }}>
            Message par défaut
          </label>
          <textarea
            value={defaultMsg}
            onChange={(e) => setDefaultMsg(e.target.value)}
            rows={3}
            style={{
              width: "100%", padding: "14px 18px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)", color: "white",
              fontSize: 14, lineHeight: 1.6, resize: "vertical", outline: "none",
              fontFamily: "inherit", boxSizing: "border-box"
            }}
          />
          <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
            → Ce message sera personnalisé par l'IA selon le commentaire du lead
          </p>
        </div>

        <button style={{
          width: "100%", padding: "14px",
          background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
          border: "none", borderRadius: 12, color: "white",
          fontSize: 15, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 8px 24px ${ORANGE}25`
        }}>
          💾 Sauvegarder la configuration
        </button>
      </div>

      {/* Templates */}
      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, padding: 32
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>⚡</span> Templates de messages
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {templates.map((t) => (
            <div key={t.id} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    background: t.color, color: "white", padding: "4px 12px",
                    borderRadius: 20, fontSize: 11, fontWeight: 800,
                    textTransform: "uppercase", letterSpacing: 0.5
                  }}>{t.label}</span>
                  <span style={{ fontSize: 13, color: "#888" }}>Score {t.score}</span>
                </div>
                <button
                  onClick={() => setEditingTemplate(editingTemplate === t.id ? null : t.id)}
                  style={{
                    background: "rgba(255,255,255,0.06)", border: "none",
                    color: "#aaa", padding: "6px 14px", borderRadius: 8,
                    fontSize: 12, fontWeight: 600, cursor: "pointer"
                  }}
                >
                  ✏️ Modifier
                </button>
              </div>
              {editingTemplate === t.id ? (
                <textarea
                  value={t.msg}
                  onChange={(e) => {
                    setTemplates(templates.map(tpl =>
                      tpl.id === t.id ? { ...tpl, msg: e.target.value } : tpl
                    ))
                  }}
                  rows={3}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 10,
                    border: `1px solid ${t.border}`,
                    background: "rgba(0,0,0,0.3)", color: "white",
                    fontSize: 14, lineHeight: 1.6, resize: "vertical",
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box"
                  }}
                />
              ) : (
                <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7 }}>"{t.msg}"</p>
              )}
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: "#555", marginTop: 16 }}>
          💡 Les templates sont personnalisés automatiquement selon le score et le commentaire du lead.
          Utilisez <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4, color: ORANGE }}>{"{username}"}</code> pour insérer le nom.
        </p>
      </div>

      {/* DM History */}
      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, padding: 32
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>📨</span> Historique des DMs
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "140px 60px 1fr 100px 60px",
            padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#444",
            textTransform: "uppercase", letterSpacing: 1
          }}>
            <span>Lead</span>
            <span>Score</span>
            <span>Message</span>
            <span style={{ textAlign: "center" }}>Statut</span>
            <span style={{ textAlign: "right" }}>Heure</span>
          </div>

          {dmHistory.map((dm, i) => {
            const st = statusMap[dm.status] || statusMap['dm_sent']
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "140px 60px 1fr 100px 60px",
                padding: "14px 16px", borderRadius: 12, alignItems: "center",
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.03)"
              }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "white" }}>@{dm.username}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: (dm.ai_score || 0) >= 9 ? ORANGE : BLUE }}>
                  {dm.ai_score || 0}/10
                </span>
                <span style={{
                  fontSize: 13, color: "#777",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>{dm.dm_content || "DM envoyé automatiquement..."}</span>
                <div style={{ textAlign: "center" }}>
                  <span style={{
                    background: st.bg, color: st.color,
                    padding: "4px 12px", borderRadius: 20,
                    fontSize: 11, fontWeight: 700
                  }}>{st.label}</span>
                </div>
                <span style={{ fontSize: 12, color: "#555", textAlign: "right" }}>
                  {new Date(dm.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )
          })}
        </div>

        {dmHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#888", marginBottom: 6 }}>
              Aucun DM envoyé pour l'instant
            </p>
            <p style={{ fontSize: 13, color: "#555" }}>
              Les DMs automatiques apparaîtront ici dès que l'automatisation sera active
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
