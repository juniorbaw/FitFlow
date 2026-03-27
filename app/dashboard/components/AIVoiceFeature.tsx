'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mic, 
  Sparkles, 
  Volume2, 
  Download,
  Play,
  Pause,
  TrendingUp,
  Zap,
  MessageSquare
} from 'lucide-react'

export function AIVoiceFeature() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const generateVoiceNote = async () => {
    setIsGenerating(true)
    // Simulate AI voice generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsGenerating(false)
    setHasGenerated(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <Card className="bg-gradient-to-br from-[rgba(139,92,246,0.1)] to-[rgba(99,102,241,0.05)] border-[rgba(139,92,246,0.3)] p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-500 rounded-full blur-3xl animate-pulse delay-75"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">AI Voice Notes</h3>
                <Badge className="bg-[rgba(255,184,0,0.2)] text-yellow-300 text-xs">
                  NOUVEAU
                </Badge>
              </div>
              <p className="text-sm text-purple-200">Réponses vocales automatiques ultra-personnalisées</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 mb-6">
          <p className="text-sm text-purple-100 leading-relaxed mb-3">
            <strong className="text-white">L'arme secrète</strong> : Au lieu d'envoyer un DM texte classique, 
            FitFlow peut générer une <strong className="text-white">note vocale IA avec TA voix</strong> 
            qui répond au lead de manière ultra-personnalisée.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-[rgba(0,210,106,0.2)] text-green-300 border-none">
              <TrendingUp className="w-3 h-3 mr-1" />
              +68% engagement
            </Badge>
            <Badge className="bg-[rgba(59,130,246,0.2)] text-blue-300 border-none">
              <Zap className="w-3 h-3 mr-1" />
              3× plus de réponses
            </Badge>
            <Badge className="bg-[rgba(255,92,0,0.2)] text-orange-300 border-none">
              <MessageSquare className="w-3 h-3 mr-1" />
              Hyper personnalisé
            </Badge>
          </div>
        </div>

        {/* Voice Note Generator */}
        {!hasGenerated ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-[rgba(139,92,246,0.2)] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-[#8B5CF6]" />
            </div>
            <h4 className="text-white font-semibold mb-2">Génère ta première voice note IA</h4>
            <p className="text-sm text-purple-200 mb-6 max-w-md mx-auto">
              L'IA va créer une note vocale personnalisée basée sur le profil du lead
            </p>
            <Button
              onClick={generateVoiceNote}
              disabled={isGenerating}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white font-semibold h-12 px-8"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Générer une Voice Note IA
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Audio Player */}
            <div className="bg-[rgba(0,0,0,0.4)] rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white fill-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-2">Voice Note pour @marie_fit92</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] w-1/3 transition-all"></div>
                    </div>
                    <span className="text-xs text-purple-200 font-mono">0:08 / 0:23</span>
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <div className="bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)] rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-purple-300 mt-0.5" />
                  <p className="text-xs font-semibold text-purple-200">Transcription :</p>
                </div>
                <p className="text-sm text-white leading-relaxed italic">
                  "Salut Marie ! C'est super de voir ton intérêt pour le programme. 
                  J'ai vu que tu cherches à prendre de la masse - j'ai justement aidé 
                  plus de 40 personnes avec des résultats incroyables. Le programme est 
                  à 197€ et inclut nutrition + training personnalisé. Je t'envoie le lien 
                  pour réserver ta place ?"
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-[rgba(255,92,0,0.1)] hover:bg-[rgba(255,92,0,0.2)] text-[#FF5C00] border border-[rgba(255,92,0,0.3)]">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-[#00D26A] to-[#00B85C] hover:from-[#00B85C] hover:to-[#009F4D] text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Envoyer à @marie_fit92
              </Button>
            </div>

            {/* Info */}
            <div className="bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.1)] rounded-lg p-4">
              <p className="text-xs text-purple-200 leading-relaxed">
                💡 <strong className="text-white">Astuce Pro :</strong> Les voice notes ont un taux 
                d'ouverture de 98% contre 22% pour les DMs texte. C'est l'arme secrète des coachs qui 
                convertissent à +40%.
              </p>
            </div>
          </div>
        )}

        {/* Coming Soon Features */}
        <div className="mt-6 pt-6 border-t border-[rgba(139,92,246,0.2)]">
          <p className="text-xs font-semibold text-purple-200 mb-3">🚀 Prochainement :</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-purple-100">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>Clonage de ta vraie voix (100% personnalisé)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-100">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>Voice notes en plusieurs langues</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-100">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>A/B testing vocal automatique</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
