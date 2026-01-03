'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ campaigns: 0, dm_sent: 0, bookings: 0 })
  const [loading, setLoading] = useState(true)

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

    setStats({
      campaigns: campaignsCount || 0,
      dm_sent: dmCount || 0,
      bookings: 0
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl">ClientWin</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>Déconnexion</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Bienvenue, {user?.user_metadata?.full_name || 'User'} ! 🎉
          </h1>
          <p className="text-gray-600 mb-8">Email : {user?.email}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Campagnes actives</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.campaigns}</p>
            </Card>
            <Card className="p-6">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold mb-1">DM envoyés</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.dm_sent}</p>
            </Card>
            <Card className="p-6">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold mb-1">RDV bookés</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.bookings}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition cursor-pointer" onClick={() => router.push('/templates')}>
              <div className="text-4xl mb-3">📝</div>
              <h2 className="text-xl font-bold mb-2">Gérer les Templates</h2>
              <p className="text-gray-600">Créez et gérez vos messages automatiques</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition cursor-pointer" onClick={() => router.push('/campaigns')}>
              <div className="text-4xl mb-3">🚀</div>
              <h2 className="text-xl font-bold mb-2">Gérer les Campagnes</h2>
              <p className="text-gray-600">Lancez et suivez vos campagnes Instagram</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
