'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { connectInstagram } from '@/lib/api'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    company: '',
    phone: '',
    timezone: 'America/New_York'
  })

  const [instagram, setInstagram] = useState({
    connected: false,
    username: '@coachexample',
    followers: 0
  })

  const [notifications, setNotifications] = useState({
    email_new_dm: true,
    email_booking: true,
    email_weekly_report: true,
    push_new_comment: true,
    push_campaign_update: false
  })

  const [integrations, setIntegrations] = useState({
    ghl_api_key: '',
    webhook_url: ''
  })

  const [automation, setAutomation] = useState({
    auto_send_enabled: false,
    daily_dm_limit: 20
  })

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
    setProfile({
      full_name: user.user_metadata?.full_name || '',
      email: user.email || '',
      company: '',
      phone: '',
      timezone: 'America/New_York'
    })

    // Load integrations and automation settings
    const { data: profileData } = await supabase
      .from('profiles')
      .select('ghl_api_key, auto_send_enabled, daily_dm_limit')
      .eq('id', user.id)
      .single()

    if (profileData) {
      setIntegrations({
        ghl_api_key: profileData.ghl_api_key || '',
        webhook_url: `${window.location.origin}/api/webhooks/scrape`
      })
      setAutomation({
        auto_send_enabled: profileData.auto_send_enabled || false,
        daily_dm_limit: profileData.daily_dm_limit || 20
      })
    } else {
      setIntegrations({
        ...integrations,
        webhook_url: `${window.location.origin}/api/webhooks/scrape`
      })
    }

    setLoading(false)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Profile updated successfully! ✅')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading settings...</p>
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
                <p className="text-xs text-gray-500">Settings</p>
              </div>
            </Link>
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="hover:bg-indigo-50">
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ⚙️ Settings
            </h1>
            <p className="text-gray-600 text-lg">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4 bg-white">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'profile'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    👤 Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('instagram')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'instagram'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    📸 Instagram
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'notifications'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    🔔 Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'billing'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    💳 Billing
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'security'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    🔒 Security
                  </button>
                  <button
                    onClick={() => setActiveTab('integrations')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'integrations'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    🔌 Intégrations
                  </button>
                  <button
                    onClick={() => setActiveTab('automation')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === 'automation'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    ⚡ Automatisation
                  </button>
                </nav>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <Card className="p-8 bg-white">
                  <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="full_name" className="text-base font-semibold">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="mt-2 h-12"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="company" className="text-base font-semibold">Company / Business Name</Label>
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                          placeholder="Your Coaching Business"
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-base font-semibold">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="mt-2 h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="timezone" className="text-base font-semibold">Timezone</Label>
                      <select
                        id="timezone"
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg mt-2 h-12"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                      </select>
                    </div>

                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </Card>
              )}

              {activeTab === 'instagram' && (
                <Card className="p-8 bg-white">
                  <h2 className="text-2xl font-bold mb-6">Instagram Connection</h2>
                  
                  {instagram.connected ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
                            ✓
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Connected</h3>
                            <p className="text-sm text-gray-600">{instagram.username}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">{instagram.followers}</p>
                            <p className="text-xs text-gray-600">Followers</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">1.2K</p>
                            <p className="text-xs text-gray-600">Posts</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">4.5%</p>
                            <p className="text-xs text-gray-600">Engagement</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                        Disconnect Instagram Account
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-6">
                        📸
                      </div>
                      <h3 className="text-xl font-bold mb-3">Connect Your Instagram Account</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Link your Instagram Business account to start automating engagement and booking clients.
                      </p>
                      <Button 
                        onClick={() => user?.id && connectInstagram(user.id)}
                        className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700"
                      >
                        Connect Instagram →
                      </Button>
                      <p className="text-xs text-gray-500 mt-4">Requires Instagram Business or Creator account</p>
                    </div>
                  )}
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card className="p-8 bg-white">
                  <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold">New Direct Messages</p>
                            <p className="text-sm text-gray-600">Get notified when someone responds to your DMs</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.email_new_dm}
                            onChange={(e) => setNotifications({ ...notifications, email_new_dm: e.target.checked })}
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold">New Bookings</p>
                            <p className="text-sm text-gray-600">Alert when someone books a call with you</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.email_booking}
                            onChange={(e) => setNotifications({ ...notifications, email_booking: e.target.checked })}
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold">Weekly Performance Report</p>
                            <p className="text-sm text-gray-600">Summary of your campaigns and metrics</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.email_weekly_report}
                            onChange={(e) => setNotifications({ ...notifications, email_weekly_report: e.target.checked })}
                            className="w-6 h-6"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4">Push Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold">New Comments</p>
                            <p className="text-sm text-gray-600">Real-time alerts for Instagram comments</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.push_new_comment}
                            onChange={(e) => setNotifications({ ...notifications, push_new_comment: e.target.checked })}
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold">Campaign Updates</p>
                            <p className="text-sm text-gray-600">Notifications about campaign status changes</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.push_campaign_update}
                            onChange={(e) => setNotifications({ ...notifications, push_campaign_update: e.target.checked })}
                            className="w-6 h-6"
                          />
                        </div>
                      </div>
                    </div>

                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      Save Preferences
                    </Button>
                  </div>
                </Card>
              )}

              {activeTab === 'billing' && (
                <Card className="p-8 bg-white">
                  <h2 className="text-2xl font-bold mb-6">Billing & Subscription</h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold">Pro Plan</h3>
                          <p className="text-gray-600">Billed monthly</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">$99</p>
                          <p className="text-sm text-gray-600">/month</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline">Change Plan</Button>
                        <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                      <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            VISA
                          </div>
                          <div>
                            <p className="font-semibold">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-600">Expires 12/2026</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4">Billing History</h3>
                      <div className="space-y-2">
                        {[
                          { date: 'Jan 1, 2026', amount: '$99.00', status: 'Paid' },
                          { date: 'Dec 1, 2025', amount: '$99.00', status: 'Paid' },
                          { date: 'Nov 1, 2025', amount: '$99.00', status: 'Paid' }
                        ].map((invoice, i) => (
                          <div key={i} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{invoice.date}</p>
                              <p className="text-sm text-gray-600">{invoice.amount}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                {invoice.status}
                              </span>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'integrations' && (
                <Card className="p-8 bg-white">
                  <h2 className="text-2xl font-bold mb-6">Intégrations API</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-4">Go HighLevel API</h3>
                      <div className="max-w-md">
                        <Label>API Key</Label>
                        <Input
                          type="password"
                          value={integrations.ghl_api_key}
                          onChange={(e) => setIntegrations({ ...integrations, ghl_api_key: e.target.value })}
                          placeholder="Entrez votre clé API GHL"
                          className="mt-2 h-12"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          Utilisé pour synchroniser les leads avec votre CRM Go HighLevel
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="font-bold text-lg mb-4">Webhook n8n</h3>
                      <div className="max-w-2xl">
                        <Label>URL du Webhook</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="text"
                            value={integrations.webhook_url}
                            readOnly
                            className="h-12 bg-gray-50"
                          />
                          <Button 
                            onClick={() => {
                              navigator.clipboard.writeText(integrations.webhook_url)
                              alert('URL copiée! 📋')
                            }}
                            variant="outline"
                          >
                            📋 Copier
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Utilisez cette URL dans votre workflow n8n pour envoyer les leads scrapés
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="font-bold text-lg mb-4">Format JSON Requis</h3>
                      <div className="p-4 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                        <pre>{`{
  "user_id": "your-user-id",
  "instagram_username": "prospect_username",
  "comment_text": "Super contenu! 👍",
  "score": 8,
  "dm_suggested": "Salut! Merci pour ton commentaire...",
  "reasoning": "Lead qualifié car..."
}`}</pre>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <Button 
                        onClick={async () => {
                          const { error } = await supabase
                            .from('profiles')
                            .update({ ghl_api_key: integrations.ghl_api_key })
                            .eq('id', user?.id)
                          
                          if (error) {
                            alert('Erreur: ' + error.message)
                          } else {
                            alert('Paramètres d\'intégration sauvegardés! ✅')
                          }
                        }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        Sauvegarder les Intégrations
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'automation' && (
                <Card className="p-8 bg-white">
                  <h2 className="text-2xl font-bold mb-6">Automatisation</h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">Envoi Automatique des DMs</h3>
                          <p className="text-gray-700">
                            Active l'envoi automatique des DMs pour les leads avec un score ≥ 7
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={automation.auto_send_enabled}
                            onChange={(e) => setAutomation({ ...automation, auto_send_enabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      {automation.auto_send_enabled && (
                        <div className="p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
                          <p className="text-sm font-semibold text-yellow-800">
                            ⚠️ Attention: Les DMs seront envoyés automatiquement sans votre validation
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-4">Limite Quotidienne de DMs</h3>
                      <div className="max-w-md">
                        <Label>Nombre maximum de DMs par jour</Label>
                        <div className="flex items-center gap-4 mt-4">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={automation.daily_dm_limit}
                            onChange={(e) => setAutomation({ ...automation, daily_dm_limit: parseInt(e.target.value) })}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-3xl font-bold text-indigo-600 w-16 text-center">
                            {automation.daily_dm_limit}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                          Instagram recommande de ne pas dépasser 50 DMs par jour pour éviter les restrictions
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h3 className="font-bold mb-2 flex items-center gap-2">
                        <span className="text-2xl">💡</span>
                        Fonctionnement de l'Automatisation
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Les leads avec un score ≥ 7 sont traités en priorité</li>
                        <li>• Le système vérifie la limite quotidienne avant chaque envoi</li>
                        <li>• Les DMs sont espacés de 2-5 minutes pour paraître naturels</li>
                        <li>• Vous recevez un rapport quotidien par email</li>
                        <li>• Vous pouvez désactiver l'automatisation à tout moment</li>
                      </ul>
                    </div>

                    <div className="pt-6 border-t">
                      <Button 
                        onClick={async () => {
                          const { error } = await supabase
                            .from('profiles')
                            .update({
                              auto_send_enabled: automation.auto_send_enabled,
                              daily_dm_limit: automation.daily_dm_limit
                            })
                            .eq('id', user?.id)
                          
                          if (error) {
                            alert('Erreur: ' + error.message)
                          } else {
                            alert('Paramètres d\'automatisation sauvegardés! ✅')
                          }
                        }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        Sauvegarder l'Automatisation
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card className="p-8 bg-white">
                  <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-4">Change Password</h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <Label>Current Password</Label>
                          <Input type="password" className="mt-2 h-12" />
                        </div>
                        <div>
                          <Label>New Password</Label>
                          <Input type="password" className="mt-2 h-12" />
                        </div>
                        <div>
                          <Label>Confirm New Password</Label>
                          <Input type="password" className="mt-2 h-12" />
                        </div>
                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                          Update Password
                        </Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="font-bold text-lg mb-4">Two-Factor Authentication</h3>
                      <div className="p-6 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold mb-1">Enhance your security</p>
                            <p className="text-sm text-gray-600">Add an extra layer of protection to your account</p>
                          </div>
                          <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                            Enable 2FA
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="font-bold text-lg mb-4 text-red-600">Danger Zone</h3>
                      <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                        <p className="font-semibold mb-2">Delete Account</p>
                        <p className="text-sm text-gray-600 mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                          Delete My Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
