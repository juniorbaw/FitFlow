'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Copy, Check, ExternalLink, Loader2, Instagram } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState('')
  const [coach, setCoach] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    niche: '',
    message_style: '',
    manychat_api_key: '',
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadCoachData()
  }, [])

  const loadCoachData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: coachData } = await supabase
        .from('coaches')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (coachData) {
        setCoach(coachData)
        setFormData({
          name: coachData.name || '',
          business_name: coachData.business_name || '',
          niche: coachData.niche || '',
          message_style: coachData.message_style || '',
          manychat_api_key: coachData.manychat_api_key || '',
        })
      }
    } catch (error) {
      console.error('Error loading coach data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('coaches')
        .update({
          name: formData.name,
          business_name: formData.business_name,
          niche: formData.niche,
          message_style: formData.message_style,
          manychat_api_key: formData.manychat_api_key,
        })
        .eq('user_id', user.id)

      if (error) throw error

      alert('Paramètres sauvegardés !')
    } catch (error: any) {
      console.error('Error saving:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000)
  }

  const handleStripePortal = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      const { url } = await response.json()
      if (url) window.location.href = url
    } catch (error) {
      console.error('Error opening portal:', error)
    }
  }

  const handleConnectInstagram = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?redirectTo=/settings`,
          scopes: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement',
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Instagram connection error:', error)
      alert('Erreur lors de la connexion Instagram')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5C00]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
          <p className="text-gray-400">Gérez votre profil et vos intégrations</p>
        </div>

        {/* Profil */}
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Profil</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-white font-semibold mb-2 block">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
              />
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">Nom du business</label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-semibold mb-2 block">Niche</label>
                <select
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:outline-none focus:border-[#FF5C00]"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="fitness">Fitness & Musculation</option>
                  <option value="yoga">Yoga & Bien-être</option>
                  <option value="nutrition">Nutrition & Diététique</option>
                  <option value="sport">Sport & Performance</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Style de messages</label>
                <select
                  value={formData.message_style}
                  onChange={(e) => setFormData({ ...formData, message_style: e.target.value })}
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:outline-none focus:border-[#FF5C00]"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="friendly">Amical et décontracté</option>
                  <option value="professional">Professionnel</option>
                  <option value="motivational">Motivant et énergique</option>
                </select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 bg-[#FF5C00] hover:bg-[#FF6D1A] text-white font-semibold px-6 py-3 rounded-full"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sauvegarder'}
          </Button>
        </Card>

        {/* Instagram (OPTIONNEL) */}
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] mb-6">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Instagram className="w-5 h-5 text-[#FF5C00]" />
            Connexion Instagram
          </h2>
          <p className="text-gray-400 text-sm mb-6">Optionnel • Nécessaire pour l'automatisation des DMs</p>
          
          {coach?.instagram_username ? (
            <div className="flex items-center gap-3 p-4 bg-[rgba(0,210,106,0.1)] border border-[rgba(0,210,106,0.2)] rounded-lg">
              <div className="flex-1">
                <p className="text-white font-semibold">@{coach.instagram_username}</p>
                <p className="text-green-400 text-sm">✓ Connecté</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-[rgba(255,92,0,0.05)] border border-[rgba(255,92,0,0.15)] rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-300 mb-2">
                  <strong className="text-white">Pourquoi connecter Instagram ?</strong>
                </p>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Détecter automatiquement les commentaires</li>
                  <li>• Envoyer des DMs personnalisés via ManyChat</li>
                  <li>• Tracker les performances de vos posts</li>
                </ul>
              </div>
              <Button
                onClick={handleConnectInstagram}
                className="bg-gradient-to-r from-[#FF5C00] to-[#FF8A00] hover:from-[#FF6D1A] hover:to-[#FF9B1A] text-white font-semibold px-6 py-3 rounded-full"
              >
                Connecter Instagram →
              </Button>
            </div>
          )}
        </Card>

        {/* Abonnement */}
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Abonnement</h2>
          
          <div className="flex items-center justify-between p-4 bg-[rgba(255,92,0,0.05)] border border-[rgba(255,92,0,0.15)] rounded-lg mb-4">
            <div>
              <h3 className="text-white font-semibold capitalize">
                Plan {coach?.plan || 'Starter'}
              </h3>
              <p className="text-gray-400 text-sm">
                {coach?.plan === 'pro' ? '147€/mois' : '47€/mois'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              coach?.subscription_status === 'active' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {coach?.subscription_status === 'active' ? 'Actif' : 'Inactif'}
            </div>
          </div>

          <Button
            onClick={handleStripePortal}
            className="bg-[#635BFF] hover:bg-[#5651E0] text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2"
          >
            Gérer mon abonnement
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Card>

        {/* Intégrations */}
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Intégrations</h2>
          
          <div className="space-y-6">
            {/* Webhook Token */}
            <div>
              <label className="text-white font-semibold mb-2 block">Webhook Token (Make.com)</label>
              <p className="text-gray-400 text-sm mb-2">
                Utilisez ce token dans Make.com pour authentifier les appels webhook
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={coach?.webhook_token || 'Chargement...'}
                  readOnly
                  className="flex-1 px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white font-mono text-sm"
                />
                <Button
                  onClick={() => handleCopy(coach?.webhook_token, 'token')}
                  className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white px-4 py-3 rounded-lg"
                >
                  {copied === 'token' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Webhook URL */}
            <div>
              <label className="text-white font-semibold mb-2 block">Webhook URL</label>
              <p className="text-gray-400 text-sm mb-2">
                URL à utiliser dans Make.com pour envoyer les leads
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/lead`}
                  readOnly
                  className="flex-1 px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white font-mono text-sm"
                />
                <Button
                  onClick={() => handleCopy(`${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/lead`, 'url')}
                  className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white px-4 py-3 rounded-lg"
                >
                  {copied === 'url' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* ManyChat API Key */}
            <div>
              <label className="text-white font-semibold mb-2 block">ManyChat API Key</label>
              <input
                type="password"
                value={formData.manychat_api_key}
                onChange={(e) => setFormData({ ...formData, manychat_api_key: e.target.value })}
                placeholder="Entrez votre clé API ManyChat"
                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 bg-[#FF5C00] hover:bg-[#FF6D1A] text-white font-semibold px-6 py-3 rounded-full"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sauvegarder'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
