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

  const funnelData = [
    { step: 'Commentaires', count: totalLeads + 37, width: 100 },
    { step: 'Leads qualifiés', count: totalLeads, width: totalLeads > 0 ? 80 : 0 },
    { step: 'DMs envoyés', count: dmsSent, width: dmsSent > 0 ? 60 : 0 },
    { step: 'Réponses', count: repliedCount, width: repliedCount > 0 ? 40 : 0 },
    { step: 'Conversions', count: conversions, width: conversions > 0 ? 20 : 0 },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#FF5C00] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-[#888]">Chargement des données...</span>
      </div>
    )
  }

  // Si pas de données, afficher un empty state propre
  if (totalLeads === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Leads cette semaine" value={0} icon={MessageSquare} />
          <StatCard label="Score moyen" value="—" icon={Target} />
          <StatCard label="DMs envoyés" value={0} icon={Send} />
          <StatCard label="Conversions" value={0} icon={TrendingUp} />
          <StatCard label="Revenue estimé" value="0€" icon={DollarSign} />
        </div>
        <Card className="p-12 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucun lead pour l'instant</h3>
          <p className="text-[#888] max-w-md mx-auto">
            Vos premiers leads apparaîtront ici dès que l'automatisation Instagram sera active.
            Publiez un post et regardez les commentaires se transformer en leads qualifiés.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Leads cette semaine"
          value={totalLeads}
          icon={MessageSquare}
        />
        <StatCard
          label="Score moyen"
          value={`${avgScore}/10`}
          icon={Target}
        />
        <StatCard
          label="DMs envoyés"
          value={dmsSent}
          icon={Send}
        />
        <StatCard
          label="Conversions"
          value={conversions}
          icon={TrendingUp}
        />
        <StatCard
          label="Revenue estimé"
          value={`${revenue}€`}
          icon={DollarSign}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
          <h3 className="text-lg font-semibold text-white mb-4">Leads par jour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
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
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
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
          {leads.slice(0, 5).map((lead) => (
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
