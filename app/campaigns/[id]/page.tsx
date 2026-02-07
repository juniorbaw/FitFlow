'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function CampaignDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [filteredComments, setFilteredComments] = useState<any[]>([])
  const [dmHistory, setDmHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingDM, setSendingDM] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    await loadCampaign()
    await loadDMHistory()
    loadMockComments()
  }

  const loadCampaign = async () => {
    const { data } = await supabase
      .from('campaigns')
      .select(`
        *,
        message_templates(*)
      `)
      .eq('id', campaignId)
      .single()

    if (data) setCampaign(data)
  }

  const loadDMHistory = async () => {
    const { data } = await supabase
      .from('direct_messages')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('sent_at', { ascending: false })

    if (data) setDmHistory(data)
  }

  const loadMockComments = () => {
    const mockComments = [
      {
        id: '1',
        username: 'sarah_marketing',
        text: 'Je suis très intéressée par votre offre ! Pouvez-vous m\'envoyer plus d\'infos ?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        profile_pic: null
      },
      {
        id: '2',
        username: 'entrepreneur_pro',
        text: 'Quel est le prix pour commencer ?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        profile_pic: null
      },
      {
        id: '3',
        username: 'business_coach',
        text: 'Super post ! J\'adore le concept 🔥',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        profile_pic: null
      },
      {
        id: '4',
        username: 'digital_nomad',
        text: 'Intéressant, vous faites des formations ?',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        profile_pic: null
      }
    ]

    setComments(mockComments)
    
    if (campaign?.message_templates?.trigger_keywords) {
      const keywords = campaign.message_templates.trigger_keywords
      const matched = mockComments.filter(comment => {
        const text = comment.text.toLowerCase()
        return keywords.some((kw: string) => text.includes(kw.toLowerCase()))
      })
      setFilteredComments(matched)
    } else {
      setFilteredComments(mockComments)
    }

    setLoading(false)
  }

  const handleSendDM = async (comment: any) => {
    if (!campaign?.message_templates) return

    setSendingDM(comment.id)

    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          campaign_id: campaignId,
          recipient_user_id: comment.username,
          recipient_username: comment.username,
          message_content: campaign.message_templates.message_content,
          status: 'sent',
          sent_at: new Date().toISOString()
        })

      if (error) throw error

      alert(`✅ DM envoyé à @${comment.username} !`)
      
      await supabase
        .from('campaigns')
        .update({ 
          total_dm_sent: (campaign.total_dm_sent || 0) + 1 
        })
        .eq('id', campaignId)

      loadData()

    } catch (error) {
      console.error(error)
      alert('❌ Erreur lors de l\'envoi du DM')
    } finally {
      setSendingDM(null)
    }
  }

  const isDMSent = (username: string) => {
    return dmHistory.some(dm => dm.recipient_username === username)
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
            <span className="font-bold text-xl">FitFlow</span>
          </div>
          <Button variant="outline" onClick={() => router.push('/campaigns')}>
            ← Retour
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{campaign?.name}</h1>
            <p className="text-gray-600 mb-4">
              Template : {campaign?.message_templates?.name}
            </p>
            <a 
              href={campaign?.instagram_post_url} 
              target="_blank"
              className="text-blue-600 hover:underline text-sm"
            >
              📷 Voir le post Instagram →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Total commentaires</p>
              <p className="text-2xl font-bold">{comments.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Correspondances</p>
              <p className="text-2xl font-bold text-green-600">{filteredComments.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">DM envoyés</p>
              <p className="text-2xl font-bold text-blue-600">{dmHistory.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Taux conversion</p>
              <p className="text-2xl font-bold text-purple-600">
                {comments.length > 0 ? Math.round((dmHistory.length / comments.length) * 100) : 0}%
              </p>
            </Card>
          </div>

          <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
            <h3 className="font-bold mb-2">💬 Message qui sera envoyé :</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {campaign?.message_templates?.message_content}
            </p>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                📝 Commentaires ({filteredComments.length})
              </h2>
            </div>

            {filteredComments.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">
                  Aucun commentaire ne correspond aux mots-clés de votre template.
                </p>
              </Card>
            ) : (
              filteredComments.map((comment) => {
                const dmSent = isDMSent(comment.username)
                
                return (
                  <Card key={comment.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {comment.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold">@{comment.username}</p>
                            {dmSent && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                ✓ DM envoyé
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(comment.timestamp).toLocaleString('fr-FR')}
                          </p>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {dmSent ? (
                          <Button variant="outline" disabled>
                            Déjà envoyé
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleSendDM(comment)}
                            disabled={sendingDM === comment.id}
                          >
                            {sendingDM === comment.id ? 'Envoi...' : 'Envoyer DM'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>

          <Card className="p-6 mt-8 bg-yellow-50 border-yellow-200">
            <h3 className="font-bold mb-2">ℹ️ Mode Démonstration</h3>
            <p className="text-sm text-gray-700 mb-2">
              Cette version affiche des commentaires de test pour que tu puisses tester l'interface.
            </p>
            <p className="text-sm text-gray-700">
              Les DM sont enregistrés dans ta base de données Supabase. 
              Pour envoyer de vrais DM Instagram, il faudra connecter l'API Instagram (configuration simple disponible après le test).
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}
