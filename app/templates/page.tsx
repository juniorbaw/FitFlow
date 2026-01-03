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
