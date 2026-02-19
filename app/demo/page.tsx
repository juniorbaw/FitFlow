'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Target, Send, TrendingUp, DollarSign, ArrowRight } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Link from 'next/link'

const ORANGE = '#FF5C00'

export default function DemoPage() {
  const demoData = {
    dailyData: [
      { date: 'Lun', VIP: 5, Standard: 8, Low: 12 },
      { date: 'Mar', VIP: 7, Standard: 10, Low: 15 },
      { date: 'Mer', VIP: 6, Standard: 12, Low: 10 },
      { date: 'Jeu', VIP: 9, Standard: 11, Low: 13 },
      { date: 'Ven', VIP: 11, Standard: 14, Low: 8 },
      { date: 'Sam', VIP: 8, Standard: 9, Low: 11 },
      { date: 'Dim', VIP: 10, Standard: 13, Low: 9 },
    ],
    pieData: [
      { name: 'VIP (9-10)', value: 35, color: ORANGE },
      { name: 'Standard (7-8)', value: 45, color: '#3B82F6' },
      { name: 'Low (<7)', value: 20, color: '#888' },
    ],
    leads: [
      { id: 1, username: '@marie_fitness', comment: 'Comment tu fais pour avoir ces résultats ? 🔥', score: 9.2, status: 'dm_sent' },
      { id: 2, username: '@thomas_coach', comment: 'Intéressé par ton programme !', score: 8.7, status: 'converted' },
      { id: 3, username: '@julie.sport', comment: 'Incroyable transformation 💪', score: 7.5, status: 'replied' },
      { id: 4, username: '@alex_training', comment: 'Combien de temps pour ces résultats ?', score: 8.9, status: 'dm_sent' },
      { id: 5, username: '@sophie_fit', comment: 'Tu proposes du coaching ?', score: 9.5, status: 'converted' },
    ]
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fafafa', padding: 32 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        
        <div style={{ background: 'linear-gradient(135deg, rgba(255,92,0,0.2), rgba(59,130,246,0.2))', padding: 16, borderRadius: 12, marginBottom: 32, textAlign: 'center', border: '1px solid rgba(255,92,0,0.3)' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>🎯 Mode Aperçu - Données de démonstration</span>
        </div>

        <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 12, textAlign: 'center' }}>Dashboard FitFlow</h1>
        <p style={{ fontSize: 18, color: '#888', textAlign: 'center', marginBottom: 48 }}>Découvrez comment vos leads Instagram se transforment en clients</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}
        >
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <MessageSquare size={20} color={ORANGE} />
              <span style={{ fontSize: 13, color: '#888' }}>Leads cette semaine</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>47</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Target size={20} color="#3B82F6" />
              <span style={{ fontSize: 13, color: '#888' }}>Score moyen</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>8.4/10</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Send size={20} color="#00D26A" />
              <span style={{ fontSize: 13, color: '#888' }}>DMs envoyés</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>28</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <TrendingUp size={20} color={ORANGE} />
              <span style={{ fontSize: 13, color: '#888' }}>Conversions</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>12</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <DollarSign size={20} color="#00D26A" />
              <span style={{ fontSize: 13, color: '#888' }}>Revenue estimé</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>2 840€</div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Leads par jour</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={demoData.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Legend />
                <Bar dataKey="VIP" fill={ORANGE} />
                <Bar dataKey="Standard" fill="#3B82F6" />
                <Bar dataKey="Low" fill="#888" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Répartition par catégorie</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={demoData.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label>
                  {demoData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 48 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>5 derniers leads</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {demoData.leads.map(lead => (
              <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{lead.username}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{lead.comment}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: lead.score >= 9 ? 'rgba(255,92,0,0.2)' : lead.score >= 7 ? 'rgba(59,130,246,0.2)' : 'rgba(136,136,136,0.2)', color: lead.score >= 9 ? ORANGE : lead.score >= 7 ? '#3B82F6' : '#888', padding: '6px 12px', borderRadius: 6, fontWeight: 700, fontSize: 14 }}>
                    {lead.score}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', minWidth: 100 }}>
                    {lead.status === 'converted' ? '✅ Converti' : lead.status === 'dm_sent' ? '📤 DM envoyé' : '💬 Répondu'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, color: 'white', padding: '16px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: `0 8px 24px ${ORANGE}40` }}>
            Créer mon compte gratuitement <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
