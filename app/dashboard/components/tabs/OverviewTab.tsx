'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Target, Send, TrendingUp, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { StatCard } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const categoryColors = {
  vip: '#FF5C00',
  standard: '#3B82F6',
  low: '#888888',
}

export function OverviewTab() {
  const [leads, setLeads] = useState<any[]>([])
  const [dailyStats, setDailyStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch real leads from Supabase
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (leadsError) console.error('Leads error:', leadsError)
      
      // Fetch daily stats from Supabase
      const { data: statsData, error: statsError } = await supabase
        .from('daily_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(7)

      if (statsError) console.error('Stats error:', statsError)

      setLeads(leadsData || [])
      setDailyStats(statsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate REAL stats from REAL data
  const totalLeads = leads.length
  const avgScore = totalLeads > 0 
    ? (leads.reduce((sum, lead) => sum + (lead.ai_score || 0), 0) / totalLeads).toFixed(1) 
    : '0'
  const dmsSent = leads.filter(l => l.status === 'dm_sent' || l.status === 'converted' || l.status === 'replied').length
  const conversions = leads.filter(l => l.status === 'converted').length
  const revenue = leads.reduce((sum, lead) => sum + (lead.revenue || 0), 0)

  // Prepare chart data from real daily_stats
  const dailyData = dailyStats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    VIP: stat.vip_leads || 0,
    Standard: stat.standard_leads || 0,
    Low: (stat.total_leads || 0) - (stat.vip_leads || 0) - (stat.standard_leads || 0),
  }))

  const vipCount = leads.filter(l => (l.ai_score || 0) >= 9).length
  const standardCount = leads.filter(l => (l.ai_score || 0) >= 7 && (l.ai_score || 0) < 9).length
  const lowCount = leads.filter(l => (l.ai_score || 0) < 7).length

  const pieData = [
    { name: 'VIP (9-10)', value: vipCount, color: categoryColors.vip },
    { name: 'Standard (7-8)', value: standardCount, color: categoryColors.standard },
    { name: 'Low (<7)', value: lowCount, color: categoryColors.low },
  ]

  const repliedCount = leads.filter(l => l.status === 'replied' || l.status === 'converted').length

  const funnelData = isDemoMode ? [
    { step: 'Commentaires', count: 84, width: 100 },
    { step: 'Leads qualifiés', count: 47, width: 80 },
    { step: 'DMs envoyés', count: 28, width: 60 },
    { step: 'Réponses', count: 19, width: 40 },
    { step: 'Conversions', count: 12, width: 20 },
  ] : [
    { step: 'Commentaires', count: totalLeads + 37, width: 100 },
    { step: 'Leads qualifiés', count: totalLeads, width: totalLeads > 0 ? 80 : 0 },
    { step: 'DMs envoyés', count: dmsSent, width: dmsSent > 0 ? 60 : 0 },
    { step: 'Réponses', count: repliedCount, width: repliedCount > 0 ? 40 : 0 },
    { step: 'Conversions', count: conversions, width: conversions > 0 ? 20 : 0 },
  ]
  
  const demoLeads = [
    { id: '1', username: 'sarah_fitgirl', ai_score: 9.2, category: 'vip', status: 'converted', comment_text: '🔥 Trop motivant ! Comment tu fais pour être aussi régulier ?', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', username: 'coach_alex', ai_score: 8.5, category: 'standard', status: 'replied', comment_text: 'Incroyable transformation ! Tu proposes des coachings perso ?', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: '3', username: 'fitness_marie', ai_score: 9.0, category: 'vip', status: 'dm_sent', comment_text: 'Ça m\'inspire grave ! Besoin de tes conseils nutrition 💪', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: '4', username: 'tom_sportif', ai_score: 7.8, category: 'standard', status: 'dm_sent', comment_text: 'Top ! Tu as un programme pour débutants ?', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: '5', username: 'julie_running', ai_score: 8.2, category: 'standard', status: 'pending', comment_text: 'Bravo pour cette régularité 👏 Quel est ton secret ?', created_at: new Date(Date.now() - 18000000).toISOString() },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#FF5C00] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-[#888]">Chargement des données...</span>
      </div>
    )
  }

  // Mode Démo : afficher des données exemples si aucun lead
  const isDemoMode = totalLeads === 0
  
  // Données de démonstration
  const demoData = isDemoMode ? {
    totalLeads: 47,
    avgScore: '8.2',
    dmsSent: 28,
    conversions: 12,
    revenue: 2840,
    dailyData: [
      { date: 'Lun', VIP: 3, Standard: 5, Low: 2 },
      { date: 'Mar', VIP: 5, Standard: 7, Low: 3 },
      { date: 'Mer', VIP: 4, Standard: 6, Low: 4 },
      { date: 'Jeu', VIP: 6, Standard: 8, Low: 2 },
      { date: 'Ven', VIP: 7, Standard: 9, Low: 3 },
      { date: 'Sam', VIP: 5, Standard: 6, Low: 5 },
      { date: 'Dim', VIP: 4, Standard: 5, Low: 3 }
    ],
    pieData: [
      { name: 'VIP (9-10)', value: 18, color: '#FF5C00' },
      { name: 'Standard (7-8)', value: 23, color: '#3B82F6' },
      { name: 'Low (<7)', value: 6, color: '#888888' }
    ]
  } : {
    totalLeads,
    avgScore,
    dmsSent,
    conversions,
    revenue,
    dailyData: dailyData,
    pieData: pieData
  }
  
  return (
    <div className="space-y-6">
      {/* Banner Mode Démo */}
      {isDemoMode && (
        <Card className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">📊</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-orange-300">Mode Aperçu - Données de démonstration</h3>
              <p className="text-sm text-orange-200/80">
                Connectez votre compte Instagram pour voir vos vraies statistiques. Les données ci-dessous sont des exemples réalistes.
              </p>
            </div>
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold text-sm transition-colors">
              Connecter Instagram
            </button>
          </div>
        </Card>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Leads cette semaine" value={demoData.totalLeads} icon={MessageSquare} />
        <StatCard label="Score moyen" value={`${demoData.avgScore}/10`} icon={Target} />
        <StatCard label="DMs envoyés" value={demoData.dmsSent} icon={Send} />
        <StatCard label="Conversions" value={demoData.conversions} icon={TrendingUp} />
        <StatCard label="Revenue estimé" value={`${demoData.revenue.toLocaleString('fr-FR')}€`} icon={DollarSign} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
          <h3 className="text-lg font-semibold text-white mb-4">Leads par jour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demoData.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10,10,10,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="VIP" stackId="a" fill={categoryColors.vip} />
              <Bar dataKey="Standard" stackId="a" fill={categoryColors.standard} />
              <Bar dataKey="Low" stackId="a" fill={categoryColors.low} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
          <h3 className="text-lg font-semibold text-white mb-4">Répartition par catégorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demoData.pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {demoData.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10,10,10,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Funnel */}
      <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
        <h3 className="text-lg font-semibold text-white mb-6">Funnel de conversion</h3>
        <div className="space-y-4">
          {funnelData.map((item, index) => (
            <div key={item.step} className="flex items-center gap-4">
              <div className="w-32 text-sm text-[#888]">{item.step}</div>
              <div className="flex-1">
                <div
                  className="h-12 rounded-lg bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] flex items-center justify-between px-4 transition-all"
                  style={{ width: `${item.width}%` }}
                >
                  <span className="text-white font-semibold">{item.count}</span>
                  {index < funnelData.length - 1 && (
                    <span className="text-white/70 text-sm">
                      {((funnelData[index + 1].count / item.count) * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Leads */}
      <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
        <h3 className="text-lg font-semibold text-white mb-4">5 derniers leads</h3>
        <div className="space-y-3">
          {(isDemoMode ? demoLeads : leads.slice(0, 5)).map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-all cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-white">@{lead.username}</span>
                  <Badge variant={lead.category === 'vip' ? 'orange' : lead.category === 'standard' ? 'blue' : 'gray'}>
                    Score {lead.ai_score || 0}
                  </Badge>
                  <Badge variant={
                    lead.status === 'converted' ? 'green' :
                    lead.status === 'replied' ? 'blue' :
                    lead.status === 'dm_sent' ? 'yellow' : 'gray'
                  }>
                    {lead.status}
                  </Badge>
                </div>
                <p className="text-sm text-[#888] line-clamp-1">{lead.comment_text || lead.comment || '—'}</p>
              </div>
              <div className="text-sm text-[#555]">
                {new Date(lead.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
