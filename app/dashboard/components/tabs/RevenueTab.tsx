'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Target, Plus, Edit2, Trash2, Calendar, Check, X } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

interface RevenueEntry {
  id: string
  leadId?: string
  leadUsername?: string
  amount: number
  date: Date
  source: 'fitflow' | 'manual'
  description?: string
}

export function RevenueTab() {
  const [leads, setLeads] = useState<any[]>([])
  const [dailyStats, setDailyStats] = useState<any[]>([])
  const [manualRevenues, setManualRevenues] = useState<RevenueEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingRevenue, setIsAddingRevenue] = useState(false)
  const [newAmount, setNewAmount] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch leads
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch daily stats
      const { data: statsData } = await supabase
        .from('daily_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(7)

      // Fetch manual revenues
      const { data: revenuesData } = await supabase
        .from('manual_revenues')
        .select('*')
        .order('created_at', { ascending: false })

      setLeads(leadsData || [])
      setDailyStats(statsData || [])
      setManualRevenues((revenuesData || []).map(r => ({
        id: r.id,
        amount: r.amount,
        date: new Date(r.created_at),
        source: 'manual' as const,
        description: r.description
      })))
    } catch (error) {
      console.error('Error fetching revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate revenue metrics from REAL data
  const fitflowRevenue = leads.reduce((sum, lead) => sum + (lead.revenue || 0), 0)
  const manualRevenueTotal = manualRevenues.reduce((sum, entry) => sum + entry.amount, 0)
  const totalRevenue = fitflowRevenue + manualRevenueTotal
  
  const conversions = leads.filter(l => l.status === 'converted').length
  const totalConversions = conversions + manualRevenues.length
  
  const revenuePerLead = totalConversions > 0 ? (totalRevenue / totalConversions).toFixed(0) : '0'
  const costPerLead = 15 // Example cost
  const totalLeads = leads.length
  const roi = totalLeads > 0 && (costPerLead * totalLeads) > 0
    ? ((totalRevenue - (costPerLead * totalLeads)) / (costPerLead * totalLeads) * 100).toFixed(0)
    : '0'

  // Prepare weekly data from real daily_stats
  const weeklyData = dailyStats.length > 0
    ? dailyStats.slice(0, 6).reverse().map((stat, i) => ({
        week: `S${i + 1}`,
        revenue: stat.revenue || 0,
      }))
    : []

  // Dual axis data (leads vs revenue) from real data
  const dualAxisData = dailyStats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    leads: stat.total_leads || 0,
    revenue: stat.revenue || 0,
  }))

  const handleAddRevenue = async () => {
    if (!newAmount || parseFloat(newAmount) <= 0) return

    try {
      // Get current coach
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: coach } = await supabase
        .from('coaches')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!coach) return

      // Insert into Supabase
      const { data, error } = await supabase
        .from('manual_revenues')
        .insert({
          coach_id: coach.id,
          amount: parseFloat(newAmount),
          description: newDescription || 'Revenu manuel'
        })
        .select()
        .single()

      if (error) throw error

      // Update local state
      const newEntry: RevenueEntry = {
        id: data.id,
        amount: parseFloat(newAmount),
        date: new Date(),
        source: 'manual',
        description: newDescription || 'Revenu manuel'
      }

      setManualRevenues([newEntry, ...manualRevenues])
      setNewAmount('')
      setNewDescription('')
      setIsAddingRevenue(false)
    } catch (error) {
      console.error('Error adding revenue:', error)
      alert('Erreur lors de l\'ajout du revenu')
    }
  }

  const handleDeleteRevenue = async (id: string) => {
    try {
      const { error } = await supabase
        .from('manual_revenues')
        .delete()
        .eq('id', id)

      if (error) throw error

      setManualRevenues(manualRevenues.filter(entry => entry.id !== id))
    } catch (error) {
      console.error('Error deleting revenue:', error)
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue total"
          value={`${totalRevenue}€`}
          icon={DollarSign}
          change={25}
          changeLabel="vs mois dernier"
        />
        <StatCard
          label="Revenue / client"
          value={`${revenuePerLead}€`}
          icon={TrendingUp}
          change={12}
        />
        <StatCard
          label="Clients totaux"
          value={`${totalConversions}`}
          icon={Target}
          change={8}
        />
        <StatCard
          label="ROI"
          value={`${roi}%`}
          icon={Target}
          change={Number(roi)}
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[rgba(255,92,0,0.05)] border-[rgba(255,92,0,0.2)] p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5C00]"></span>
              Revenus FitFlow (automatique)
            </h3>
            <Badge variant="orange">{conversions} clients</Badge>
          </div>
          <p className="text-3xl font-bold text-[#FF5C00]">{fitflowRevenue}€</p>
          <p className="text-sm text-[#888] mt-1">Généré via l'automatisation IA</p>
        </Card>

        <Card className="bg-[rgba(139,92,246,0.05)] border-[rgba(139,92,246,0.2)] p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
              Revenus manuels (autres sources)
            </h3>
            <Badge className="bg-[rgba(139,92,246,0.2)] text-purple-300">{manualRevenues.length} entrées</Badge>
          </div>
          <p className="text-3xl font-bold text-[#8B5CF6]">{manualRevenueTotal}€</p>
          <p className="text-sm text-[#888] mt-1">Ajouté manuellement par toi</p>
        </Card>
      </div>

      {/* Manual Revenue Management */}
      <Card className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">Gestion des revenus</h3>
            <p className="text-sm text-[#888]">
              Ajoute tes revenus externes (DM directs, recommandations, etc.) pour avoir une vue complète
            </p>
          </div>
          {!isAddingRevenue && (
            <Button
              onClick={() => setIsAddingRevenue(true)}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un revenu
            </Button>
          )}
        </div>

        {/* Add Revenue Form */}
        {isAddingRevenue && (
          <Card className="bg-[rgba(139,92,246,0.05)] border-[rgba(139,92,246,0.2)] p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-[#888] mb-2 block">Montant (€)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="297"
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white placeholder-[#666] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-2 block">Description (optionnel)</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Programme 12 semaines"
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white placeholder-[#666] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddRevenue}
                disabled={!newAmount || parseFloat(newAmount) <= 0}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-2" />
                Valider
              </Button>
              <Button
                onClick={() => {
                  setIsAddingRevenue(false)
                  setNewAmount('')
                  setNewDescription('')
                }}
                variant="outline"
                className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-[#888] hover:text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </Card>
        )}

        {/* Revenue List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {/* FitFlow automated revenues */}
          {leads.filter(l => l.status === 'converted' && l.revenue).map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,92,0,0.05)] border border-[rgba(255,92,0,0.2)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {lead.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">@{lead.username}</p>
                  <div className="flex items-center gap-2 text-xs text-[#888]">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(lead.created_at).toLocaleDateString('fr-FR')}</span>
                    <Badge variant="orange" className="text-xs">FitFlow Auto</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#00D26A]">{lead.revenue}€</p>
                <p className="text-xs text-[#888]">Client FitFlow</p>
              </div>
            </div>
          ))}

          {/* Manual revenues */}
          {manualRevenues.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 rounded-lg bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.2)] group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{entry.description}</p>
                  <div className="flex items-center gap-2 text-xs text-[#888]">
                    <Calendar className="w-3 h-3" />
                    <span>{entry.date.toLocaleDateString('fr-FR')}</span>
                    <Badge className="bg-[rgba(139,92,246,0.2)] text-purple-300 text-xs">Manuel</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xl font-bold text-[#00D26A]">{entry.amount}€</p>
                  <p className="text-xs text-[#888]">Externe</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteRevenue(entry.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF5252] hover:bg-[rgba(255,82,82,0.1)]"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {manualRevenues.length === 0 && conversions === 0 && (
            <div className="text-center py-12 text-[#888]">
              <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-semibold mb-1">Aucun revenu pour l'instant</p>
              <p className="text-sm">Ajoute ton premier revenu manuellement pour commencer à tracker</p>
            </div>
          )}
        </div>
      </Card>

      {/* Charts */}
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

      {/* Help Card */}
      <Card className="bg-[rgba(255,92,0,0.05)] border-[rgba(255,92,0,0.2)] p-5">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          💡 Comment ça marche ?
        </h3>
        <div className="space-y-2 text-sm text-[#888]">
          <p>• <strong className="text-white">Revenus FitFlow :</strong> Générés automatiquement quand tu marques un lead comme "converti"</p>
          <p>• <strong className="text-white">Revenus manuels :</strong> À ajouter pour les clients venant d'autres sources (DM Instagram direct, recommandations, etc.)</p>
          <p>• <strong className="text-white">Total :</strong> La somme des deux te donne une vue complète de tes revenus</p>
        </div>
      </Card>
    </div>
  )
}
