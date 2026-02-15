'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  MessageSquare,
  Instagram,
  Zap,
  Target,
  ArrowRight,
  BarChart3,
  Clock
} from 'lucide-react'

const DEMO_STEPS = [
  {
    id: 1,
    time: '0:00',
    title: '1. Instagram commente ton post',
    description: '@marie_fit92 : "Combien coûte ton programme ?"',
    icon: Instagram,
    color: 'from-[#E1306C] to-[#C13584]'
  },
  {
    id: 2,
    time: '0:03',
    title: '2. IA FitFlow analyse le lead',
    description: 'Score: 9/10 | Intent: Achat | Budget: Confirmé',
    icon: Sparkles,
    color: 'from-[#8B5CF6] to-[#6366F1]'
  },
  {
    id: 3,
    time: '0:05',
    title: '3. DM automatique personnalisé',
    description: '"Salut Marie ! Mon programme est à 197€..."',
    icon: MessageSquare,
    color: 'from-[#3B82F6] to-[#2563EB]'
  },
  {
    id: 4,
    time: '0:12',
    title: '4. Marie répond positivement',
    description: '"Ok parfait, comment je m\'inscris ?"',
    icon: TrendingUp,
    color: 'from-[#10B981] to-[#059669]'
  },
  {
    id: 5,
    time: '0:15',
    title: '5. Conversion = +197€',
    description: 'Nouveau client ajouté au dashboard',
    icon: Target,
    color: 'from-[#00D26A] to-[#00B85C]'
  }
]

const STATS = [
  { label: 'Temps économisé', value: '12h/semaine', icon: Clock },
  { label: 'Taux de conversion', value: '37%', icon: TrendingUp },
  { label: 'Leads détectés', value: '+250%', icon: BarChart3 },
  { label: 'Vitesse de réponse', value: '< 30s', icon: Zap }
]

export default function DemoPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayDemo = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }

    setIsPlaying(true)
    setCurrentStep(0)

    // Auto-play through steps
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= DEMO_STEPS.length) {
        clearInterval(interval)
        setIsPlaying(false)
        return
      }
      setCurrentStep(step)
    }, 3000)
  }
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-[rgba(255,255,255,0.07)] bg-[rgba(0,0,0,0.3)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Fit<span className="text-[#FF5C00]">Flow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/support">
              <Button variant="outline" className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]">
                Support
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] hover:from-[#FF7A2D] hover:to-[#FFA05A] text-white">
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <Badge className="bg-[rgba(255,92,0,0.1)] text-[#FF5C00] border-[rgba(255,92,0,0.3)] mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            Démo interactive
          </Badge>
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-white via-white to-[#888] bg-clip-text text-transparent">
            De Commentaire à Client
            <br />
            <span className="text-[#FF5C00]">En 15 Secondes</span>
          </h1>
          <p className="text-xl text-[#888] max-w-2xl mx-auto mb-8">
            Regarde comment FitFlow transforme un simple commentaire Instagram en client payant, sans que tu lèves le petit doigt
          </p>

          {/* Play Button */}
          <Button
            onClick={handlePlayDemo}
            className="bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] hover:from-[#FF7A2D] hover:to-[#FFA05A] text-white h-14 px-8 text-lg font-semibold"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Lancer la démo
              </>
            )}
          </Button>
        </div>

        {/* Demo Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-16">
          {DEMO_STEPS.map((step, idx) => {
            const Icon = step.icon
            const isActive = idx === currentStep && isPlaying
            const isCompleted = idx < currentStep

            return (
              <Card
                key={step.id}
                className={`p-6 transition-all duration-500 ${
                  isActive
                    ? 'bg-gradient-to-br ' + step.color + ' border-transparent scale-105 shadow-2xl'
                    : isCompleted
                    ? 'bg-[rgba(0,210,106,0.05)] border-[rgba(0,210,106,0.2)]'
                    : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-white/20'
                      : isCompleted
                      ? 'bg-[#00D26A]'
                      : 'bg-[rgba(255,255,255,0.05)]'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#888]'}`} />
                    )}
                  </div>
                  <span className={`text-xs font-mono ${isActive || isCompleted ? 'text-white' : 'text-[#666]'}`}>
                    {step.time}
                  </span>
                </div>
                <h3 className={`font-bold mb-2 text-sm ${isActive || isCompleted ? 'text-white' : 'text-[#888]'}`}>
                  {step.title}
                </h3>
                <p className={`text-xs ${isActive ? 'text-white/80' : isCompleted ? 'text-[#00D26A]' : 'text-[#666]'}`}>
                  {step.description}
                </p>
              </Card>
            )
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] p-6 text-center">
                <Icon className="w-8 h-8 text-[#FF5C00] mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-[#888]">{stat.label}</p>
              </Card>
            )
          })}
        </div>

        {/* Video */}
        <Card className="bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] p-8 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Démo vidéo complète</h2>
              <p className="text-sm text-[#888]">5 min pour tout comprendre</p>
            </div>
          </div>
          <div className="aspect-video bg-[#000] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]">
            <iframe 
              src="/videos/explainer.html" 
              className="w-full h-full"
              title="FitFlow Explainer"
            />
          </div>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-[rgba(255,92,0,0.1)] to-[rgba(255,138,61,0.05)] border-[rgba(255,92,0,0.2)] p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à automatiser ton business ?
          </h2>
          <p className="text-xl text-[#888] mb-8 max-w-2xl mx-auto">
            Rejoins les coachs qui génèrent +3-5 clients/semaine avec FitFlow
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] hover:from-[#FF7A2D] hover:to-[#FFA05A] text-white h-14 px-8 text-lg font-semibold">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)] h-14 px-8">
                Poser une question
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
