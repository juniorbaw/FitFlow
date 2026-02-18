'use client'

import { useState } from 'react'
import { Calendar, Clock, TrendingUp, Zap, CheckCircle, Plus, Image } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ScheduledPost {
  id: string
  content: string
  scheduled_time: string
  ai_score: number
  optimal_time: boolean
  estimated_reach: string
}

export function SmartCalendarTab() {
  const [content, setContent] = useState('')
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [bestTimes, setBestTimes] = useState<string[]>([])

  const getBestTimes = async () => {
    try {
      const response = await fetch('/api/get-best-times')
      const data = await response.json()
      setBestTimes(data.times)
    } catch (error) {
      console.error('Error fetching best times:', error)
    }
  }

  const schedulePost = async (time: string) => {
    if (!content.trim()) return

    setAnalyzing(true)

    try {
      const response = await fetch('/api/schedule-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, scheduledTime: time })
      })

      const data = await response.json()
      setScheduledPosts([...scheduledPosts, data])
      setContent('')
    } catch (error) {
      console.error('Error scheduling post:', error)
      alert('Erreur lors de la planification')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-orange-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Smart Calendar 📅</h2>
            <p className="text-gray-400 mb-4">
              L'IA analyse votre audience et suggère les meilleurs moments pour publier. Planifiez vos posts et obtenez un score prédictif avant publication.
            </p>
            <div className="flex gap-2 text-sm text-gray-500">
              <span>🎯 Analyse d'audience</span>
              <span>•</span>
              <span>⏰ Meilleurs horaires</span>
              <span>•</span>
              <span>📊 Score prédictif</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Best Times Recommendation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold mb-1">Meilleurs moments pour publier</h3>
            <p className="text-sm text-gray-400">Basé sur l'activité de votre audience (analyse 30 derniers jours)</p>
          </div>
          <Button
            onClick={getBestTimes}
            className="bg-green-500 hover:bg-green-600"
          >
            <Zap className="w-4 h-4 mr-2" />
            Analyser mon audience
          </Button>
        </div>

        {bestTimes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bestTimes.map((time, i) => (
              <div
                key={i}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center"
              >
                <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="font-bold text-green-500">{time}</div>
                <div className="text-xs text-gray-400 mt-1">Pic d'activité</div>
              </div>
            ))}
          </div>
        )}

        {bestTimes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Cliquez pour analyser votre audience et découvrir vos meilleurs créneaux</p>
          </div>
        )}
      </Card>

      {/* Create Post */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">Planifier un post</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Contenu du post</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez votre caption ici... (hashtags, emojis, CTA)"
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 resize-none"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>{content.length} caractères</span>
              <span>💡 Tip: Incluez hashtags et CTA pour un meilleur score</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Heure de publication</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Maintenant', '18h00', '20h00', 'Personnalisé'].map((time, i) => (
                <Button
                  key={i}
                  onClick={() => time !== 'Personnalisé' && schedulePost(time)}
                  disabled={!content.trim() || analyzing}
                  className="bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <div className="flex-1 text-sm">
              <div className="font-semibold">Analyse IA avant publication</div>
              <div className="text-gray-400">Le contenu sera analysé et vous recevrez un score prédictif</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Scheduled Posts */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">Posts planifiés ({scheduledPosts.length})</h3>

        {scheduledPosts.length > 0 ? (
          <div className="space-y-3">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getScoreColor(post.ai_score)}>
                        Score: {post.ai_score}/100
                      </Badge>
                      {post.optimal_time && (
                        <Badge className="bg-green-500/20 text-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Heure optimale
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{post.content}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold">{post.scheduled_time}</div>
                    <div className="text-xs text-gray-400">{post.estimated_reach} portée estimée</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="bg-white/10 hover:bg-white/20">
                    Modifier
                  </Button>
                  <Button size="sm" className="bg-red-500/20 text-red-500 hover:bg-red-500/30">
                    Annuler
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>Aucun post planifié</p>
            <p className="text-sm mt-1">Créez votre premier post ci-dessus</p>
          </div>
        )}
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-500">{scheduledPosts.length}</div>
          <div className="text-sm text-gray-400 mt-1">Posts en attente</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-500">
            {scheduledPosts.filter(p => p.optimal_time).length}
          </div>
          <div className="text-sm text-gray-400 mt-1">À heure optimale</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-500">
            {scheduledPosts.length > 0
              ? Math.round(scheduledPosts.reduce((sum, p) => sum + p.ai_score, 0) / scheduledPosts.length)
              : 0}
          </div>
          <div className="text-sm text-gray-400 mt-1">Score moyen</div>
        </Card>
      </div>
    </div>
  )
}
