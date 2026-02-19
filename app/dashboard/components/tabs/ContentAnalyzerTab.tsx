'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Target,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Zap,
  BarChart3,
  Instagram,
  AlertCircle,
  CheckCircle2,
  Lightbulb
} from 'lucide-react'

interface ContentAnalysis {
  score: number
  verdict: 'excellent' | 'good' | 'average' | 'poor'
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  bestTimeToPost: string
  estimatedReach: string
  engagementPotential: 'high' | 'medium' | 'low'
}

export function ContentAnalyzerTab() {
  const [postContent, setPostContent] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null)

  const analyzeContent = async () => {
    if (!postContent.trim()) return

    setAnalyzing(true)

    try {
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: postContent })
      })

      if (!response.ok) {
        throw new Error('Erreur API')
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (error) {
      console.error('Analysis error:', error)
      // Fallback if API fails
      setAnalysis({
        score: 0,
        verdict: 'poor',
        strengths: [],
        weaknesses: ['Impossible de contacter le service d\'analyse. Réessaie plus tard.'],
        suggestions: ['Vérifie ta connexion et réessaie.'],
        bestTimeToPost: '—',
        estimatedReach: '—',
        engagementPotential: 'low'
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch(verdict) {
      case 'excellent': return 'text-[#00D26A]'
      case 'good': return 'text-[#4CAF50]'
      case 'average': return 'text-[#FFA500]'
      case 'poor': return 'text-[#FF5252]'
      default: return 'text-[#888]'
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch(verdict) {
      case 'excellent':
      case 'good':
        return <CheckCircle2 className="w-5 h-5" />
      case 'average':
        return <AlertCircle className="w-5 h-5" />
      case 'poor':
        return <ThumbsDown className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-[#FF5C00]" />
            Analyseur de Contenu IA
          </h2>
          <p className="text-[#888]">
            Optimise tes posts Instagram avant de publier. L'IA analyse ton contenu et te donne des conseils pour maximiser ton engagement 🚀
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <Card className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-white font-semibold flex items-center gap-2">
                <Instagram className="w-5 h-5 text-[#FF5C00]" />
                Ton futur post
              </label>
              <Badge variant="outline" className="text-xs text-[#888]">
                {postContent.length}/2200
              </Badge>
            </div>
            
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Colle ici le texte de ton futur post Instagram...

Exemple:
🔥 3 EXERCICES POUR DES ABDOS VISIBLES

1️⃣ Crunch inversé (3x15)
2️⃣ Mountain climbers (3x30s)
3️⃣ Planche (3x45s)

💪 Programme complet en bio !

Quel est ton exercice préféré ?"
              className="w-full h-[400px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 text-white placeholder-[#666] focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/30 resize-none text-sm leading-relaxed custom-scrollbar"
              maxLength={2200}
            />

            <div className="flex items-center gap-3">
              <Button
                onClick={analyzeContent}
                disabled={!postContent.trim() || analyzing}
                className="flex-1 bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] hover:from-[#FF7A2D] hover:to-[#FFA05A] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed h-12"
              >
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyser avec l'IA
                  </>
                )}
              </Button>
              
              {postContent && (
                <Button
                  onClick={() => {
                    setPostContent('')
                    setAnalysis(null)
                  }}
                  variant="outline"
                  className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-[#888] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                >
                  Effacer
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Right: Analysis Result */}
        <div className="space-y-4">
          {!analysis ? (
            <Card className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] p-8 flex flex-col items-center justify-center h-full min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-[rgba(255,92,0,0.1)] flex items-center justify-center mb-4">
                <BarChart3 className="w-10 h-10 text-[#FF5C00]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Prêt à analyser ?</h3>
              <p className="text-[#888] text-center max-w-sm">
                Colle ton texte à gauche et clique sur "Analyser" pour obtenir des conseils personnalisés de l'IA
              </p>
            </Card>
          ) : (
            <>
              {/* Score Card */}
              <Card className="bg-gradient-to-br from-[rgba(255,92,0,0.15)] to-[rgba(255,138,61,0.05)] border-[rgba(255,92,0,0.3)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-[#888] mb-1">Score de qualité</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-4xl font-bold ${getVerdictColor(analysis.verdict)}`}>
                        {analysis.score}/100
                      </span>
                      <div className={`flex items-center gap-1.5 ${getVerdictColor(analysis.verdict)}`}>
                        {getVerdictIcon(analysis.verdict)}
                        <span className="font-semibold capitalize">{analysis.verdict}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-20 h-20 rounded-full bg-[rgba(255,92,0,0.1)] flex items-center justify-center">
                    <TrendingUp className="w-10 h-10 text-[#FF5C00]" />
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF5C00] to-[#00D26A] transition-all duration-1000"
                    style={{ width: `${analysis.score}%` }}
                  />
                </div>
              </Card>

              {/* Insights Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#FF5C00]" />
                    <span className="text-xs text-[#888] font-semibold">Meilleur moment</span>
                  </div>
                  <p className="text-white font-semibold">{analysis.bestTimeToPost}</p>
                </Card>
                
                <Card className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#FF5C00]" />
                    <span className="text-xs text-[#888] font-semibold">Portée estimée</span>
                  </div>
                  <p className="text-white font-semibold">{analysis.estimatedReach}</p>
                </Card>
              </div>

              {/* Strengths */}
              <Card className="bg-[rgba(0,210,106,0.05)] border-[rgba(0,210,106,0.2)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ThumbsUp className="w-5 h-5 text-[#00D26A]" />
                  <h3 className="text-white font-semibold">Points forts</h3>
                </div>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#00D26A]">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Weaknesses */}
              {analysis.weaknesses.length > 0 && (
                <Card className="bg-[rgba(255,82,82,0.05)] border-[rgba(255,82,82,0.2)] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-[#FF5252]" />
                    <h3 className="text-white font-semibold">À améliorer</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#FF5252]">
                        <span className="text-lg leading-none">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Suggestions */}
              <Card className="bg-[rgba(139,92,246,0.05)] border-[rgba(139,92,246,0.2)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-[#8B5CF6]" />
                  <h3 className="text-white font-semibold">Suggestions IA</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#D4C5F9]">
                      <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8B5CF6]" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Action Button */}
              <Button
                className="w-full bg-gradient-to-r from-[#00D26A] to-[#00B85C] hover:from-[#00B85C] hover:to-[#009F4D] text-white font-semibold h-12"
                onClick={() => {
                  // Copy to clipboard or open Instagram
                  alert('✅ Parfait ! Ton post est optimisé. Va le publier sur Instagram ! 🚀')
                }}
              >
                <Instagram className="w-5 h-5 mr-2" />
                Post optimisé ! Publier sur Instagram
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <Card className="bg-[rgba(255,92,0,0.05)] border-[rgba(255,92,0,0.2)] p-5">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#FF5C00]" />
          Astuces pour un post qui cartonne
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">🎯 Accroche en 3 secondes</p>
            <p className="text-xs text-[#888]">Les 2 premières lignes sont cruciales pour capter l'attention</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">💬 Pose une question</p>
            <p className="text-xs text-[#888]">Termine par une question pour booster les commentaires</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">⏰ Timing parfait</p>
            <p className="text-xs text-[#888]">Poste entre 11h-13h ou 18h-20h pour plus de visibilité</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
