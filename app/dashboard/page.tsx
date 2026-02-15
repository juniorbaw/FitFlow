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

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"
const RED = "#FF4D4D"
const YELLOW = "#FFB800"
const BLUE = "#3B82F6"

const weeklyLeads = [
  { day: "Lun", leads: 12, vip: 3, standard: 5, low: 4 },
  { day: "Mar", leads: 18, vip: 5, standard: 8, low: 5 },
  { day: "Mer", leads: 15, vip: 4, standard: 6, low: 5 },
  { day: "Jeu", leads: 22, vip: 7, standard: 9, low: 6 },
  { day: "Ven", leads: 28, vip: 9, standard: 12, low: 7 },
  { day: "Sam", leads: 35, vip: 12, standard: 14, low: 9 },
  { day: "Dim", leads: 20, vip: 6, standard: 8, low: 6 },
]

const revenueData = [
  { week: "S1", revenue: 890, leads: 45 },
  { week: "S2", revenue: 1240, leads: 62 },
  { week: "S3", revenue: 1680, leads: 78 },
  { week: "S4", revenue: 2150, leads: 95 },
  { week: "S5", revenue: 2890, leads: 112 },
  { week: "S6", revenue: 3200, leads: 128 },
]

const postPerformance = [
  { post: "Transformation 30j", leads: 45, score: 8.2, conversions: 12, revenue: 2400 },
  { post: "Meal prep lundi", leads: 32, score: 7.1, conversions: 6, revenue: 1200 },
  { post: "Avant/Après client", leads: 58, score: 9.1, conversions: 18, revenue: 3600 },
  { post: "Tips nutrition", leads: 28, score: 6.8, conversions: 4, revenue: 800 },
  { post: "Workout HIIT", leads: 38, score: 7.8, conversions: 9, revenue: 1800 },
]

const recentLeads = [
  { id: 1, username: "@marie_fit92", comment: "Combien coûte ton programme ? Je veux commencer !", score: 10, category: "vip", time: "il y a 3 min", status: "dm_sent", post: "Transformation 30j" },
  { id: 2, username: "@lucas_sport", comment: "Comment tu structures tes séances ?", score: 8, category: "standard", time: "il y a 12 min", status: "dm_sent", post: "Workout HIIT" },
  { id: 3, username: "@sophie.wellness", comment: "Trop inspirant ! Tu proposes du coaching en ligne ?", score: 9, category: "vip", time: "il y a 25 min", status: "converted", post: "Avant/Après client" },
  { id: 4, username: "@alex_muscu", comment: "Super post 💪🔥", score: 4, category: "low", time: "il y a 38 min", status: "ignored", post: "Tips nutrition" },
  { id: 5, username: "@emma.health", comment: "J'aimerais bien avoir un programme comme ça", score: 7, category: "standard", time: "il y a 1h", status: "dm_sent", post: "Transformation 30j" },
  { id: 6, username: "@thomas_coach", comment: "Tu prends encore des clients ? Budget 200€/mois", score: 10, category: "vip", time: "il y a 1h", status: "converted", post: "Avant/Après client" },
  { id: 7, username: "@julie_yoga", comment: "Merci pour les tips !", score: 5, category: "low", time: "il y a 2h", status: "ignored", post: "Meal prep lundi" },
  { id: 8, username: "@nico.training", comment: "C'est quoi ton offre coaching perso ?", score: 9, category: "vip", time: "il y a 2h", status: "dm_sent", post: "Workout HIIT" },
]

const pieData = [
  { name: "VIP (9-10)", value: 28, color: ORANGE },
  { name: "Standard (7-8)", value: 42, color: BLUE },
  { name: "Low (1-6)", value: 30, color: "#444" },
]

