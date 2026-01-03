'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    template_id: '',
    instagram_post_url: '',
    target_keywords: ''
  })

  useEffect(() => {
    checkUser()
    loadTemplates()
    loadCampaigns()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  const loadTemplates = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('message_templates')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (data) setTemplates(data)
  }

  const loadCampaigns = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        message_templates(name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) setCampaigns(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('campaigns')
      .insert({
        user_id: user.id,
        name: formData.name,
        template_id: formData.template_id,
        instagram_post_url: formData.instagram_post_url,
        status: 'active',
        total_dm_sent: 0
      })

    if (!error) {
      alert('Campagne créée !')
      setShowForm(false)
      setFormData({ name: '', template_id: '', instagram_post_url: '', target_keywords: '' })
      loadCampaigns()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette campagne ?')) return
    const { error } = await supabase.from('campaigns').delete().eq('id', id)
    if (!error) {
      alert('Campagne supprimée')
      loadCampaigns()
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
            <h1 className="text-4xl font-bold">🚀 Campagnes</h1>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Annuler' : 'Nouvelle campagne'}
            </Button>
          </div>

          {templates.length === 0 && (
            <Card className="p-6 mb-8 bg-yellow-50 border-yellow-200">
              <p className="text-sm">
                ⚠️ Vous devez d'abord créer un template de message avant de créer une campagne.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => router.push('/templates')}
              >
                → Créer un template
              </Button>
            </Card>
          )}

          {showForm && templates.length > 0 && (
            <Card className="p-6 mb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de la campagne</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Campagne Janvier 2026"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="template">Template de message</Label>
                  <select
                    id="template"
                    value={formData.template_id}
                    onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionner un template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="post_url">URL du post Instagram</Label>
                  <Input
                    id="post_url"
                    value={formData.instagram_post_url}
                    onChange={(e) => setFormData({ ...formData, instagram_post_url: e.target.value })}
                    placeholder="https://www.instagram.com/p/..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'URL du post Instagram que vous voulez cibler
                  </p>
                </div>

                <Button type="submit">Créer la campagne</Button>
              </form>
            </Card>
          )}

          <div className="space-y-4">
            {campaigns.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">Aucune campagne. Créez-en une pour commencer !</p>
              </Card>
            ) : (
              campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() => router.push(`/campaigns/${campaign.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{campaign.name}</h3>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          campaign.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {campaign.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        Template : {campaign.message_templates?.name || 'N/A'}
                      </p>

                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">DM envoyés : </span>
                          <span className="font-semibold">{campaign.total_dm_sent || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Créée le : </span>
                          <span className="font-semibold">
                            {new Date(campaign.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/campaigns/${campaign.id}`)}
                      >
                        Voir détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        Supprimer
                      </Button>
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
