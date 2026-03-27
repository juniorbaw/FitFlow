'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"
const BLUE = "#3B82F6"
const YELLOW = "#FFB800"
const RED = "#FF4D4D"
const PURPLE = "#8B5CF6"

const ADMIN_EMAILS = [
  'soujunior94@gmail.com',
  'souleyman.ndiaye13@icloud.com',
  'admin@fitflow.com',
]

type Coach = {
  id: string
  name: string | null
  email: string | null
  plan: string
  created_at: string
  instagram_connected?: boolean
  total_leads?: number
}

type Lead = {
  id: string
  username: string
  ai_score: number
  status: string
  created_at: string
  coach_id: string
}

type Stats = {
  totalCoaches: number
  totalLeads: number
  totalDMs: number
  totalConversions: number
  avgScore: number
  revenue: number
}

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'coaches' | 'leads' | 'revenue'>('overview')
  const [stats, setStats] = useState<Stats>({ totalCoaches: 0, totalLeads: 0, totalDMs: 0, totalConversions: 0, avgScore: 0, revenue: 0 })
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const supabase = createClient()

  useEffect(() => { checkAdminAccess() }, [])

  async function checkAdminAccess() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      if (!ADMIN_EMAILS.includes(user.email || '')) { router.push('/dashboard'); return }
      setIsAdmin(true)
      await loadData()
    } catch { router.push('/login') }
    finally { setLoading(false) }
  }

  async function loadData() {
    try {
      const [coachesRes, leadsRes, dmsRes] = await Promise.all([
        supabase.from('coaches').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'dm_sent'),
      ])

      const coachesData = coachesRes.data || []
      const leadsData = leadsRes.data || []
      const conversions = leadsData.filter(l => l.status === 'converted').length
      const avgScore = leadsData.length > 0 ? leadsData.reduce((s, l) => s + (l.ai_score || 0), 0) / leadsData.length : 0

      setCoaches(coachesData)
      setLeads(leadsData)
      setStats({
        totalCoaches: coachesData.length,
        totalLeads: leadsData.length,
        totalDMs: dmsRes.count || 0,
        totalConversions: conversions,
        avgScore: Math.round(avgScore * 10) / 10,
        revenue: conversions * 297,
      })
    } catch (e) { console.error(e) }
  }

  const planColor = (plan: string) => {
    if (plan === 'elite') return { color: YELLOW, bg: 'rgba(255,184,0,0.1)' }
    if (plan === 'pro') return { color: ORANGE, bg: 'rgba(255,92,0,0.1)' }
    return { color: BLUE, bg: 'rgba(59,130,246,0.1)' }
  }

  const scoreColor = (score: number) => score >= 9 ? ORANGE : score >= 7 ? BLUE : '#555'

  const statusStyle = (status: string) => {
    const map: any = {
      converted: { label: 'Converti ✓', color: GREEN, bg: 'rgba(0,210,106,0.1)' },
      dm_sent: { label: 'DM envoyé', color: BLUE, bg: 'rgba(59,130,246,0.1)' },
      pending: { label: 'En attente', color: YELLOW, bg: 'rgba(255,184,0,0.1)' },
      ignored: { label: 'Ignoré', color: '#555', bg: 'rgba(255,255,255,0.04)' },
    }
    return map[status] || map.pending
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: `3px solid ${ORANGE}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#666', fontSize: 14 }}>Vérification des accès...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  if (!isAdmin) return null

  const statCards = [
    { label: 'Coachs inscrits', value: stats.totalCoaches, icon: '👥', color: PURPLE },
    { label: 'Leads totaux', value: stats.totalLeads, icon: '🎯', color: ORANGE },
    { label: 'DMs envoyés', value: stats.totalDMs, icon: '✉️', color: BLUE },
    { label: 'Conversions', value: stats.totalConversions, icon: '🏆', color: GREEN },
    { label: 'Score moyen', value: `${stats.avgScore}/10`, icon: '⭐', color: YELLOW },
    { label: 'Revenue estimé', value: `${stats.revenue.toLocaleString()}€`, icon: '💰', color: ORANGE },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: '#fafafa', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* NAV */}
      <div style={{ padding: '0 32px', height: 60, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 800, fontSize: 20 }}>Fit<span style={{ color: ORANGE }}>Flow</span></span>
          <span style={{ color: '#444' }}>›</span>
          <span style={{ fontSize: 14, color: PURPLE, fontWeight: 700, background: 'rgba(139,92,246,0.1)', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(139,92,246,0.2)' }}>🔐 Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#aaa', padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >← Dashboard</button>
          <button
            onClick={() => loadData()}
            style={{ background: `rgba(255,92,0,0.08)`, border: `1px solid rgba(255,92,0,0.2)`, color: ORANGE, padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >🔄 Rafraîchir</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>
            Panel Admin <span style={{ color: PURPLE }}>FitFlow</span>
          </h1>
          <p style={{ fontSize: 14, color: '#666' }}>Vue d'ensemble complète de la plateforme · Accès restreint</p>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content' }}>
          {[
            { id: 'overview', label: '📊 Vue d\'ensemble' },
            { id: 'coaches', label: `👥 Coachs (${stats.totalCoaches})` },
            { id: 'leads', label: `🎯 Leads (${stats.totalLeads})` },
            { id: 'revenue', label: '💰 Revenue' },
          ].map(tab => (
            <span key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: activeTab === tab.id ? 'rgba(139,92,246,0.15)' : 'transparent',
                color: activeTab === tab.id ? PURPLE : '#666',
                transition: 'all 0.15s'
              }}
            >{tab.label}</span>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginBottom: 28 }}>
              {statCards.map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</span>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Recent coaches + recent leads */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Recent coaches */}
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Derniers coachs inscrits</div>
                {coaches.slice(0, 5).map((coach, i) => {
                  const pc = planColor(coach.plan)
                  return (
                    <div key={coach.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(139,92,246,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: PURPLE, fontSize: 14 }}>
                          {(coach.name || coach.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{coach.name || 'Sans nom'}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>{coach.email}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: pc.color, background: pc.bg, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{coach.plan}</span>
                    </div>
                  )
                })}
                {coaches.length === 0 && <p style={{ fontSize: 14, color: '#555', textAlign: 'center', padding: '20px 0' }}>Aucun coach inscrit</p>}
              </div>

              {/* Recent leads */}
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Derniers leads détectés</div>
                {leads.slice(0, 5).map((lead, i) => {
                  const st = statusStyle(lead.status)
                  return (
                    <div key={lead.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{lead.username}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{new Date(lead.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor(lead.ai_score) }}>{lead.ai_score}/10</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: '3px 10px', borderRadius: 20 }}>{st.label}</span>
                      </div>
                    </div>
                  )
                })}
                {leads.length === 0 && <p style={{ fontSize: 14, color: '#555', textAlign: 'center', padding: '20px 0' }}>Aucun lead détecté</p>}
              </div>
            </div>
          </>
        )}

        {/* COACHES TAB */}
        {activeTab === 'coaches' && (
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '14px 24px', fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 1, background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span>Nom</span><span>Email</span><span>Plan</span><span>Inscrit le</span><span style={{ textAlign: 'right' }}>Instagram</span>
            </div>
            {coaches.map((coach, i) => {
              const pc = planColor(coach.plan)
              return (
                <div key={coach.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '16px 24px', alignItems: 'center', borderBottom: i < coaches.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.008)' : 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: PURPLE, fontSize: 13 }}>
                      {(coach.name || coach.email || '?')[0].toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{coach.name || 'Sans nom'}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#888' }}>{coach.email}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: pc.color, background: pc.bg, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase', width: 'fit-content' }}>{coach.plan}</span>
                  <span style={{ fontSize: 12, color: '#666' }}>{new Date(coach.created_at).toLocaleDateString('fr-FR')}</span>
                  <span style={{ textAlign: 'right', fontSize: 12, color: coach.instagram_connected ? GREEN : '#555', fontWeight: 600 }}>
                    {coach.instagram_connected ? '✓ Connecté' : '✗ Non connecté'}
                  </span>
                </div>
              )
            })}
            {coaches.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#555' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
                <p>Aucun coach inscrit pour le moment</p>
              </div>
            )}
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 24px', fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: 1, background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span>Username</span><span>Score IA</span><span>Statut</span><span style={{ textAlign: 'right' }}>Date</span>
            </div>
            {leads.map((lead, i) => {
              const st = statusStyle(lead.status)
              return (
                <div key={lead.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 24px', alignItems: 'center', borderBottom: i < leads.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.008)' : 'transparent' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{lead.username}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: scoreColor(lead.ai_score) }}>{lead.ai_score}/10</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: '4px 12px', borderRadius: 20, width: 'fit-content' }}>{st.label}</span>
                  <span style={{ fontSize: 12, color: '#666', textAlign: 'right' }}>{new Date(lead.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )
            })}
            {leads.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#555' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                <p>Aucun lead détecté pour le moment</p>
              </div>
            )}
          </div>
        )}

        {/* REVENUE TAB */}
        {activeTab === 'revenue' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { label: 'Revenue estimé total', value: `${stats.revenue.toLocaleString()}€`, desc: `Basé sur ${stats.totalConversions} conversions × 297€`, color: ORANGE, icon: '💰' },
              { label: 'Taux de conversion', value: stats.totalLeads > 0 ? `${Math.round((stats.totalConversions / stats.totalLeads) * 100)}%` : '0%', desc: `${stats.totalConversions} conversions / ${stats.totalLeads} leads`, color: GREEN, icon: '📈' },
              { label: 'Revenue / Coach', value: stats.totalCoaches > 0 ? `${Math.round(stats.revenue / stats.totalCoaches).toLocaleString()}€` : '0€', desc: `Moyenne sur ${stats.totalCoaches} coachs actifs`, color: BLUE, icon: '👥' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 32 }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: s.color, letterSpacing: -1, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#555' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
