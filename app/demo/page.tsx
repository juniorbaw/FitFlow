'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MessageSquare, Target, Send, TrendingUp, DollarSign, ArrowLeft, Sparkles } from 'lucide-react'

const ORANGE = '#FF5C00'
const GREEN = '#00D26A'
const BLUE = '#3B82F6'

// Données de démonstration réalistes
const demoData = {
  stats: {
    leads: 47,
    avgScore: 7.8,
    dmsSent: 28,
    conversions: 12,
    revenue: 2840
  },
  dailyChart: [
    { day: 'Lun', vip: 8, standard: 12, low: 5 },
    { day: 'Mar', vip: 5, standard: 15, low: 8 },
    { day: 'Mer', vip: 12, standard: 10, low: 3 },
    { day: 'Jeu', vip: 9, standard: 14, low: 6 },
    { day: 'Ven', vip: 15, standard: 18, low: 4 },
    { day: 'Sam', vip: 11, standard: 13, low: 7 },
    { day: 'Dim', vip: 7, standard: 11, low: 9 },
  ],
  pieData: [
    { name: 'VIP (9-10)', value: 35, color: ORANGE },
    { name: 'Standard (7-8)', value: 45, color: BLUE },
    { name: 'Low (<7)', value: 20, color: '#666' },
  ],
  recentLeads: [
    { id: 1, username: '@marie_fit92', comment: 'Trop motivant ce post ! 💪', score: 9.2, status: 'converted' },
    { id: 2, username: '@thomas_coach', comment: 'Comment tu fais pour rester aussi régulier ?', score: 8.5, status: 'dm_sent' },
    { id: 3, username: '@julie.transform', comment: 'J\'ai besoin de conseils nutrition 🙏', score: 9.8, status: 'converted' },
    { id: 4, username: '@fit_sarah', comment: 'Incroyable transformation !', score: 7.3, status: 'replied' },
  ]
}

function StatCard({ label, value, icon: Icon, color = 'white' }: any) {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 hover:bg-[rgba(255,255,255,0.06)] transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400 font-medium">{label}</span>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="text-3xl font-bold" style={{ color }}>{value}</div>
    </div>
  )
}

function ScoreBadge({ score }: any) {
  const isVIP = score >= 9
  const isStandard = score >= 7 && score < 9
  const bg = isVIP ? 'rgba(255,92,0,0.15)' : isStandard ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.08)'
  const color = isVIP ? ORANGE : isStandard ? BLUE : '#666'
  const label = isVIP ? 'VIP' : isStandard ? 'Standard' : 'Low'
  
  return (
    <div className="flex items-center gap-2">
      <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: bg, color }}>{label}</span>
      <span className="text-sm font-bold" style={{ color }}>{score}/10</span>
    </div>
  )
}

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['DM_Sans']">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <button className="p-2 rounded-lg border border-[rgba(255,255,255,0.1)] hover:border-[#FF5C00] transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="text-2xl font-bold">
                Fit<span style={{ color: ORANGE }}>Flow</span>
              </span>
            </Link>
            <div className="px-4 py-2 rounded-lg bg-[rgba(255,92,0,0.1)] border border-[rgba(255,92,0,0.2)]">
              <span className="text-[#FF5C00] font-semibold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Mode Aperçu
              </span>
            </div>
          </div>
          <Link href="/signup">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[rgba(255,92,0,0.3)]">
              Démarrer gratuitement
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-[rgba(255,255,255,0.04)] rounded-xl inline-flex">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
            { id: 'leads', label: 'Leads', icon: '👥' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[rgba(255,92,0,0.15)] text-[#FF5C00]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Leads cette semaine" value={demoData.stats.leads} icon={MessageSquare} color={ORANGE} />
          <StatCard label="Score moyen" value={`${demoData.stats.avgScore}/10`} icon={Target} color={BLUE} />
          <StatCard label="DMs envoyés" value={demoData.stats.dmsSent} icon={Send} color="white" />
          <StatCard label="Conversions" value={demoData.stats.conversions} icon={TrendingUp} color={GREEN} />
          <StatCard label="Revenue estimé" value={`${demoData.stats.revenue}€`} icon={DollarSign} color={ORANGE} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6">Leads par jour</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={demoData.dailyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="vip" fill={ORANGE} radius={[4, 4, 0, 0]} />
                <Bar dataKey="standard" fill={BLUE} radius={[4, 4, 0, 0]} />
                <Bar dataKey="low" fill="#333" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6">Répartition</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={demoData.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {demoData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {demoData.pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ background: d.color }}></div>
                    <span className="text-gray-400">{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Derniers leads</h3>
            <span className="text-sm text-gray-400">Données de démonstration</span>
          </div>
          <div className="space-y-4">
            {demoData.recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                <div className="flex-1">
                  <div className="font-bold text-white mb-1">{lead.username}</div>
                  <div className="text-sm text-gray-400">{lead.comment}</div>
                </div>
                <div className="flex items-center gap-4">
                  <ScoreBadge score={lead.score} />
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lead.status === 'converted' ? 'bg-[rgba(0,210,106,0.15)] text-[#00D26A]' :
                    lead.status === 'dm_sent' ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]' :
                    'bg-[rgba(255,184,0,0.15)] text-[#FFB800]'
                  }`}>
                    {lead.status === 'converted' ? 'Converti ✓' : lead.status === 'dm_sent' ? 'DM envoyé' : 'Répondu'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="mt-12 text-center">
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-[rgba(255,92,0,0.1)] to-[rgba(255,138,61,0.05)] border border-[rgba(255,92,0,0.2)]">
            <h2 className="text-3xl font-bold mb-3">Prêt à automatiser vos leads ?</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Transformez vos commentaires Instagram en clients payants avec l'IA
            </p>
            <Link href="/signup">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-[rgba(255,92,0,0.3)]">
                Commencer maintenant - Gratuit
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
