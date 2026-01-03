#!/bin/bash

# ══════════════════════════════════════════════════════════════
# CLIENTWIN - INSTALLATION AUTOMATIQUE COMPLÈTE
# ══════════════════════════════════════════════════════════════

echo "╔════════════════════════════════════════════════════════╗"
echo "║    🚀 INSTALLATION AUTOMATIQUE CLIENTWIN 🚀           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# ══════════════════════════════════════════════════════════════
# ÉTAPE 1 : NETTOYER LES FICHIERS EXISTANTS
# ══════════════════════════════════════════════════════════════

echo "🧹 Nettoyage des anciens fichiers..."

rm -rf app/api/auth/instagram
rm -rf app/instagram-test
rm -f .env.local

echo "✅ Nettoyage terminé"
echo ""

# ══════════════════════════════════════════════════════════════
# ÉTAPE 2 : CRÉER .env.local AVEC TOUTES LES CLÉS
# ══════════════════════════════════════════════════════════════

echo "📝 Création de .env.local..."

cat > .env.local << 'ENVEOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yxnawbhgfertwrskaovo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bmF3YmhnZmVydHdyc2thb3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNDk5MTEsImV4cCI6MjA4MjgyNTkxMX0.ai4U77-2r5eJPNwOo5KpYudq4SqKf6vnYfFn5yVs7_I

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# N8N Webhook (sera rempli après setup n8n)
N8N_WEBHOOK_URL=
ENVEOF

echo "✅ .env.local créé"
echo ""

# ══════════════════════════════════════════════════════════════
# ÉTAPE 3 : CRÉER LA STRUCTURE DES DOSSIERS
# ══════════════════════════════════════════════════════════════

echo "📁 Création de la structure des dossiers..."

mkdir -p app/dashboard
mkdir -p app/templates
mkdir -p app/campaigns
mkdir -p app/api/webhooks/n8n
mkdir -p lib

echo "✅ Structure créée"
echo ""

# ══════════════════════════════════════════════════════════════
# ÉTAPE 4 : CRÉER LE DASHBOARD
# ══════════════════════════════════════════════════════════════

echo "📄 Création du Dashboard..."

cat > app/dashboard/page.tsx << 'TSXEOF'
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
TSXEOF

echo "✅ Dashboard créé"
echo ""

# ══════════════════════════════════════════════════════════════
# ÉTAPE 5 : CRÉER LA PAGE TEMPLATES
# ══════════════════════════════════════════════════════════════

echo "📄 Création de la page Templates..."

cat > app/templates/page.tsx << 'TSXEOF'
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    message_content: '',
    trigger_keywords: '',
    include_calendly: true
  })

  useEffect(() => {
    checkUser()
    loadTemplates()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  const loadTemplates = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('message_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) setTemplates(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const keywords = formData.trigger_keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)

    const { error } = await supabase
      .from('message_templates')
      .insert({
        user_id: user.id,
        name: formData.name,
        message_content: formData.message_content,
        trigger_keywords: keywords,
        include_calendly: formData.include_calendly,
        is_active: true
      })

    if (!error) {
      alert('Template créé !')
      setShowForm(false)
      setFormData({ name: '', message_content: '', trigger_keywords: '', include_calendly: true })
      loadTemplates()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce template ?')) return
    const { error } = await supabase.from('message_templates').delete().eq('id', id)
    if (!error) {
      alert('Template supprimé')
      loadTemplates()
    }
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
          <Button variant="outline" onClick={() => router.push('/dashboard')}>Retour</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">📝 Templates de Messages</h1>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Annuler' : 'Nouveau template'}
            </Button>
          </div>

          {showForm && (
            <Card className="p-6 mb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du template</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Message de bienvenue"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Mots-clés déclencheurs (séparés par des virgules)</Label>
                  <Input
                    id="keywords"
                    value={formData.trigger_keywords}
                    onChange={(e) => setFormData({ ...formData, trigger_keywords: e.target.value })}
                    placeholder="Ex: intéressé, info, prix"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    value={formData.message_content}
                    onChange={(e) => setFormData({ ...formData, message_content: e.target.value })}
                    className="w-full min-h-32 p-3 border rounded-md"
                    placeholder="Salut ! Merci pour ton commentaire..."
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="calendly"
                    checked={formData.include_calendly}
                    onChange={(e) => setFormData({ ...formData, include_calendly: e.target.checked })}
                  />
                  <Label htmlFor="calendly">Inclure le lien Calendly</Label>
                </div>
                <Button type="submit">Créer le template</Button>
              </form>
            </Card>
          )}

          <div className="space-y-4">
            {templates.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">Aucun template. Créez-en un pour commencer !</p>
              </Card>
            ) : (
              templates.map((template) => (
                <Card key={template.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{template.message_content}</p>
                      {template.trigger_keywords && template.trigger_keywords.length > 0 && (
                        <div className="flex gap-2 mb-2">
                          {template.trigger_keywords.map((kw: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{kw}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(template.id)}>
                      Supprimer
                    </Button>
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
TSXEOF

echo "✅ Page Templates créée"
echo ""

# ══════════════════════════════════════════════════════════════
# ÉTAPE 6 : AFFICHER LES INSTRUCTIONS
# ══════════════════════════════════════════════════════════════

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║        ✅ INSTALLATION TERMINÉE !                     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📋 PROCHAINES ÉTAPES :"
echo ""
echo "1️⃣  Redémarre le serveur :"
echo "    Ctrl + C"
echo "    npm run dev"
echo ""
echo "2️⃣  Va sur http://localhost:3000/dashboard"
echo ""
echo "3️⃣  Clique sur 'Gérer les Templates'"
echo ""
echo "4️⃣  Crée ton premier template de message"
echo ""
echo "5️⃣  Setup n8n (voir instructions ci-dessous)"
echo ""
echo "════════════════════════════════════════════════════════"
echo "🤖 INSTRUCTIONS N8N"
echo "════════════════════════════════════════════════════════"
echo ""
echo "1. Va sur : https://n8n.io/cloud/"
echo "2. Crée un compte gratuit (14 jours d'essai)"
echo "3. Connecte Instagram (n8n gère l'OAuth automatiquement)"
echo "4. Connecte Supabase avec ces infos :"
echo "   - Host: yxnawbhgfertwrskaovo.supabase.co"
echo "   - Database: postgres"
echo "   - User: postgres"
echo "   - Password: (cherche dans Supabase Settings → Database)"
echo ""
echo "5. Importe le workflow n8n-workflow-clientwin.json"
echo ""
echo "════════════════════════════════════════════════════════"
echo ""
echo "✅ Ton app ClientWin est prête !"
echo ""
