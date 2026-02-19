'use client'

import { useState, useMemo, useEffect } from "react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import InstagramOnboarding from './components/InstagramOnboarding'
import UserMenu from '@/components/UserMenu'
import NotificationCenter from '@/components/NotificationCenter'
import ExportButton from '@/components/ExportButton'
import Link from 'next/link'
import { ContentAnalyzerTab } from './components/tabs/ContentAnalyzerTab'
import { RevenueTab } from './components/tabs/RevenueTab'
import { AutoDMTab } from './components/tabs/AutoDMTab'
import { VideoAnalyzerTab } from './components/tabs/VideoAnalyzerTab'
import { CompetitorSpyTab } from './components/tabs/CompetitorSpyTab'
import { SmartCalendarTab } from './components/tabs/SmartCalendarTab'
import { StatCard } from '@/components/ui/stat-card'
import { MessageSquare, Target, Send, TrendingUp, DollarSign } from 'lucide-react'

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
    if (leadFilter === "all") return realLeads
    return realLeads.filter(l => {
      if (!l.ai_score) return leadFilter === "low"
      if (l.ai_score >= 9) return leadFilter === "vip"
      if (l.ai_score >= 7) return leadFilter === "standard"
      return leadFilter === "low"
    })
  }, [leadFilter, realLeads])

  // Calculate REAL stats from REAL data
  const totalLeads = realLeads.length
  const avgScore = totalLeads > 0 
    ? (realLeads.reduce((sum, lead) => sum + (lead.ai_score || 0), 0) / totalLeads).toFixed(1) 
    : '0'
  const dmsSent = realLeads.filter(l => l.status === 'dm_sent' || l.status === 'converted' || l.status === 'replied').length
  const conversions = realLeads.filter(l => l.status === 'converted').length
  const revenue = realLeads.reduce((sum, lead) => sum + (lead.revenue || 0), 0)

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: "📊", locked: false },
    { id: "leads", label: "Leads", icon: "👥", locked: false },
    { id: "autodm", label: "Auto-DM", icon: "🤖", locked: false, requiredPlan: "pro" },
    { id: "content", label: "Content AI", icon: "🎨", locked: false },
    { id: "video", label: "Video Analyzer", icon: "🎥", locked: false, requiredPlan: "pro" },
    { id: "competitor", label: "Competitor Spy", icon: "🔍", locked: true, requiredPlan: "elite" },
    { id: "calendar", label: "Smart Calendar", icon: "📅", locked: true, requiredPlan: "elite" },
    { id: "revenue", label: "Revenue", icon: "💰", locked: false },
  ]

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      
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
              <button 
                key={tab.id} 
                onClick={() => {
                  if (tab.locked) {
                    if (confirm(`🔒 Cette feature est réservée au plan ${tab.requiredPlan?.toUpperCase()}.\n\nRediriger vers la page pricing ?`)) {
                      window.location.href = '/pricing'
                    }
                  } else {
                    setActiveTab(tab.id)
                  }
                }}
                style={{ 
                  padding: "8px 16px", 
                  borderRadius: 8, 
                  border: "none", 
                  cursor: tab.locked ? "not-allowed" : "pointer", 
                  fontSize: 13, 
                  fontWeight: 600, 
                  background: activeTab === tab.id ? "rgba(255,92,0,0.15)" : "transparent", 
                  color: activeTab === tab.id ? ORANGE : tab.locked ? "#555" : "#888", 
                  transition: "all 0.2s", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 6,
                  opacity: tab.locked ? 0.5 : 1
                }}>
                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                {tab.label}
                {tab.locked && <span style={{ fontSize: 12 }}>🔒</span>}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {coach && !coach?.instagram_username ? (
            <button
              onClick={() => window.location.href = '/api/auth/instagram-oauth'}
              style={{
                background: "linear-gradient(135deg, #E1306C, #FD1D1D, #F77737)",
                border: "none",
                color: "white",
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 16px rgba(225, 48, 108, 0.3)",
                animation: "pulse 2s infinite"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Connecter Instagram
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,210,106,0.1)", border: "1px solid rgba(0,210,106,0.2)", padding: "8px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, color: GREEN }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @{coach?.instagram_username}
            </div>
          )}
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
          <NotificationCenter />
          <UserMenu />
        </div>
      </div>

      <div style={{ padding: "clamp(16px, 4vw, 32px)", maxWidth: "1400px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {activeTab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
              <StatCard label="Leads cette semaine" value={totalLeads} icon={MessageSquare} delay={0} />
              <StatCard label="Score moyen" value={`${avgScore}/10`} icon={Target} delay={0.1} />
              <StatCard label="DMs envoyés" value={dmsSent} icon={Send} delay={0.2} />
              <StatCard label="Conversions" value={conversions} icon={TrendingUp} delay={0.3} />
              <StatCard label="Revenue estimé" value={`${revenue}€`} icon={DollarSign} delay={0.4} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 32 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Leads par jour</div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={[]} barGap={2}>
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
                    <Pie data={[]} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {[].map((d: any, i: number) => (
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
                {[].map((step: any, i: number) => {
                  const maxCount = 1
                  const height = 0
                  const rate = 0
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
              {realLeads.slice(0, 4).map((lead: any) => (
                <div key={lead.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{lead.username}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.comment_text || lead.comment || '—'}</div>
                  </div>
                  <ScoreBadge score={lead.ai_score || 0} />
                  <StatusBadge status={lead.status} />
                  <span style={{ fontSize: 12, color: "#555", minWidth: 80, textAlign: "right" }}>{new Date(lead.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
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
                  <span style={{ fontSize: 13, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.comment_text || lead.comment || '—'}</span>
                  <ScoreBadge score={lead.ai_score || 0} />
                  <span style={{ fontSize: 12, color: "#666" }}>{lead.post_url?.slice(0, 12) || lead.post_id?.slice(0, 12) || '—'}...</span>
                  <StatusBadge status={lead.status} />
                  <span style={{ fontSize: 12, color: "#555", textAlign: "right" }}>{new Date(lead.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "autodm" && <AutoDMTab />}

        {activeTab === "content" && <ContentAnalyzerTab />}

        {activeTab === "video" && <VideoAnalyzerTab />}

        {activeTab === "competitor" && <CompetitorSpyTab />}

        {activeTab === "calendar" && <SmartCalendarTab />}

        {activeTab === "revenue" && <RevenueTab />}
      </div>
    </div>
    </>
  )
}
