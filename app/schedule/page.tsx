'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function SchedulePage() {
  const router = useRouter()
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    caption: '',
    scheduled_time: '',
    image_url: '',
    tags: ''
  })

  useEffect(() => {
    checkUser()
    loadScheduledPosts()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  const loadScheduledPosts = async () => {
    // Simulated data for demo
    setScheduledPosts([
      {
        id: '1',
        caption: 'Transform your life in 90 days! 💪 Join my exclusive coaching program. Limited spots available.',
        scheduled_time: '2026-02-05T18:00:00',
        status: 'scheduled',
        tags: ['fitness', 'coaching', 'transformation']
      },
      {
        id: '2',
        caption: 'New blog post: 5 Steps to Scale Your Business 🚀 Link in bio!',
        scheduled_time: '2026-02-08T14:30:00',
        status: 'scheduled',
        tags: ['business', 'entrepreneur', 'growth']
      }
    ])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newPost = {
      id: Date.now().toString(),
      caption: formData.caption,
      scheduled_time: formData.scheduled_time,
      status: 'scheduled',
      tags: formData.tags.split(',').map(t => t.trim())
    }
    
    setScheduledPosts([...scheduledPosts, newPost])
    alert('Post scheduled successfully! 🎉')
    setShowForm(false)
    setFormData({ caption: '', scheduled_time: '', image_url: '', tags: '' })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this scheduled post?')) return
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id))
    alert('Scheduled post deleted')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading schedule...</p>
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
                <p className="text-xs text-gray-500">Post Scheduling</p>
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
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              📅 Post Scheduling
            </h1>
            <p className="text-gray-600 text-lg">Schedule Instagram posts in advance and maintain consistent engagement</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📝</div>
              </div>
              <h3 className="text-white/80 text-sm font-semibold mb-1">Scheduled Posts</h3>
              <p className="text-5xl font-extrabold mb-2">{scheduledPosts.length}</p>
              <p className="text-white/70 text-xs">Ready to publish</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🎯</div>
              </div>
              <h3 className="text-white/80 text-sm font-semibold mb-1">Next Post</h3>
              <p className="text-2xl font-extrabold mb-2">
                {scheduledPosts.length > 0 ? new Date(scheduledPosts[0].scheduled_time).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-white/70 text-xs">Coming up soon</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">✨</div>
              </div>
              <h3 className="text-white/80 text-sm font-semibold mb-1">Published</h3>
              <p className="text-5xl font-extrabold mb-2">12</p>
              <p className="text-white/70 text-xs">This month</p>
            </Card>
          </div>

          {/* Schedule Button */}
          <div className="mb-8">
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg text-lg px-8 py-6"
            >
              {showForm ? '✕ Cancel' : '+ Schedule New Post'}
            </Button>
          </div>

          {/* Schedule Form */}
          {showForm && (
            <Card className="p-8 mb-8 border-2 border-indigo-200 shadow-xl bg-white">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-3xl">📸</span>
                Schedule Instagram Post
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="caption" className="text-base font-semibold">Post Caption</Label>
                  <textarea
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full min-h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-base mt-2"
                    placeholder="Write your caption here... Use emojis to boost engagement! 🚀"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.caption.length} characters</p>
                </div>

                <div>
                  <Label htmlFor="scheduled_time" className="text-base font-semibold">Schedule Date & Time</Label>
                  <Input
                    type="datetime-local"
                    id="scheduled_time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    className="mt-2 text-base"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-1">💡 Best times: 6-8 PM for maximum engagement</p>
                </div>

                <div>
                  <Label htmlFor="image_url" className="text-base font-semibold">Image URL (Optional)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    className="mt-2 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="tags" className="text-base font-semibold">Hashtags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="fitness, coaching, motivation"
                    className="mt-2 text-base"
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg py-6"
                  >
                    Schedule Post
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Scheduled Posts List */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">📋</span>
              Upcoming Posts ({scheduledPosts.length})
            </h2>
            
            <div className="space-y-4">
              {scheduledPosts.length === 0 ? (
                <Card className="p-12 text-center border-2 border-dashed border-gray-300 bg-white">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">No scheduled posts</h3>
                  <p className="text-gray-600 mb-6">Start scheduling posts to maintain consistent engagement with your audience!</p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Schedule Your First Post
                  </Button>
                </Card>
              ) : (
                scheduledPosts.map((post) => (
                  <Card key={post.id} className="p-6 hover:shadow-xl transition-all bg-white border-2 border-gray-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                            {post.status === 'scheduled' ? '⏰ Scheduled' : '✓ Published'}
                          </span>
                          <span className="text-sm text-gray-600 font-semibold">
                            {new Date(post.scheduled_time).toLocaleString('en-US', { 
                              dateStyle: 'medium', 
                              timeStyle: 'short' 
                            })}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                          {post.caption}
                        </p>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: string, i: number) => (
                              <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-indigo-50"
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(post.id)}
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
