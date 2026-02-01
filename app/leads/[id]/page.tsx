'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function LeadDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    checkUser()
    loadLead()
  }, [params.id])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  const loadLead = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setLead(data)
    } catch (error: any) {
      toast.error('Erreur de chargement: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!lead) return
    setUpdating(true)

    try {
      const updates: any = { status: newStatus }
      
      if (newStatus === 'sent' && !lead.dm_sent_date) {
        updates.dm_sent_date = new Date().toISOString()
      }

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', lead.id)

      if (error) throw error
      
      toast.success('Statut mis à jour!')
      loadLead()
    } catch (error: any) {
      toast.error('Erreur: ' + error.message)
    } finally {
      setUpdating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('DM copié! 📋')
    } catch (error) {
      toast.error('Erreur de copie')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'bg-green-500'
    if (score >= 4) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 7) return 'from-green-500 to-green-600'
    if (score >= 4) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Chargement du lead...</p>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Lead non trouvé</h2>
          <Button onClick={() => router.push('/leads')}>
            ← Retour aux leads
          </Button>
        </Card>
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
                <p className="text-xs text-gray-500">Détails du Lead</p>
              </div>
            </Link>
            <Button variant="outline" onClick={() => router.push('/leads')} className="hover:bg-indigo-50">
              ← Retour aux leads
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header avec Score */}
          <div className="mb-8 flex items-center gap-6">
            <div className={`w-32 h-32 bg-gradient-to-br ${getScoreBgColor(lead.score)} rounded-2xl flex items-center justify-center shadow-2xl`}>
              <div className="text-center">
                <div className="text-6xl font-extrabold text-white">{lead.score}</div>
                <div className="text-sm text-white/90 font-semibold">/ 10</div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
                @{lead.instagram_username}
              </h1>
              <div className="flex items-center gap-3">
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updating}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold"
                >
                  <option value="pending">En attente</option>
                  <option value="sent">Envoyé</option>
                  <option value="replied">Répondu</option>
                  <option value="converted">Converti</option>
                  <option value="archived">Archivé</option>
                </select>
                {lead.reply_received && (
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold">
                    💬 Répondu
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Commentaire Original */}
          <Card className="p-8 mb-6 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-3xl">💬</span>
              Commentaire Original
            </h2>
            <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                {lead.comment_text}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span>📅 {new Date(lead.created_at).toLocaleString('fr-FR')}</span>
              {lead.dm_sent_date && (
                <span>📨 DM envoyé le {new Date(lead.dm_sent_date).toLocaleString('fr-FR')}</span>
              )}
            </div>
          </Card>

          {/* DM Suggéré */}
          <Card className="p-8 mb-6 border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">🤖</span>
                DM Suggéré par l'IA
              </h2>
              <Button
                onClick={() => copyToClipboard(lead.dm_suggested)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                📋 Copier le DM
              </Button>
            </div>
            <div className="p-6 bg-white rounded-lg border-2 border-purple-200 shadow-lg">
              <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                {lead.dm_suggested}
              </p>
            </div>
          </Card>

          {/* Analyse IA */}
          <Card className="p-8 mb-6 border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-3xl">🧠</span>
              Analyse IA
            </h2>
            <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {lead.reasoning}
              </p>
            </div>
          </Card>

          {/* Réponse Reçue */}
          {lead.reply_received && lead.reply_text && (
            <Card className="p-8 mb-6 border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">✅</span>
                Réponse Reçue
              </h2>
              <div className="p-6 bg-white rounded-lg border-2 border-green-200 shadow-lg">
                <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {lead.reply_text}
                </p>
              </div>
            </Card>
          )}

          {/* Actions */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lead.status === 'pending' && (
                <Button
                  onClick={() => updateStatus('sent')}
                  disabled={updating}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-16 text-lg"
                >
                  📨 Envoyer DM
                </Button>
              )}
              
              {(lead.status === 'sent' || lead.status === 'replied') && (
                <Button
                  onClick={() => updateStatus('converted')}
                  disabled={updating}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-16 text-lg"
                >
                  ✅ Marquer Converti
                </Button>
              )}

              {lead.status !== 'archived' && (
                <Button
                  onClick={() => updateStatus('archived')}
                  disabled={updating}
                  variant="outline"
                  className="h-16 text-lg hover:bg-gray-100"
                >
                  🗄️ Archiver
                </Button>
              )}

              <Button
                onClick={() => window.open(`https://instagram.com/${lead.instagram_username}`, '_blank')}
                variant="outline"
                className="h-16 text-lg hover:bg-pink-50"
              >
                📸 Voir Profil Instagram
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