const conversionFunnel = [
  { stage: "Commentaires", count: 150 },
  { stage: "Leads détectés", count: 95 },
  { stage: "DMs envoyés", count: 67 },
  { stage: "Réponses", count: 41 },
  { stage: "Convertis", count: 18 },
]

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
        .limit(20)
      
      setRealLeads(leadsData || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching leads:', error)
      setLoading(false)
    }
  }

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
    const dataToFilter = realLeads.length > 0 ? realLeads : recentLeads
    if (leadFilter === "all") return dataToFilter
    return dataToFilter.filter(l => {
      if (!l.ai_score) return leadFilter === "low"
      if (l.ai_score >= 9) return leadFilter === "vip"
      if (l.ai_score >= 7) return leadFilter === "standard"
      return leadFilter === "low"
    })
  }, [leadFilter, realLeads])

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: "📊" },
    { id: "leads", label: "Leads", icon: "👥" },
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
          <Link href="/dashboard/analytics" style={{ textDecoration: 'none' }}>
            <button style={{
              background: "rgba(255,92,0,0.1)",
              border: "1px solid rgba(255,92,0,0.2)",
              color: ORANGE,
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              📊 Analytics
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
              <StatCard label="Leads cette semaine" value="150" change="+23%" icon="👥" color={ORANGE} />
              <StatCard label="Score moyen" value="7.4" change="+0.8" icon="🎯" color={BLUE} />
              <StatCard label="DMs envoyés" value="67" change="+31%" icon="✉️" />
              <StatCard label="Conversions" value="18" change="+44%" icon="🏆" color={GREEN} />
              <StatCard label="Revenue estimé" value="3 200€" change="+38%" icon="💰" color={ORANGE} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 32 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Leads par jour</div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={weeklyLeads} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#555" fontSize={12} />
                    <YAxis stroke="#555" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="vip" name="VIP" fill={ORANGE} radius={[4,4,0,0]} />
                    <Bar dataKey="standard" name="Standard" fill={BLUE} radius={[4,4,0,0]} />
                    <Bar dataKey="low" name="Low" fill="#333" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Répartition des leads</div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {pieData.map((d, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color }}></span>
                        <span style={{ color: "#aaa" }}>{d.name}</span>
                      </div>
                      <span style={{ fontWeight: 700 }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 32 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Funnel de conversion</div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                {conversionFunnel.map((step, i) => {
                  const maxCount = conversionFunnel[0].count
                  const height = (step.count / maxCount) * 160
                  const rate = i > 0 ? ((step.count / conversionFunnel[i-1].count) * 100).toFixed(0) : 100
                  return (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      {i > 0 && <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginBottom: 6 }}>{rate}%</div>}
                      <div style={{ height, background: `linear-gradient(180deg, ${ORANGE}, ${ORANGE}15)`, borderRadius: "8px 8px 4px 4px", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8, minHeight: 40 }}>
                        <span style={{ fontWeight: 800, fontSize: 18 }}>{step.count}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 8, lineHeight: 1.3 }}>{step.stage}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Derniers leads</div>
                <button onClick={() => setActiveTab("leads")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: ORANGE, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Voir tout →</button>
              </div>
              {recentLeads.slice(0, 4).map(lead => (
                <div key={lead.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{lead.username}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.comment}</div>
                  </div>
                  <ScoreBadge score={lead.score} />
                  <StatusBadge status={lead.status} />
                  <span style={{ fontSize: 12, color: "#555", minWidth: 80, textAlign: "right" }}>{lead.time}</span>
                </div>
              ))}
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
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 100px 100px 100px 90px", padding: "14px 24px", fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span>Username</span><span>Commentaire</span><span>Score</span><span>Post</span><span>Status</span><span style={{ textAlign: "right" }}>Temps</span>
              </div>
              {filteredLeads.map(lead => (
                <div key={lead.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 100px 100px 100px 90px", padding: "16px 24px", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s", cursor: "pointer" }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{lead.username}</span>
                  <span style={{ fontSize: 13, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.comment}</span>
                  <ScoreBadge score={lead.score} />
                  <span style={{ fontSize: 12, color: "#666" }}>{lead.post.slice(0, 12)}...</span>
                  <StatusBadge status={lead.status} />
                  <span style={{ fontSize: 12, color: "#555", textAlign: "right" }}>{lead.time}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "content" && <ContentAnalyzerTab />}

        {activeTab === "revenue" && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 24 }}>Revenue & Croissance</h2>
            <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
              <StatCard label="Revenue ce mois" value="3 200€" change="+38%" icon="💰" color={ORANGE} />
              <StatCard label="Revenue moyen / lead" value="178€" change="+12%" icon="📈" color={GREEN} />
              <StatCard label="Coût par lead" value="0.47€" change="-15%" icon="⚡" color={BLUE} />
              <StatCard label="ROI" value="680%" change="+52%" icon="🚀" color={ORANGE} />
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 32 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Évolution du revenue</div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ORANGE} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={ORANGE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" stroke="#555" fontSize={12} />
                  <YAxis stroke="#555" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue (€)" stroke={ORANGE} fill="url(#revenueGrad)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Leads vs Revenue</div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" stroke="#555" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#555" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#555" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line yAxisId="left" type="monotone" dataKey="leads" name="Leads" stroke={BLUE} strokeWidth={2} dot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (€)" stroke={ORANGE} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  )
}
