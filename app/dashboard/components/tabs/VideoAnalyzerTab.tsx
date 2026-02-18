'use client'

import { useState } from 'react'
import { Upload, Video, TrendingUp, Clock, Target, Zap, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface VideoAnalysis {
  score: number
  verdict: 'excellent' | 'good' | 'average' | 'poor'
  hook_quality: number
  storytelling: number
  cta_strength: number
  duration_optimal: boolean
  duration_current: string
  duration_recommended: string
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  viral_potential: 'high' | 'medium' | 'low'
  best_posting_time: string
}

export function VideoAnalyzerTab() {
  const [videoUrl, setVideoUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null)

  const analyzeVideo = async () => {
    if (!videoUrl.trim()) return

    setAnalyzing(true)
    setAnalysis(null)
    
    try {
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      })

      if (!response.ok) throw new Error('Erreur API')

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Erreur lors de l\'analyse. Réessayez.')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getVerdictLabel = (verdict: string) => {
    const labels = {
      excellent: 'Excellent - Potentiel viral',
      good: 'Bon - Quelques optimisations',
      average: 'Moyen - Améliorations nécessaires',
      poor: 'Faible - Refonte recommandée'
    }
    return labels[verdict as keyof typeof labels]
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Video className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Video Analyzer 🎥</h2>
            <p className="text-gray-400 mb-4">
              Uploadez l'URL de votre Reel Instagram et obtenez une analyse IA complète : hook, storytelling, CTA, durée optimale, et potentiel viral.
            </p>
            <div className="flex gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Analyse en 10 secondes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Score de viralité
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Suggestions concrètes
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Input Section */}
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">URL du Reel Instagram</label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={analyzeVideo}
              disabled={analyzing || !videoUrl.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
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
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 text-center">
              <div className="text-5xl font-bold mb-2" style={{ color: getScoreColor(analysis.score) }}>
                {analysis.score}
              </div>
              <div className="text-sm text-gray-400">Score global</div>
              <div className="text-xs text-gray-500 mt-1">{getVerdictLabel(analysis.verdict)}</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: getScoreColor(analysis.hook_quality) }}>
                {analysis.hook_quality}/100
              </div>
              <div className="text-sm text-gray-400">Hook (3 premières sec)</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: getScoreColor(analysis.storytelling) }}>
                {analysis.storytelling}/100
              </div>
              <div className="text-sm text-gray-400">Storytelling</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: getScoreColor(analysis.cta_strength) }}>
                {analysis.cta_strength}/100
              </div>
              <div className="text-sm text-gray-400">Call-to-Action</div>
            </Card>
          </div>

          {/* Duration Analysis */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="font-semibold">Durée actuelle : {analysis.duration_current}</div>
                  <div className="text-sm text-gray-400">Durée recommandée : {analysis.duration_recommended}</div>
                </div>
              </div>
              {analysis.duration_optimal ? (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Durée optimale</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-500">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">À ajuster</span>
                </div>
              )}
            </div>
          </Card>

          {/* Strengths, Weaknesses, Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-green-500">
                <CheckCircle className="w-5 h-5" />
                Points forts
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-500">
                <XCircle className="w-5 h-5" />
                Points faibles
              </h3>
              <ul className="space-y-2">
                {analysis.weaknesses.map((weakness, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-orange-500 mt-1">⚠</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-500">
                <Zap className="w-5 h-5" />
                Suggestions
              </h3>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">→</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Viral Potential & Best Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Potentiel viral
              </h3>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg font-bold ${
                  analysis.viral_potential === 'high' ? 'bg-green-500/20 text-green-500' :
                  analysis.viral_potential === 'medium' ? 'bg-orange-500/20 text-orange-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {analysis.viral_potential === 'high' ? 'ÉLEVÉ 🚀' :
                   analysis.viral_potential === 'medium' ? 'MOYEN 📈' :
                   'FAIBLE 📉'}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Meilleur moment pour publier
              </h3>
              <div className="text-lg font-semibold text-orange-500">
                {analysis.best_posting_time}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!analysis && !analyzing && (
        <Card className="p-12 text-center bg-white/5">
          <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucune vidéo analysée</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Collez l'URL d'un Reel Instagram ci-dessus pour obtenir une analyse détaillée avec Gemini AI.
          </p>
        </Card>
      )}
    </div>
  )
}
