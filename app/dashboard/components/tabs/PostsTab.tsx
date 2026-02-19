'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ExternalLink } from 'lucide-react'

export function PostsTab() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const leadsData = posts.map(post => ({
    caption: (post.caption?.substring(0, 30) || 'Sans titre') + '...',
    leads: post.total_leads || 0,
  }))

  const revenueData = posts.map(post => ({
    caption: (post.caption?.substring(0, 30) || 'Sans titre') + '...',
    revenue: post.total_revenue || 0,
  }))

  if (loading) {
    return <div className="text-center py-12 text-[#888]">Chargement...</div>
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📸</div>
        <h3 className="text-lg font-semibold text-white mb-2">Aucun post tracké pour l'instant</h3>
        <p className="text-sm text-[#888]">Les performances de vos posts Instagram apparaîtront ici.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
          <h3 className="text-lg font-semibold text-white mb-4">Leads par post</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leadsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#888" />
              <YAxis type="category" dataKey="caption" stroke="#888" width={100} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="leads" fill="#FF5C00" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue par post</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="#888" />
              <YAxis type="category" dataKey="caption" stroke="#888" width={100} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="revenue" fill="#00D26A" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Posts Table */}
      <Card className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance des posts</h3>
          <div className="space-y-4">
            {posts.map((post) => {
              const conversionRate = post.total_leads > 0 ? ((post.total_conversions || 0) / post.total_leads) * 100 : 0

              return (
                <div key={post.id} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="blue">{post.post_type || 'post'}</Badge>
                        {post.post_url && (
                          <a href={post.post_url} target="_blank" rel="noopener noreferrer" className="text-[#FF5C00] hover:text-[#FF7A2D] text-sm flex items-center gap-1">
                            Voir le post
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-white font-medium mb-1">{post.caption || 'Sans titre'}</p>
                      <div className="flex items-center gap-4 text-sm text-[#888]">
                        <span>{post.total_leads || 0} leads</span>
                        <span>•</span>
                        <span>{post.total_conversions || 0} conversions</span>
                        <span>•</span>
                        <span>{post.total_revenue || 0}€ revenue</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#888] mb-1">
                        <span>Score moyen</span>
                        <span>{post.avg_score || 0}/10</span>
                      </div>
                      <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D]" style={{ width: `${((post.avg_score || 0) / 10) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#888] mb-1">
                        <span>Taux de conversion</span>
                        <span>{conversionRate.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#00D26A] to-[#00F77C]" style={{ width: `${conversionRate}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
