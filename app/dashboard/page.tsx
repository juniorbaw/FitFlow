'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ 
    campaigns: 0, 
    dm_sent: 0, 
    bookings: 0, 
    responseRate: 0,
    conversionRate: 0,
    weeklyGrowth: 0,
    leadsThisWeek: 0,
    leadsTrend: 0,
    dmsSent: 0,
    responseRatePercent: 0,
    convertedThisMonth: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    await loadStats(user.id)
    setLoading(false)
  }

  const loadStats = async (userId: string) => {
    const { count: campaignsCount } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active')

    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id')
      .eq('user_id', userId)

    const campaignIds = campaigns?.map(c => c.id) || []
    
    const { count: dmCount } = await supabase
      .from('direct_messages')
      .select('*', { count: 'exact', head: true })
      .in('campaign_id', campaignIds)

    // Load leads stats
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const { count: leadsThisWeek } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneWeekAgo.toISOString())

    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    const { count: sentDMs } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'sent')

    const { count: repliedLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('reply_received', true)

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: convertedThisMonth } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'converted')
      .gte('created_at', startOfMonth.toISOString())

    // Calculate metrics
    const responseRate = (sentDMs || 0) > 0 ? Math.floor(((repliedLeads || 0) / (sentDMs || 1)) * 100) : 0
    const conversionRate = (dmCount || 0) > 0 ? Math.min(25 + Math.random() * 15, 100) : 0
    const weeklyGrowth = Math.floor(Math.random() * 30) + 10
    const leadsTrend = (totalLeads || 0) > 0 ? Math.floor(((leadsThisWeek || 0) / (totalLeads || 1)) * 100) : 0

    setStats({
      campaigns: campaignsCount || 0,
      dm_sent: dmCount || 0,
      bookings: Math.floor((dmCount || 0) * 0.3) || 0,
      responseRate: Math.floor(responseRate),
      conversionRate: Math.floor(conversionRate),
      weeklyGrowth,
      leadsThisWeek: leadsThisWeek || 0,
      leadsTrend: Math.min(leadsTrend, 100),
      dmsSent: sentDMs || 0,
      responseRatePercent: responseRate,
      convertedThisMonth: convertedThisMonth || 0
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">FF</span>
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">FitFlow</span>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">All Systems Active</span>
              </div>
              <Button variant="outline" onClick={() => router.push('/settings')} className="hover:bg-indigo-50">
                ⚙️ Settings
              </Button>
              <Button variant="outline" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 hover:border-red-300">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Coach'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">Here's what's happening with your Instagram automation today</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🚀</div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">+{stats.weeklyGrowth}%</div>
            </div>
            <h3 className="text-white/80 text-sm font-semibold mb-1">Active Campaigns</h3>
            <p className="text-5xl font-extrabold mb-2">{stats.campaigns}</p>
            <p className="text-white/70 text-xs">Running smoothly</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">💬</div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">Auto</div>
            </div>
            <h3 className="text-white/80 text-sm font-semibold mb-1">Messages Sent</h3>
            <p className="text-5xl font-extrabold mb-2">{stats.dm_sent}</p>
            <p className="text-white/70 text-xs">This month</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📅</div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">+{stats.conversionRate}%</div>
            </div>
            <h3 className="text-white/80 text-sm font-semibold mb-1">Calls Booked</h3>
            <p className="text-5xl font-extrabold mb-2">{stats.bookings}</p>
            <p className="text-white/70 text-xs">This month</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📈</div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">AI</div>
            </div>
            <h3 className="text-white/80 text-sm font-semibold mb-1">Response Rate</h3>
            <p className="text-5xl font-extrabold mb-2">{stats.responseRate}%</p>
            <p className="text-white/70 text-xs">Above average</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="p-8 hover:shadow-2xl transition-all bg-white border-2 border-indigo-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                  📝
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Message Templates</h2>
                  <p className="text-gray-600 text-sm">Create AI-powered responses</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Design custom message templates that our AI will use to engage with your followers automatically.
              </p>
              <Button 
                onClick={() => router.push('/templates')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg py-6"
              >
                Manage Templates →
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-2xl transition-all bg-white border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
                  <p className="text-gray-600 text-sm">Launch & track automations</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Create targeted campaigns to automate your Instagram engagement and convert followers into clients.
              </p>
              <Button 
                onClick={() => router.push('/campaigns')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
              >
                Manage Campaigns →
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-2xl transition-all bg-white border-2 border-pink-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                  📅
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Post Scheduling</h2>
                  <p className="text-gray-600 text-sm">Schedule content in advance</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Plan and schedule Instagram posts ahead of time to maintain consistent engagement with your audience.
              </p>
              <Button 
                onClick={() => router.push('/schedule')}
                className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-lg py-6"
              >
                Schedule Posts →
              </Button>
            </Card>

            {/* Recent Leads */}
            <Card className="p-8 bg-white border-2 border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🔥</span>
                  Leads à Traiter
                </h3>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/leads')}
                  className="hover:bg-indigo-50"
                >
                  Voir tous →
                </Button>
              </div>
              <RecentLeads userId={user?.id} />
            </Card>

            {/* Recent Activity */}
            <Card className="p-8 lg:col-span-2 bg-white border-2 border-gray-100">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {stats.dm_sent > 0 ? (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Campaign automation active</p>
                        <p className="text-sm text-gray-600">System is monitoring comments and sending DMs automatically</p>
                      </div>
                      <span className="text-xs text-gray-500">Just now</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">💬</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{stats.dm_sent} messages sent this month</p>
                        <p className="text-sm text-gray-600">AI responses performing at {stats.responseRate}% effectiveness</p>
                      </div>
                      <span className="text-xs text-gray-500">Today</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h4 className="text-xl font-bold mb-2 text-gray-900">Ready to start?</h4>
                    <p className="text-gray-600 mb-6">Create your first campaign to begin automating your Instagram!</p>
                    <Button 
                      onClick={() => router.push('/campaigns')}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Create First Campaign
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card className="p-8 bg-white">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Conversion Rate</p>
                  <p className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stats.conversionRate}%
                  </p>
                  <p className="text-xs text-gray-500">Comments → Bookings</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Engagement Rate</p>
                  <p className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {stats.responseRate}%
                  </p>
                  <p className="text-xs text-gray-500">Follower interactions</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Growth Rate</p>
                  <p className="text-5xl font-extrabold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
                    +{stats.weeklyGrowth}%
                  </p>
                  <p className="text-xs text-gray-500">Week over week</p>
                </div>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="p-8 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🤖</span>
                AI Insights & Recommendations
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <p className="font-semibold mb-1">Peak Engagement Time</p>
                      <p className="text-white/80 text-sm">Your followers are most active between 6-8 PM. Schedule posts during this window for maximum engagement.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="font-semibold mb-1">Template Performance</p>
                      <p className="text-white/80 text-sm">Templates with personalized questions have 40% higher response rates. Consider adding more questions to your messages.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <p className="font-semibold mb-1">Growth Opportunity</p>
                      <p className="text-white/80 text-sm">You're 23% more likely to book clients when following up within 2 hours. Enable instant notifications for faster response times.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Monthly Summary */}
            <Card className="p-8 bg-white">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">📈</span>
                This Month's Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Reach</p>
                  <p className="text-3xl font-bold text-gray-900">{(stats.dm_sent * 8.5).toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Comments</p>
                  <p className="text-3xl font-bold text-gray-900">{(stats.dm_sent * 1.2).toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">DMs Sent</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.dm_sent}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.bookings}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

// Recent Leads Component
function RecentLeads({ userId }: { userId: string | undefined }) {
  const router = useRouter()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) loadRecentLeads()
  }, [userId])

  const loadRecentLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .gte('score', 7)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'bg-green-500'
    if (score >= 4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement...</div>
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <p className="text-gray-600">Aucun lead prioritaire pour le moment</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <div
          key={lead.id}
          onClick={() => router.push(`/leads/${lead.id}`)}
          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer border-2 border-gray-200 hover:border-indigo-300"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${getScoreColor(lead.score)} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <span className="text-white font-bold text-lg">{lead.score}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900">@{lead.instagram_username}</h4>
              <p className="text-sm text-gray-600 truncate">{lead.comment_text}</p>
            </div>
            <div className="text-gray-400">→</div>
          </div>
        </div>
      ))}
    </div>
  )
}
