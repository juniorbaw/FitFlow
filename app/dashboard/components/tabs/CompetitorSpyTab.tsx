'use client'

import { useState } from 'react'
import { Search, TrendingUp, Users, Heart, MessageCircle, BarChart3, Target, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CompetitorAnalysis {
  username: string
  followers: number
  engagement_rate: number
  avg_likes: number
  avg_comments: number
  posting_frequency: string
  best_posting_times: string[]
  top_hashtags: string[]
  content_themes: string[]
  strengths: string[]
  opportunities: string[]
  threat_level: 'high' | 'medium' | 'low'
  recommended_actions: string[]
}

export function CompetitorSpyTab() {
  const [competitorUsername, setCompetitorUsername] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null)

  const analyzeCompetitor = async () => {
    if (!competitorUsername.trim()) return

    setAnalyzing(true)
    setAnalysis(null)
    
    try {
      const response = await fetch('/api/analyze-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: competitorUsername })
      })

      if (!response.ok) throw new Error('Erreur API')

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Erreur lors de l\'analyse. Vérifiez le nom d\'utilisateur.')
    } finally {
      setAnalyzing(false)
    }
  }

  const getThreatColor = (level: string) => {
    if (level === 'high') return 'bg-red-500/20 text-red-500'
    if (level === 'medium') return 'bg-orange-500/20 text-orange-500'
    return 'bg-green-500/20 text-green-500'
  }

  const getThreatLabel = (level: string) => {
    if (level === 'high') return '⚠️ Menace élevée'
    if (level === 'medium') return '⚡ Concurrent actif'
    return '✓ Peu menaçant'
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <Search className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Competitor Spy 🔍</h2>
            <p className="text-gray-400 mb-4">
              Analysez n'importe quel concurrent Instagram : taux d'engagement, hashtags gagnants, horaires de publication, et opportunités à saisir.
            </p>
            <div className="flex gap-2 text-sm text-gray-500">
              <span>📊 Métriques complètes</span>
              <span>•</span>
              <span>🎯 Opportunités détectées</span>
              <span>•</span>
              <span>⚡ Actions recommandées</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Input Section */}
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Username du concurrent (sans @)</label>
            <input
              type="text"
              value={competitorUsername}
              onChange={(e) => setCompetitorUsername(e.target.value.replace('@', ''))}
              placeholder="exemple: coach_fitness_paris"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={analyzeCompetitor}
              disabled={analyzing || !competitorUsername.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyse...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analyser
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">{(analysis.followers / 1000).toFixed(1)}k</div>
              <div className="text-sm text-gray-400">Abonnés</div>
            </Card>

            <Card className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">{analysis.engagement_rate}%</div>
              <div className="text-sm text-gray-400">Taux d'engagement</div>
            </Card>

            <Card className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">{analysis.avg_likes}</div>
              <div className="text-sm text-gray-400">Likes moyens</div>
            </Card>

            <Card className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">{analysis.avg_comments}</div>
              <div className="text-sm text-gray-400">Commentaires moyens</div>
            </Card>
          </div>

          {/* Threat Level */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold mb-1">Niveau de menace concurrentielle</h3>
                <p className="text-sm text-gray-400">Basé sur l'engagement, la croissance et la niche</p>
              </div>
              <Badge className={`px-4 py-2 text-lg font-bold ${getThreatColor(analysis.threat_level)}`}>
                {getThreatLabel(analysis.threat_level)}
              </Badge>
            </div>
          </Card>

          {/* Posting Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Stratégie de publication
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Fréquence</div>
                  <div className="font-semibold">{analysis.posting_frequency}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Meilleurs horaires</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.best_posting_times.map((time, i) => (
                      <Badge key={i} className="bg-blue-500/20 text-blue-500">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Hashtags gagnants
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.top_hashtags.map((tag, i) => (
                  <Badge key={i} className="bg-purple-500/20 text-purple-500">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Content Themes */}
          <Card className="p-6">
            <h3 className="font-bold mb-4">Thèmes de contenu principaux</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.content_themes.map((theme, i) => (
                <Badge key={i} className="bg-orange-500/20 text-orange-500">
                  {theme}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Strengths & Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4 text-green-500">✓ Leurs forces</h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4 text-blue-500">⚡ Opportunités pour vous</h3>
              <ul className="space-y-2">
                {analysis.opportunities.map((opp, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">→</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Recommended Actions */}
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-500">
              <Zap className="w-5 h-5" />
              Actions recommandées pour les battre
            </h3>
            <ul className="space-y-3">
              {analysis.recommended_actions.map((action, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {i + 1}
                  </div>
                  <span className="text-gray-300">{action}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!analysis && !analyzing && (
        <Card className="p-12 text-center bg-white/5">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun concurrent analysé</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Entrez le username d'un concurrent pour obtenir une analyse complète de sa stratégie Instagram.
          </p>
        </Card>
      )}
    </div>
  )
}
