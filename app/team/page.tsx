'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function TeamPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  const teamMembers = [
    {
      id: '1',
      name: 'You',
      email: 'coach@example.com',
      role: 'Owner',
      avatar: '👤',
      status: 'Active',
      joinedDate: '2025-11-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'Admin',
      avatar: '👩',
      status: 'Active',
      joinedDate: '2025-12-01'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'Member',
      avatar: '👨',
      status: 'Active',
      joinedDate: '2026-01-10'
    }
  ]

  const pendingInvites = [
    {
      id: '1',
      email: 'john@example.com',
      role: 'Member',
      sentDate: '2026-01-28',
      status: 'Pending'
    }
  ]

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setLoading(false)
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate invite
    alert(`Invitation sent to ${inviteEmail}! 📧`)
    setInviteEmail('')
    setShowInviteForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading team...</p>
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
                <span className="text-white font-bold text-2xl">IC</span>
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">InstaCoach Pro</span>
                <p className="text-xs text-gray-500">Team Management</p>
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
              👥 Team Management
            </h1>
            <p className="text-gray-600 text-lg">Collaborate with your team on Instagram automation</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-white/80 text-sm font-semibold mb-1">Team Members</h3>
              <p className="text-5xl font-extrabold">{teamMembers.length}</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-white/80 text-sm font-semibold mb-1">Pending Invites</h3>
              <p className="text-5xl font-extrabold">{pendingInvites.length}</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-white/80 text-sm font-semibold mb-1">Available Seats</h3>
              <p className="text-5xl font-extrabold">2</p>
              <p className="text-white/70 text-xs mt-2">Out of 5 total</p>
            </Card>
          </div>

          {/* Invite Button */}
          <div className="mb-8">
            <Button 
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg text-lg px-8 py-6"
            >
              {showInviteForm ? '✕ Cancel' : '+ Invite Team Member'}
            </Button>
          </div>

          {/* Invite Form */}
          {showInviteForm && (
            <Card className="p-8 mb-8 border-2 border-indigo-200 shadow-xl bg-white">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-3xl">📧</span>
                Invite New Team Member
              </h3>
              <form onSubmit={handleInvite} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@example.com"
                    className="mt-2 text-base h-12"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role" className="text-base font-semibold">Role</Label>
                  <select
                    id="role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg mt-2 h-12"
                  >
                    <option value="member">Member - View and execute campaigns</option>
                    <option value="admin">Admin - Full access except billing</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-2">
                    Members can view and manage campaigns. Admins have full access.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg py-6"
                  >
                    Send Invitation
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowInviteForm(false)}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Team Members */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">👥</span>
              Team Members ({teamMembers.length})
            </h2>
            
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="p-6 hover:shadow-xl transition-all bg-white border-2 border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-3xl">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{member.name}</h3>
                        <p className="text-gray-600">{member.email}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            member.role === 'Owner' 
                              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700'
                              : member.role === 'Admin'
                              ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'
                          }`}>
                            {member.role}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            {member.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {member.role !== 'Owner' && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-indigo-50">
                          Edit Role
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 hover:border-red-300">
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-3xl">⏳</span>
                Pending Invitations ({pendingInvites.length})
              </h2>
              
              <div className="space-y-4">
                {pendingInvites.map((invite) => (
                  <Card key={invite.id} className="p-6 bg-yellow-50 border-2 border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg text-gray-900">{invite.email}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">
                            {invite.role}
                          </span>
                          <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold">
                            {invite.status}
                          </span>
                          <span className="text-sm text-gray-600">
                            Sent {new Date(invite.sentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-indigo-50">
                          Resend
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 hover:border-red-300">
                          Cancel Invite
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upgrade Notice */}
          <Card className="p-8 mt-8 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
            <div className="flex items-start gap-6">
              <div className="text-6xl">🚀</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Need More Team Seats?</h3>
                <p className="text-indigo-100 mb-4 text-lg">
                  Upgrade to Enterprise plan to add unlimited team members and unlock advanced collaboration features.
                </p>
                <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                  Upgrade to Enterprise →
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
