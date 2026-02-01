'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { toast } from 'sonner'

interface Lead {
  id: string
  instagram_username: string
  comment_text: string
  score: number
  dm_suggested: string
  reasoning: string
  status: 'pending' | 'sent' | 'replied' | 'converted' | 'archived'
  dm_sent_date: string | null
  reply_received: boolean
  reply_text: string | null
  created_at: string
}

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterScore, setFilterScore] = useState<string>('all')

  useEffect(() => {
    checkUser()
    loadLeads()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filterStatus, filterScore, leads])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  const loadLeads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error: any) {
      toast.error('Erreur de chargement: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...leads]

    if (filterStatus !== 'all') {
      filtered = filtered.filter(l => l.status === filterStatus)
    }

    if (filterScore === 'high') {
      filtered = filtered.filter(l => l.score >= 7)
    } else if (filterScore === 'medium') {
      filtered = filtered.filter(l => l.score >= 4 && l.score < 7)
    } else if (filterScore === 'low') {
      filtered = filtered.filter(l => l.score < 4)
    }

    setFilteredLeads(filtered)
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'bg-green-500'
    if (score >= 4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-700',
      sent: 'bg-blue-100 text-blue-700',
      replied: 'bg-purple-100 text-purple-700',
      converted: 'bg-green-100 text-green-700',
      archived: 'bg-gray-100 text-gray-700'
    }
    return badges[status as keyof typeof badges] || badges.pending
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'En attente',
      sent: 'Envoyé',
      replied: 'Répondu',
      converted: 'Converti',
      archived: 'Archivé'
    }
    return labels[status as keyof typeof labels] || status
  }

  const calculateStats = () => {
    return {
      total: leads.length,
      pending: leads.filter(l => l.status === 'pending').length,
      sent: leads.filter(l => l.status === 'sent').length,
      converted: leads.filter(l => l.status === 'converted').length,
      highScore: leads.filter(l => l.score >= 7).length
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Chargement des leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white/90 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">IC</span>
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">InstaCoach Pro</span>
                <p className="text-xs text-gray-500">Gestion des Leads</p>
              </div>
            </Link>
            <div className="flex gap-3">
              <Button variant="outline" onClick={loadLeads} className="hover:bg-indigo-50">
                🔄 Actualiser
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')} className="hover:bg-indigo-50">
                ← Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              🎯 Mes Leads
            </h1>
            <p className="text-gray-600 text-lg">Gérez vos leads Instagram et suivez vos conversions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-white/80 text-xs font-semibold mb-1">Total</p>
              <p className="text-3xl font-extrabold">{stats.total}</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
              <div className="text-3xl mb-2">⏳</div>
              <p className="text-white/80 text-xs font-semibold mb-1">En attente</p>
              <p className="text-3xl font-extrabold">{stats.pending}</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <div className="text-3xl mb-2">📨</div>
              <p className="text-white/80 text-xs font-semibold mb-1">Envoyés</p>
              <p className="text-3xl font-extrabold">{stats.sent}</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-white/80 text-xs font-semibold mb-1">Convertis</p>
              <p className="text-3xl font-extrabold">{stats.converted}</p>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-white/80 text-xs font-semibold mb-1">Score ≥ 7</p>
              <p className="text-3xl font-extrabold">{stats.highScore}</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Statut</label>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                    className={filterStatus === 'all' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                  >
                    Tous
                  </Button>
                  <Button
                    variant={filterStatus === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('pending')}
                  >
                    En attente
                  </Button>
                  <Button
                    variant={filterStatus === 'sent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('sent')}
                  >
                    Envoyés
                  </Button>
                  <Button
                    variant={filterStatus === 'converted' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('converted')}
                  >
                    Convertis
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Score</label>
                <div className="flex gap-2">
                  <Button
                    variant={filterScore === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterScore('all')}
                    className={filterScore === 'all' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
                  >
                    Tous
                  </Button>
                  <Button
                    variant={filterScore === 'high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterScore('high')}
                    className={filterScore === 'high' ? 'bg-green-600' : ''}
                  >
                    Élevé (7-10)
                  </Button>
                  <Button
                    variant={filterScore === 'medium' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterScore('medium')}
                    className={filterScore === 'medium' ? 'bg-yellow-600' : ''}
                  >
                    Moyen (4-6)
                  </Button>
                  <Button
                    variant={filterScore === 'low' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterScore('low')}
                    className={filterScore === 'low' ? 'bg-red-600' : ''}
                  >
                    Faible (1-3)
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Leads List */}
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <Card className="p-12 text-center border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Aucun lead</h3>
                <p className="text-gray-600">Les leads Instagram apparaîtront ici automatiquement</p>
              </Card>
            ) : (
              filteredLeads.map((lead) => (
                <Card 
                  key={lead.id} 
                  className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-gray-100"
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                  <div className="flex items-start gap-6">
                    {/* Score Badge */}
                    <div className={`w-20 h-20 ${getScoreColor(lead.score)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <div className="text-center">
                        <div className="text-3xl font-extrabold text-white">{lead.score}</div>
                        <div className="text-xs text-white/80">/ 10</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">@{lead.instagram_username}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(lead.status)}`}>
                          {getStatusLabel(lead.status)}
                        </span>
                        {lead.reply_received && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                            💬 Répondu
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                        {lead.comment_text}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📅 {new Date(lead.created_at).toLocaleDateString('fr-FR')}</span>
                        {lead.dm_sent_date && (
                          <span>📨 Envoyé le {new Date(lead.dm_sent_date).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
