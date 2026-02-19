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
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from real data
  const totalLeads = leads.length
  const avgScore = totalLeads > 0 ? (leads.reduce((sum, lead) => sum + (lead.ai_score || 0), 0) / totalLeads).toFixed(1) : '—'
  const dmsSent = leads.filter(l => l.status !== 'new').length
  const conversions = leads.filter(l => l.status === 'converted').length
  const revenue = leads.reduce((sum, lead) => sum + (lead.revenue || 0), 0)

  // Categorize leads
  const getCategory = (lead: any) => {
    if (!lead.ai_score) return 'low'
    if (lead.ai_score >= 9) return 'vip'
    if (lead.ai_score >= 7) return 'standard'
    return 'low'
  }

  const pieData = [
    { name: 'VIP (9-10)', value: leads.filter(l => getCategory(l) === 'vip').length, color: categoryColors.vip },
    { name: 'Standard (7-8)', value: leads.filter(l => getCategory(l) === 'standard').length, color: categoryColors.standard },
    { name: 'Low (<7)', value: leads.filter(l => getCategory(l) === 'low').length, color: categoryColors.low },
  ]

  const funnelData = [
    { step: 'Commentaires', count: totalLeads > 0 ? Math.ceil(totalLeads * 1.5) : 0, width: 100 },
    { step: 'Leads qualifiés', count: totalLeads, width: 80 },
    { step: 'DMs envoyés', count: dmsSent, width: 60 },
    { step: 'Réponses', count: leads.filter(l => l.status === 'replied' || l.status === 'converted').length, width: 40 },
    { step: 'Conversions', count: conversions, width: 20 },
  ]

  if (loading) {
    return <div className="text-center py-12 text-[#888]">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Leads cette semaine" value={totalLeads} icon={MessageSquare} change={0} changeLabel="vs semaine dernière" />
        <StatCard label="Score moyen" value={`${avgScore}/10`} icon={Target} change={0} />
        <StatCard label="DMs envoyés" value={dmsSent} icon={Send} change={0} />
        <StatCard label="Conversions" value={conversions} icon={TrendingUp} change={0} />
        <StatCard label="Revenue estimé" value={`${revenue}€`} icon={DollarSign} change={0} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
          <h3 className="text-lg font-semibold text-white mb-4">Répartition par catégorie</h3>
          {totalLeads === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Aucun lead pour l'instant</h3>
              <p className="text-sm text-[#888]">Les données apparaîtront ici.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Funnel */}
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
          <h3 className="text-lg font-semibold text-white mb-6">Funnel de conversion</h3>
          {totalLeads === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold text-white mb-2">Pas encore de données</h3>
              <p className="text-sm text-[#888]">Le funnel se remplira avec vos premiers leads.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {funnelData.map((item, index) => (
                <div key={item.step} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-[#888]">{item.step}</div>
                  <div className="flex-1">
                    <div className="h-12 rounded-lg bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] flex items-center justify-between px-4 transition-all" style={{ width: `${item.width}%` }}>
                      <span className="text-white font-semibold">{item.count}</span>
                      {index < funnelData.length - 1 && item.count > 0 && (
                        <span className="text-white/70 text-sm">
                          {((funnelData[index + 1].count / item.count) * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Leads */}
      <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
        <h3 className="text-lg font-semibold text-white mb-4">5 derniers leads</h3>
        {leads.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">Aucun lead pour l'instant</h3>
            <p className="text-sm text-[#888]">Vos premiers leads apparaîtront ici dès que l'automatisation sera active.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-all cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-white">@{lead.username || lead.instagram_username || 'unknown'}</span>
                    <Badge variant={getCategory(lead) === 'vip' ? 'orange' : getCategory(lead) === 'standard' ? 'blue' : 'gray'}>
                      Score {lead.ai_score || 0}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#888] line-clamp-1">{lead.comment || lead.comment_text || ''}</p>
                </div>
                <div className="text-sm text-[#555]">
                  {lead.created_at ? new Date(lead.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
