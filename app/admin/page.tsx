'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Coach = {
  id: string
  name: string | null
  email: string | null
  plan: string
  created_at: string
}

type Feedback = {
  id: string
  rating: number
  comments: string | null
  created_at: string
  coach: Coach
}

type Stats = {
  totalCoaches: number
  totalLeads: number
  totalConversations: number
  totalFeedbacks: number
  avgRating: number
}

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'coaches' | 'feedbacks'>('overview')
  
  const [stats, setStats] = useState<Stats>({
    totalCoaches: 0,
    totalLeads: 0,
    totalConversations: 0,
    totalFeedbacks: 0,
    avgRating: 0,
  })
  
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  useEffect(() => {
    checkAdminAccess()
  }, [])

  async function checkAdminAccess() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Vérifier si l'email est admin (CHANGEZ CET EMAIL PAR LE VÔTRE)
      const adminEmails = ['souleyman.ndiaye13@icloud.com', 'admin@fitflow.com']
      
      if (!adminEmails.includes(user.email || '')) {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
      await loadDashboardData()
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  async function loadDashboardData() {
    try {
      // Charger les stats
      const [coachesRes, leadsRes, conversationsRes, feedbacksRes] = await Promise.all([
        supabase.from('coaches').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('conversations').select('*', { count: 'exact', head: true }),
        supabase.from('feedback').select('rating'),
      ])

      const avgRating = feedbacksRes.data && feedbacksRes.data.length > 0
        ? feedbacksRes.data.reduce((sum, f) => sum + f.rating, 0) / feedbacksRes.data.length
        : 0

      setStats({
        totalCoaches: coachesRes.count || 0,
        totalLeads: leadsRes.count || 0,
        totalConversations: conversationsRes.count || 0,
        totalFeedbacks: feedbacksRes.data?.length || 0,
        avgRating,
      })

      // Charger la liste des coaches
      const { data: coachesData } = await supabase
        .from('coaches')
        .select('*')
        .order('created_at', { ascending: false })

      setCoaches(coachesData || [])

      // Charger les feedbacks avec les infos du coach
      const { data: feedbacksData } = await supabase
        .from('feedback')
        .select(`
          *,
          coach:coaches(id, name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      setFeedbacks(feedbacksData as any || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          🔐 Panel Admin FitFlow
        </h1>
        <p className="text-gray-400 mt-2">Vue d'ensemble et gestion de la plateforme</p>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'overview'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('coaches')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'coaches'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            👥 Coachs ({stats.totalCoaches})
          </button>
          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'feedbacks'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            💬 Feedbacks ({stats.totalFeedbacks})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Coachs"
              value={stats.totalCoaches}
              icon="👥"
              color="purple"
            />
            <StatCard
              title="Total Leads"
              value={stats.totalLeads}
              icon="🎯"
              color="blue"
            />
            <StatCard
              title="Conversations"
              value={stats.totalConversations}
              icon="💬"
              color="green"
            />
            <StatCard
              title="Note Moyenne"
              value={stats.avgRating.toFixed(1) + '/5'}
              icon="⭐"
              color="yellow"
            />
          </div>
        )}

        {/* Coaches Tab */}
        {activeTab === 'coaches' && (
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Liste des Coachs</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-4 text-gray-400">Nom</th>
                    <th className="text-left py-4 px-4 text-gray-400">Email</th>
                    <th className="text-left py-4 px-4 text-gray-400">Plan</th>
                    <th className="text-left py-4 px-4 text-gray-400">Inscrit le</th>
                    <th className="text-left py-4 px-4 text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((coach) => (
                    <tr key={coach.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-4 px-4">{coach.name || 'Non renseigné'}</td>
                      <td className="py-4 px-4 text-gray-400">{coach.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          coach.plan === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                          coach.plan === 'starter' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {coach.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {new Date(coach.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => router.push(`/admin/coaches/${coach.id}`)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Voir détails →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedbacks Tab */}
        {activeTab === 'feedbacks' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Feedbacks Utilisateurs</h2>
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400">
                        {'⭐'.repeat(feedback.rating)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {feedback.rating}/5
                      </span>
                    </div>
                    <p className="text-gray-300">{feedback.comments || 'Aucun commentaire'}</p>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(feedback.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {feedback.coach && (
                  <div className="text-sm text-gray-400 border-t border-gray-800 pt-4">
                    Par: {feedback.coach.name || feedback.coach.email}
                  </div>
                )}
              </div>
            ))}
            {feedbacks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Aucun feedback pour le moment
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: {
  title: string
  value: string | number
  icon: string
  color: 'purple' | 'blue' | 'green' | 'yellow'
}) {
  const colorClasses = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
  }

  return (
    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <div className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
          {value}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    </div>
  )
}
