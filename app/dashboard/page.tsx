'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // ═══════════════════════════════════════
  // VÉRIFIE SI USER EST CONNECTÉ
  // ═══════════════════════════════════════
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Pas connecté → redirige vers login
        router.push('/login')
        return
      }
      
      setUser(user)
      setLoading(false)
    }
    
    checkUser()
  }, [router])

  // ═══════════════════════════════════════
  // DÉCONNEXION
  // ═══════════════════════════════════════
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl">ClientWin</span>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Bienvenue, {user?.user_metadata?.full_name || 'User'} ! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Email : {user?.email}
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Campagnes actives</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </Card>

            <Card className="p-6">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold mb-1">DM envoyés</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </Card>

            <Card className="p-6">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold mb-1">RDV bookés</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </Card>
          </div>

          {/* Actions */}
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Prêt à automatiser vos DM Instagram ?
            </h2>
            <p className="text-gray-600 mb-6">
              Connectez votre compte Instagram pour commencer
            </p>
            <Button size="lg">
              Connecter Instagram
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}