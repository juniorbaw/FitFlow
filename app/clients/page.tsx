'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { toast } from 'sonner'

interface Client {
  id: string
  client_name: string
  client_email: string
  plan_type: string
  amount: number
  start_date: string
  end_date: string
  renewal_status: 'active' | 'pending' | 'churned'
  engagement_score: number
  created_at: string
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    plan_type: '',
    amount: '',
    start_date: '',
    end_date: '',
    engagement_score: 5
  })

  useEffect(() => {
    checkUser()
    loadClients()
  }, [])

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredClients(clients)
    } else {
      setFilteredClients(clients.filter(c => c.renewal_status === filterStatus))
    }
  }, [filterStatus, clients])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  const loadClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
      setFilteredClients(data || [])
    } catch (error: any) {
      toast.error('Failed to load clients: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const total = clients.length
    const revenue = clients.reduce((sum, c) => sum + c.amount, 0)
    
    const atRisk = clients.filter(c => {
      const endDate = new Date(c.end_date)
      const today = new Date()
      const daysUntilRenewal = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilRenewal <= 7 && daysUntilRenewal >= 0 && c.renewal_status === 'active'
    }).length

    return { total, revenue, atRisk }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const clientData = {
        user_id: user.id,
        client_name: formData.client_name,
        client_email: formData.client_email,
        plan_type: formData.plan_type,
        amount: parseFloat(formData.amount),
        start_date: formData.start_date,
        end_date: formData.end_date,
        engagement_score: formData.engagement_score,
        renewal_status: 'active' as const
      }

      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', editingClient.id)

        if (error) throw error
        toast.success('Client mis à jour avec succès!')
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([clientData])

        if (error) throw error
        toast.success('Client ajouté avec succès!')
      }

      setShowModal(false)
      setEditingClient(null)
      setFormData({
        client_name: '',
        client_email: '',
        plan_type: '',
        amount: '',
        start_date: '',
        end_date: '',
        engagement_score: 5
      })
      loadClients()
    } catch (error: any) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      client_name: client.client_name,
      client_email: client.client_email,
      plan_type: client.plan_type,
      amount: client.amount.toString(),
      start_date: client.start_date,
      end_date: client.end_date,
      engagement_score: client.engagement_score
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client?')) return

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Client supprimé')
      loadClients()
    } catch (error: any) {
      toast.error('Erreur: ' + error.message)
    }
  }

  const getRenewalBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'churned': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getEngagementColor = (score: number) => {
    if (score >= 8) return 'text-green-600 font-bold'
    if (score >= 5) return 'text-yellow-600 font-bold'
    return 'text-red-600 font-bold'
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Chargement des clients...</p>
        </div>
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
                <span className="text-white font-bold text-2xl">FF</span>
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">FitFlow</span>
                <p className="text-xs text-gray-500">Gestion Clients</p>
              </div>
            </Link>
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="hover:bg-indigo-50">
              ← Retour Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                💼 Mes Clients
              </h1>
              <p className="text-gray-600 text-lg">Gérez vos clients et optimisez vos revenus</p>
            </div>
            <Button 
              onClick={() => {
                setEditingClient(null)
                setFormData({
                  client_name: '',
                  client_email: '',
                  plan_type: '',
                  amount: '',
                  start_date: '',
                  end_date: '',
                  engagement_score: 5
                })
                setShowModal(true)
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg text-lg px-8 py-6"
            >
              + Ajouter Client
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-white/80 text-sm font-semibold mb-1">Total Clients</h3>
              <p className="text-5xl font-extrabold">{stats.total}</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-white/80 text-sm font-semibold mb-1">Revenue Total</h3>
              <p className="text-5xl font-extrabold">{stats.revenue.toLocaleString()}€</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-white/80 text-sm font-semibold mb-1">Clients à Risque</h3>
              <p className="text-5xl font-extrabold">{stats.atRisk}</p>
              <p className="text-white/70 text-xs mt-2">Renouvellement &lt; 7 jours</p>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-3">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className={filterStatus === 'all' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : ''}
            >
              Tous ({clients.length})
            </Button>
            <Button
              variant={filterStatus === 'active' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('active')}
              className={filterStatus === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Actifs ({clients.filter(c => c.renewal_status === 'active').length})
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              className={filterStatus === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
            >
              En attente ({clients.filter(c => c.renewal_status === 'pending').length})
            </Button>
            <Button
              variant={filterStatus === 'churned' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('churned')}
              className={filterStatus === 'churned' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Perdus ({clients.filter(c => c.renewal_status === 'churned').length})
            </Button>
          </div>

          {/* Clients Table */}
          {filteredClients.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-2">Aucun client</h3>
              <p className="text-gray-600 mb-6">Ajoutez votre premier client pour commencer!</p>
              <Button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                + Ajouter Client
              </Button>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Nom</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Plan</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Montant</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Début</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Fin</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Score</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{client.client_name}</td>
                        <td className="px-6 py-4 text-gray-600">{client.client_email}</td>
                        <td className="px-6 py-4 text-gray-700">{client.plan_type}</td>
                        <td className="px-6 py-4 font-bold text-green-600">{client.amount}€</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(client.start_date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(client.end_date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRenewalBadgeColor(client.renewal_status)}`}>
                            {client.renewal_status === 'active' ? 'Actif' : client.renewal_status === 'pending' ? 'En attente' : 'Perdu'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-2xl ${getEngagementColor(client.engagement_score)}`}>
                            {client.engagement_score}/10
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(client)}>
                              ✏️
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(client.id)} className="hover:bg-red-50 hover:text-red-600">
                              🗑️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingClient ? 'Modifier Client' : 'Ajouter Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="client_name" className="font-semibold">Nom du client *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="client_email" className="font-semibold">Email *</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="plan_type" className="font-semibold">Type de plan *</Label>
                  <Input
                    id="plan_type"
                    value={formData.plan_type}
                    onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
                    placeholder="ex: 3 mois coaching"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="amount" className="font-semibold">Montant (€) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="start_date" className="font-semibold">Date de début *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="end_date" className="font-semibold">Date de fin *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="engagement_score" className="font-semibold">Score d'engagement (1-10)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    id="engagement_score"
                    type="range"
                    min="1"
                    max="10"
                    value={formData.engagement_score}
                    onChange={(e) => setFormData({ ...formData, engagement_score: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-indigo-600 w-12 text-center">
                    {formData.engagement_score}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {editingClient ? 'Mettre à jour' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="px-8">
                  Annuler
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
