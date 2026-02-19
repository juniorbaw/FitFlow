'use client'

import { useState, useMemo, useEffect } from "react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { createClient } from '@/lib/supabase/client'
import InstagramOnboarding from './components/InstagramOnboarding'
import UserMenu from '@/components/UserMenu'
import NotificationCenter from '@/components/NotificationCenter'
import ExportButton from '@/components/ExportButton'
import Link from 'next/link'
import { ContentAnalyzerTab } from './components/tabs/ContentAnalyzerTab'
import { RevenueTab } from './components/tabs/RevenueTab'
import { AutoDMTab } from './components/tabs/AutoDMTab'

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"
const RED = "#FF4D4D"
const YELLOW = "#FFB800"
const BLUE = "#3B82F6"

// ALL FAKE DATA REMOVED - Using real Supabase data only

function StatCard({ label, value, change, icon, color = "white" }: any) {
  const isPositive = change && change.startsWith("+")
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px", flex: 1, minWidth: 200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, color }}>{value}</div>
      {change && (
        <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: isPositive ? GREEN : RED, display: "flex", alignItems: "center", gap: 4 }}>
          {isPositive ? "↑" : "↓"} {change} vs semaine dernière
        </div>
      )}
    </div>
  )
}

function ScoreBadge({ score }: any) {
  let bg, color, label
  if (score >= 9) { bg = "rgba(255,92,0,0.15)"; color = ORANGE; label = "VIP" }
  else if (score >= 7) { bg = "rgba(59,130,246,0.15)"; color = BLUE; label = "Standard" }
  else { bg = "rgba(255,255,255,0.08)"; color = "#666"; label = "Low" }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ background: bg, color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 800, color }}>{score}/10</span>
    </div>
  )
}

