'use client'

import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { mockDailyStats, mockLeads } from '@/lib/mock-data'

export function RevenueTab() {
  // Calculate revenue metrics
  const totalRevenue = mockLeads.reduce((sum, lead) => sum + (lead.revenue || 0), 0)
  const conversions = mockLeads.filter(l => l.status === 'converted').length
  const revenuePerLead = conversions > 0 ? (totalRevenue / conversions).toFixed(0) : 0
  const costPerLead = 15 // Example cost
  const roi = ((totalRevenue - (costPerLead * mockLeads.length)) / (costPerLead * mockLeads.length) * 100).toFixed(0)

  // Prepare data for 6 weeks
  const weeklyData = Array.from({ length: 6 }, (_, i) => {
    const weekRevenue = Math.floor(Math.random() * 3000) + 1000
    return {
      week: `S${i + 1}`,
      revenue: weekRevenue,
    }
  })

  // Dual axis data (leads vs revenue)
  const dualAxisData = mockDailyStats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    leads: stat.total_leads,
    revenue: stat.revenue,
  }))

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue ce mois"
          value={`${totalRevenue}€`}
          icon={DollarSign}
          change={25}
          changeLabel="vs mois dernier"
        />
        <StatCard
          label="Revenue / lead"
          value={`${revenuePerLead}€`}
          icon={TrendingUp}
          change={12}
        />
        <StatCard
          label="Coût / lead"
          value={`${costPerLead}€`}
          icon={TrendingDown}
          change={-5}
        />
        <StatCard
          label="ROI"
          value={`${roi}%`}
          icon={Target}
          change={Number(roi)}
        />
      </div>

      {/* Area Chart */}
      <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
        <h3 className="text-lg font-semibold text-white mb-4">Évolution du revenue (6 semaines)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D26A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00D26A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="week" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10,10,10,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#00D26A"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Dual Axis Chart */}
      <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
        <h3 className="text-lg font-semibold text-white mb-4">Leads vs Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dualAxisData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis yAxisId="left" stroke="#888" />
            <YAxis yAxisId="right" orientation="right" stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10,10,10,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="leads"
              stroke="#FF5C00"
              strokeWidth={2}
              name="Leads"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#00D26A"
              strokeWidth={2}
              name="Revenue (€)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
