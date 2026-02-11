'use client'

import { MessageSquare, Target, Send, TrendingUp, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { StatCard } from '@/components/ui/stat-card'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { mockLeads, mockDailyStats } from '@/lib/mock-data'

const categoryColors = {
  vip: '#FF5C00',
  standard: '#3B82F6',
  low: '#888888',
}

export function OverviewTab() {
  // Calculate stats from mock data
  const totalLeads = mockLeads.length
  const avgScore = (mockLeads.reduce((sum, lead) => sum + lead.ai_score, 0) / totalLeads).toFixed(1)
  const dmsSent = mockLeads.filter(l => l.status !== 'new').length
  const conversions = mockLeads.filter(l => l.status === 'converted').length
  const revenue = mockLeads.reduce((sum, lead) => sum + (lead.revenue || 0), 0)

  // Prepare chart data
  const dailyData = mockDailyStats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    VIP: stat.vip_leads,
    Standard: stat.standard_leads,
    Low: stat.total_leads - stat.vip_leads - stat.standard_leads,
  }))

  const pieData = [
    { name: 'VIP (9-10)', value: mockLeads.filter(l => l.category === 'vip').length, color: categoryColors.vip },
    { name: 'Standard (7-8)', value: mockLeads.filter(l => l.category === 'standard').length, color: categoryColors.standard },
    { name: 'Low (<7)', value: mockLeads.filter(l => l.category === 'low').length, color: categoryColors.low },
  ]

  const funnelData = [
    { step: 'Commentaires', count: 187, width: 100 },
    { step: 'Leads qualifiés', count: totalLeads, width: 80 },
    { step: 'DMs envoyés', count: dmsSent, width: 60 },
    { step: 'Réponses', count: mockLeads.filter(l => l.status === 'replied' || l.status === 'converted').length, width: 40 },
    { step: 'Conversions', count: conversions, width: 20 },
  ]

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Leads cette semaine"
          value={totalLeads}
          icon={MessageSquare}
          change={12}
          changeLabel="vs semaine dernière"
        />
        <StatCard
          label="Score moyen"
          value={`${avgScore}/10`}
          icon={Target}
          change={0.4}
        />
        <StatCard
          label="DMs envoyés"
          value={dmsSent}
          icon={Send}
          change={8}
        />
        <StatCard
          label="Conversions"
          value={conversions}
          icon={TrendingUp}
          change={15}
        />
        <StatCard
          label="Revenue estimé"
          value={`${revenue}€`}
          icon={DollarSign}
          change={25}
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
          {mockLeads.slice(0, 5).map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-all cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-white">@{lead.username}</span>
                  <Badge variant={lead.category === 'vip' ? 'orange' : lead.category === 'standard' ? 'blue' : 'gray'}>
                    Score {lead.ai_score}
                  </Badge>
                  <Badge variant={
                    lead.status === 'converted' ? 'green' :
                    lead.status === 'replied' ? 'blue' :
                    lead.status === 'dm_sent' ? 'yellow' : 'gray'
                  }>
                    {lead.status}
                  </Badge>
                </div>
                <p className="text-sm text-[#888] line-clamp-1">{lead.comment}</p>
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