function StatusBadge({ status }: any) {
  const map: any = {
    dm_sent: { label: "DM envoyé", bg: "rgba(59,130,246,0.15)", color: BLUE },
    converted: { label: "Converti ✓", bg: "rgba(0,210,106,0.15)", color: GREEN },
    ignored: { label: "Ignoré", bg: "rgba(255,255,255,0.06)", color: "#555" },
    pending: { label: "En attente", bg: "rgba(255,184,0,0.15)", color: YELLOW },
  }
  const s = map[status] || map.pending
  return <span style={{ background: s.bg, color: s.color, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", fontSize: 13 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, marginTop: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function FitFlowDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [leadFilter, setLeadFilter] = useState("all")
  const [showInstagramOnboarding, setShowInstagramOnboarding] = useState(false)
  const [coach, setCoach] = useState<any>(null)
  const [realLeads, setRealLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkInstagramConnection()
    fetchRealData()
  }, [])

  const fetchRealData = async () => {
    try {
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      setRealLeads(leadsData || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching leads:', error)
      setLoading(false)
    }
  }

  // Computed stats from real data
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const leadsThisWeek = realLeads.filter(l => new Date(l.created_at) >= weekAgo).length
  const avgScore = realLeads.length > 0
    ? (realLeads.reduce((sum, l) => sum + (l.ai_score || 0), 0) / realLeads.length).toFixed(1)
    : '—'
  const dmsSent = realLeads.filter(l => ['dm_sent', 'converted', 'replied'].includes(l.status)).length
  const conversions = realLeads.filter(l => l.status === 'converted').length
  const totalRevenue = realLeads.reduce((sum, l) => sum + (l.revenue || 0), 0)

  const checkInstagramConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: coachData } = await supabase
        .from('coaches')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setCoach(coachData)

      // Show Instagram onboarding if not connected yet
      if (coachData && !coachData.instagram_username) {
        // Check if user has dismissed the modal before
        const dismissed = localStorage.getItem('instagram_onboarding_dismissed')
        if (!dismissed) {
          setTimeout(() => setShowInstagramOnboarding(true), 2000) // Show after 2 seconds
        }
      }
    } catch (error) {
      console.error('Error checking Instagram connection:', error)
    }
  }

  const handleSkipInstagram = () => {
    localStorage.setItem('instagram_onboarding_dismissed', 'true')
    setShowInstagramOnboarding(false)
  }

  const filteredLeads = useMemo(() => {
    if (leadFilter === "all") return realLeads
    return realLeads.filter(l => {
      if (!l.ai_score) return leadFilter === "low"
      if (l.ai_score >= 9) return leadFilter === "vip"
      if (l.ai_score >= 7) return leadFilter === "standard"
      return leadFilter === "low"
    })
  }, [leadFilter, realLeads])

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: "📊" },
    { id: "leads", label: "Leads", icon: "👥" },
    { id: "autodm", label: "Auto-DM", icon: "✉️" },
    { id: "content", label: "Content AI", icon: "🎨" },
    { id: "revenue", label: "Revenue", icon: "💰" },
  ]

  return (
    <>
      {showInstagramOnboarding && (
        <InstagramOnboarding 
          onClose={() => setShowInstagramOnboarding(false)}
          onSkip={handleSkipInstagram}
        />
      )}
      
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fafafa", fontFamily: "'DM Sans', -apple-system, sans-serif", width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
      <div style={{ padding: "16px clamp(16px, 4vw, 32px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5, textDecoration: "none", color: "inherit", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = "0.7"} onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = "1"}>
            Fit<span style={{ color: ORANGE }}>Flow</span>
          </Link>
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: activeTab === tab.id ? "rgba(255,92,0,0.15)" : "transparent", color: activeTab === tab.id ? ORANGE : "#888", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dashboard/templates" style={{ textDecoration: 'none' }}>
            <button style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.2)",
              color: "#8B5CF6",
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              💬 Templates
            </button>
          </Link>
          <ExportButton type="leads" />
          <button
            onClick={() => window.location.href = '/how-it-works'}
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: BLUE,
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            ❓ Guide
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,210,106,0.1)", border: "1px solid rgba(0,210,106,0.2)", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: GREEN }}>
            <span style={{ width: 7, height: 7, background: GREEN, borderRadius: "50%" }}></span>Système actif
          </div>
          <NotificationCenter />
          <UserMenu />
        </div>
      </div>

      <div style={{ padding: "clamp(16px, 4vw, 32px)", maxWidth: "1400px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {activeTab === "overview" && (
          <>
            <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
              <StatCard label="Leads cette semaine" value={leadsThisWeek || 0} icon="👥" color={ORANGE} />
              <StatCard label="Score moyen" value={avgScore} icon="🎯" color={BLUE} />
              <StatCard label="DMs envoyés" value={dmsSent} icon="✉️" />
              <StatCard label="Conversions" value={conversions} icon="🏆" color={GREEN} />
              <StatCard label="Revenue estimé" value={`${totalRevenue}€`} icon="💰" color={ORANGE} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 32 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Leads par jour</div>
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Pas encore de données</h3>
                  <p style={{ fontSize: 13, color: "#888" }}>Le graphique se remplira avec vos premiers leads.</p>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Répartition des leads</div>
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Aucune donnée</h3>
                  <p style={{ fontSize: 13, color: "#888" }}>La répartition VIP / Standard / Low apparaîtra ici.</p>
                </div>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 32 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Funnel de conversion</div>
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔄</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Funnel vide</h3>
                <p style={{ fontSize: 13, color: "#888" }}>Le funnel de conversion se remplira avec vos premiers leads.</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Derniers leads</div>
                <button onClick={() => setActiveTab("leads")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: ORANGE, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Voir tout →</button>
              </div>
              {realLeads.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>👥</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Aucun lead pour l'instant</h3>
                  <p style={{ fontSize: 13, color: "#888" }}>Vos premiers leads apparaîtront ici dès que l'automatisation sera active.</p>
                </div>
              ) : (
                realLeads.slice(0, 4).map((lead: any) => (
                  <div key={lead.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>@{lead.username || lead.instagram_username || 'unknown'}</div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.comment || lead.comment_text || ''}</div>
                    </div>
                    <ScoreBadge score={lead.ai_score || lead.score || 0} />
                    <StatusBadge status={lead.status} />
                    <span style={{ fontSize: 12, color: "#555", minWidth: 80, textAlign: "right" }}>{lead.created_at ? new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === "leads" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Tous les leads</h2>
              <div style={{ display: "flex", gap: 6 }}>
                {[{ id: "all", label: "Tous" }, { id: "vip", label: "VIP" }, { id: "standard", label: "Standard" }, { id: "low", label: "Low" }].map(f => (
                  <button key={f.id} onClick={() => setLeadFilter(f.id)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", borderColor: leadFilter === f.id ? ORANGE : "rgba(255,255,255,0.1)", background: leadFilter === f.id ? "rgba(255,92,0,0.15)" : "transparent", color: leadFilter === f.id ? ORANGE : "#888", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{f.label}</button>
                ))}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
              {filteredLeads.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>👥</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 8 }}>Aucun lead pour l'instant</h3>
                  <p style={{ fontSize: 13, color: "#888" }}>Vos premiers leads apparaîtront ici dès que l'automatisation sera active.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 100px 100px 100px 90px", padding: "14px 24px", fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span>Username</span><span>Commentaire</span><span>Score</span><span>Post</span><span>Status</span><span style={{ textAlign: "right" }}>Temps</span>
                  </div>
                  {filteredLeads.map(lead => (
                    <div key={lead.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 100px 100px 100px 90px", padding: "16px 24px", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s", cursor: "pointer" }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>@{lead.username || lead.instagram_username || 'unknown'}</span>
                      <span style={{ fontSize: 13, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.comment || lead.comment_text || ''}</span>
                      <ScoreBadge score={lead.ai_score || lead.score || 0} />
                      <span style={{ fontSize: 12, color: "#666" }}>{(lead.post_url || lead.post || '').slice(0, 12)}...</span>
                      <StatusBadge status={lead.status} />
                      <span style={{ fontSize: 12, color: "#555", textAlign: "right" }}>{lead.created_at ? new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        )}

        {activeTab === "autodm" && <AutoDMTab />}

        {activeTab === "content" && <ContentAnalyzerTab />}

        {activeTab === "revenue" && <RevenueTab />}
      </div>
    </div>
    </>
  )
}
