'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Instagram, CreditCard, Bell, Shield, LogOut, Save, ArrowLeft } from 'lucide-react'

const ORANGE = '#FF5C00'
const BLUE = '#3B82F6'
const GREEN = '#10B981'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('profile')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram_username: '',
    notifications_enabled: true,
    auto_dm: true,
    daily_limit: 50
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      
      const { data: coach } = await supabase
        .from('coaches')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (coach) {
        setFormData({
          name: coach.name || user.email || '',
          email: user.email || '',
          instagram_username: coach.instagram_username || '',
          notifications_enabled: coach.notifications_enabled ?? true,
          auto_dm: coach.auto_dm ?? true,
          daily_limit: coach.daily_limit || 50
        })
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('coaches')
        .update({
          name: formData.name,
          instagram_username: formData.instagram_username,
          notifications_enabled: formData.notifications_enabled,
          auto_dm: formData.auto_dm,
          daily_limit: formData.daily_limit,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error

      alert('✅ Paramètres sauvegardés !')
    } catch (error: any) {
      console.error('Save error:', error)
      alert('❌ Erreur : ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#888' }}>Chargement...</div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
    { id: 'security', label: 'Sécurité', icon: Shield }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fafafa', padding: '32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <button 
              onClick={() => router.back()} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                background: 'transparent', 
                border: 'none', 
                color: '#888', 
                cursor: 'pointer', 
                fontSize: 14,
                marginBottom: 8
              }}
            >
              <ArrowLeft size={16} /> Retour
            </button>
            <h1 style={{ fontSize: 32, fontWeight: 800 }}>Paramètres</h1>
          </div>
          <Button 
            onClick={handleLogout}
            style={{ 
              background: 'transparent', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: '#888',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <LogOut size={16} /> Déconnexion
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 24 }}>
          {/* Sidebar Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    background: isActive ? 'rgba(255,92,0,0.1)' : 'transparent',
                    border: isActive ? `1px solid ${ORANGE}` : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 12,
                    color: isActive ? ORANGE : '#888',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div>
            {activeTab === 'profile' && (
              <Card style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Informations du profil</h2>
                
                <div style={{ marginBottom: 20 }}>
                  <Label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>Nom complet</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Votre nom"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fafafa' }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <Label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>Email</Label>
                  <Input 
                    value={formData.email}
                    disabled
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#666' }}
                  />
                  <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>L'email ne peut pas être modifié</p>
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  style={{ 
                    background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, 
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <Save size={16} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </Card>
            )}

            {activeTab === 'instagram' && (
              <Card style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Connexion Instagram</h2>
                
                <div style={{ marginBottom: 20 }}>
                  <Label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>Nom d'utilisateur Instagram</Label>
                  <Input 
                    value={formData.instagram_username}
                    onChange={(e) => setFormData({...formData, instagram_username: e.target.value})}
                    placeholder="@votre_compte"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fafafa' }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <Label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                    <input 
                      type="checkbox"
                      checked={formData.auto_dm}
                      onChange={(e) => setFormData({...formData, auto_dm: e.target.checked})}
                      style={{ width: 16, height: 16 }}
                    />
                    Activer l'envoi automatique de DMs
                  </Label>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <Label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>Limite quotidienne de DMs</Label>
                  <Input 
                    type="number"
                    value={formData.daily_limit}
                    onChange={(e) => setFormData({...formData, daily_limit: parseInt(e.target.value)})}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fafafa' }}
                  />
                  <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Nombre maximum de DMs envoyés par jour (recommandé: 50)</p>
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, border: 'none' }}
                >
                  <Save size={16} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Préférences de notification</h2>
                
                <div style={{ marginBottom: 20 }}>
                  <Label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                    <input 
                      type="checkbox"
                      checked={formData.notifications_enabled}
                      onChange={(e) => setFormData({...formData, notifications_enabled: e.target.checked})}
                      style={{ width: 16, height: 16 }}
                    />
                    Recevoir des notifications par email
                  </Label>
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, border: 'none' }}
                >
                  <Save size={16} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Facturation</h2>
                <p style={{ color: '#888', marginBottom: 20 }}>Gérez votre abonnement et vos moyens de paiement</p>
                
                <div style={{ padding: 16, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, color: BLUE }}>💳 Plan actuel: <strong>Starter</strong></p>
                  <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Prochain renouvellement: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('fr-FR')}</p>
                </div>

                <Button 
                  onClick={() => alert('Redirection vers Stripe Portal...')}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fafafa' }}
                >
                  Gérer mon abonnement
                </Button>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Sécurité</h2>
                
                <div style={{ padding: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, marginBottom: 20 }}>
                  <p style={{ fontSize: 14, color: GREEN }}>✓ Votre compte est sécurisé</p>
                </div>

                <Button 
                  onClick={() => alert('Fonctionnalité à venir')}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fafafa' }}
                >
                  Changer le mot de passe
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
