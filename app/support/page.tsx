'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Send, 
  Star,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Bug,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'positive'

interface Feedback {
  id: string
  type: FeedbackType
  message: string
  rating?: number
  date: Date
  status: 'submitted' | 'in_review' | 'resolved'
}

export default function SupportPage() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feature')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      type: 'feature',
      message: 'Pouvoir programmer les DMs à l\'avance',
      date: new Date(Date.now() - 86400000 * 2),
      status: 'in_review'
    }
  ])

  const handleSubmit = async () => {
    if (!message.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      type: feedbackType,
      message: message.trim(),
      rating: feedbackType === 'positive' ? rating : undefined,
      date: new Date(),
      status: 'submitted'
    }
    
    setFeedbacks([newFeedback, ...feedbacks])
    setMessage('')
    setRating(0)
    setIsSubmitting(false)
    setShowSuccess(true)
    
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const getFeedbackIcon = (type: FeedbackType) => {
    switch(type) {
      case 'bug': return <Bug className="w-5 h-5 text-[#FF5252]" />
      case 'feature': return <Lightbulb className="w-5 h-5 text-[#FFB800]" />
      case 'improvement': return <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
      case 'positive': return <ThumbsUp className="w-5 h-5 text-[#00D26A]" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'submitted':
        return <Badge className="bg-[rgba(255,184,0,0.2)] text-yellow-300">En attente</Badge>
      case 'in_review':
        return <Badge className="bg-[rgba(59,130,246,0.2)] text-blue-300">En cours</Badge>
      case 'resolved':
        return <Badge variant="green">Résolu</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.07)] bg-[rgba(0,0,0,0.3)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] bg-clip-text text-transparent">
            FitFlow
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]">
              Retour au Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[rgba(255,92,0,0.1)] border border-[rgba(255,92,0,0.3)] rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#FF5C00]" />
            <span className="text-sm text-[#FF5C00] font-semibold">Programme Testeurs Bêta</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[#888] bg-clip-text text-transparent">
            Aide-nous à améliorer FitFlow
          </h1>
          <p className="text-xl text-[#888] max-w-2xl mx-auto">
            Ton avis compte énormément ! Partage tes idées, reporte des bugs, ou dis-nous simplement ce que tu penses 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Feedback Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#FF5C00]" />
                Ton feedback
              </h2>

              {/* Feedback Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => setFeedbackType('bug')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    feedbackType === 'bug'
                      ? 'border-[#FF5252] bg-[rgba(255,82,82,0.1)]'
                      : 'border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,82,82,0.3)]'
                  }`}
                >
                  <Bug className="w-6 h-6 text-[#FF5252] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">Bug</p>
                </button>

                <button
                  onClick={() => setFeedbackType('feature')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    feedbackType === 'feature'
                      ? 'border-[#FFB800] bg-[rgba(255,184,0,0.1)]'
                      : 'border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,184,0,0.3)]'
                  }`}
                >
                  <Lightbulb className="w-6 h-6 text-[#FFB800] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">Idée</p>
                </button>

                <button
                  onClick={() => setFeedbackType('improvement')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    feedbackType === 'improvement'
                      ? 'border-[#3B82F6] bg-[rgba(59,130,246,0.1)]'
                      : 'border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(59,130,246,0.3)]'
                  }`}
                >
                  <TrendingUp className="w-6 h-6 text-[#3B82F6] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">Amélioration</p>
                </button>

                <button
                  onClick={() => setFeedbackType('positive')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    feedbackType === 'positive'
                      ? 'border-[#00D26A] bg-[rgba(0,210,106,0.1)]'
                      : 'border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(0,210,106,0.3)]'
                  }`}
                >
                  <ThumbsUp className="w-6 h-6 text-[#00D26A] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">J'adore</p>
                </button>
              </div>

              {/* Rating (only for positive feedback) */}
              {feedbackType === 'positive' && (
                <div className="mb-6">
                  <label className="text-sm text-[#888] mb-3 block">Note FitFlow :</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating ? 'fill-[#FFB800] text-[#FFB800]' : 'text-[#444]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="mb-6">
                <label className="text-sm text-[#888] mb-2 block">
                  {feedbackType === 'bug' && 'Décris le bug que tu as rencontré'}
                  {feedbackType === 'feature' && 'Quelle feature aimerais-tu voir ?'}
                  {feedbackType === 'improvement' && 'Comment peut-on améliorer FitFlow ?'}
                  {feedbackType === 'positive' && 'Qu\'est-ce que tu aimes le plus ?'}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    feedbackType === 'bug' ? 'Ex: Quand je clique sur "Leads", la page ne charge pas...' :
                    feedbackType === 'feature' ? 'Ex: J\'aimerais pouvoir programmer mes DMs à l\'avance...' :
                    feedbackType === 'improvement' ? 'Ex: Le dashboard serait plus clair avec des graphiques...' :
                    'Ex: L\'IA répond hyper bien, mes leads adorent !'
                  }
                  className="w-full h-32 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 text-white placeholder-[#666] focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/30 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-[#666] mt-2">{message.length}/500 caractères</p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!message.trim() || isSubmitting}
                className="w-full bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] hover:from-[#FF7A2D] hover:to-[#FFA05A] text-white font-semibold h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Envoyer mon feedback
                  </>
                )}
              </Button>

              {showSuccess && (
                <div className="mt-4 p-4 bg-[rgba(0,210,106,0.1)] border border-[rgba(0,210,106,0.3)] rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00D26A]" />
                  <p className="text-[#00D26A] font-semibold">Merci ! Ton feedback a été envoyé 🎉</p>
                </div>
              )}
            </Card>

            {/* My Feedback History */}
            <Card className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FF5C00]" />
                Mon historique ({feedbacks.length})
              </h3>
              
              <div className="space-y-3">
                {feedbacks.length === 0 ? (
                  <div className="text-center py-8 text-[#666]">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Aucun feedback envoyé pour l'instant</p>
                  </div>
                ) : (
                  feedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getFeedbackIcon(feedback.type)}
                          <span className="text-sm font-semibold text-white capitalize">{feedback.type}</span>
                        </div>
                        {getStatusBadge(feedback.status)}
                      </div>
                      <p className="text-sm text-[#888] mb-2">{feedback.message}</p>
                      <p className="text-xs text-[#666]">
                        {feedback.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right: Stats & Info */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[rgba(255,92,0,0.1)] to-[rgba(255,138,61,0.05)] border-[rgba(255,92,0,0.3)] p-6">
              <h3 className="text-lg font-bold text-white mb-4">🎯 Ton impact</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-[#FF5C00]">{feedbacks.length}</p>
                  <p className="text-sm text-[#888]">Feedback envoyés</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#00D26A]">{feedbacks.filter(f => f.status === 'resolved').length}</p>
                  <p className="text-sm text-[#888]">Idées implémentées</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] p-6">
              <h3 className="text-lg font-bold text-white mb-3">💡 Pourquoi ton avis compte</h3>
              <div className="space-y-3 text-sm text-[#888]">
                <p>✅ Tu fais partie des <strong className="text-white">50 premiers testeurs</strong></p>
                <p>✅ Tes idées <strong className="text-white">façonnent le produit</strong></p>
                <p>✅ Accès <strong className="text-white">gratuit à vie</strong> pour les bêta-testeurs</p>
                <p>✅ Priorité sur les <strong className="text-white">nouvelles features</strong></p>
              </div>
            </Card>

            <Card className="bg-[rgba(139,92,246,0.05)] border-[rgba(139,92,246,0.2)] p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                Prochainement
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-purple-300">
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
                  <span>Statistiques avancées</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
                  <span>A/B testing des messages</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
                  <span>Intégration TikTok</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
