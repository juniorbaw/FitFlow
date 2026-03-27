'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  X, 
  Check, 
  Sparkles, 
  Instagram, 
  MessageSquare,
  TrendingUp,
  Rocket,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: any
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur FitFlow ! 🎉',
    description: 'Prêt à transformer tes commentaires Instagram en clients payants ? On va te guider étape par étape. Ça prend 5 minutes chrono !',
    icon: Rocket,
  },
  {
    id: 'connect-instagram',
    title: 'Connecte ton compte Instagram',
    description: 'On a besoin d\'accéder à tes posts et commentaires pour que l\'IA puisse bosser pour toi. C\'est 100% sécurisé via Meta 🔒',
    icon: Instagram,
    action: {
      label: 'Connecter Instagram',
      href: '/api/instagram/connect'
    }
  },
  {
    id: 'ai-setup',
    title: 'Active l\'IA FitFlow',
    description: 'Notre IA va analyser automatiquement chaque commentaire et détecter les leads chauds. Tu choisis ensuite : réponse auto ou manuelle 🤖',
    icon: Sparkles,
  },
  {
    id: 'templates',
    title: 'Personnalise tes messages',
    description: 'On a créé des templates qui convertissent à 37%. Mais tu peux les adapter à ton style ! Sois toi-même, c\'est ce qui marche le mieux 💬',
    icon: MessageSquare,
    action: {
      label: 'Voir les templates',
      href: '/dashboard/templates'
    }
  },
  {
    id: 'ready',
    title: 'C\'est parti, tu es prêt ! 🚀',
    description: 'Tu fais maintenant partie des coachs qui automatisent leur business. Attends-toi à recevoir tes premiers leads dans les prochaines heures !',
    icon: TrendingUp,
  }
]

export function OnboardingGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding
    const seen = localStorage.getItem('fitflow_onboarding_seen')
    if (!seen) {
      // Show onboarding after 1 second
      setTimeout(() => setIsOpen(true), 1000)
    } else {
      setHasSeenOnboarding(true)
      const completed = JSON.parse(localStorage.getItem('fitflow_onboarding_completed') || '[]')
      setCompletedSteps(completed)
    }
  }, [])

  const handleComplete = () => {
    localStorage.setItem('fitflow_onboarding_seen', 'true')
    localStorage.setItem('fitflow_onboarding_completed', JSON.stringify([...ONBOARDING_STEPS.map(s => s.id)]))
    setCompletedSteps(ONBOARDING_STEPS.map(s => s.id))
    setIsOpen(false)
    setHasSeenOnboarding(true)
  }

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const currentStepId = ONBOARDING_STEPS[currentStep].id
      if (!completedSteps.includes(currentStepId)) {
        const newCompleted = [...completedSteps, currentStepId]
        setCompletedSteps(newCompleted)
        localStorage.setItem('fitflow_onboarding_completed', JSON.stringify(newCompleted))
      }
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('fitflow_onboarding_seen', 'true')
    setIsOpen(false)
    setHasSeenOnboarding(true)
  }

  const step = ONBOARDING_STEPS[currentStep]
  const Icon = step.icon
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100
  const allStepsCompleted = completedSteps.length === ONBOARDING_STEPS.length

  if (!isOpen) {
    // Show small trigger button if onboarding was skipped
    return hasSeenOnboarding && !allStepsCompleted ? (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 animate-pulse"
        title="Reprendre le guide"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>
    ) : null
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card 
          className="w-full max-w-2xl bg-[#0a0a0a] border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div className="h-2 bg-[rgba(255,255,255,0.05)]">
            <div 
              className="h-full bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className="p-6 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#888]">Étape {currentStep + 1}/{ONBOARDING_STEPS.length}</p>
                <h2 className="text-xl font-bold text-white">{step.title}</h2>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-[#666] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <p className="text-lg text-[#CCC] leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Checklist of all steps */}
            <div className="space-y-3 mb-8 bg-[rgba(255,255,255,0.02)] rounded-lg p-4">
              {ONBOARDING_STEPS.map((s, idx) => {
                const StepIcon = s.icon
                const isCompleted = completedSteps.includes(s.id)
                const isCurrent = idx === currentStep
                
                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isCurrent ? 'bg-[rgba(255,92,0,0.1)] border border-[rgba(255,92,0,0.3)]' : 'bg-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-[#00D26A]' 
                        : isCurrent
                        ? 'bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D]'
                        : 'bg-[rgba(255,255,255,0.05)]'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <StepIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isCompleted 
                        ? 'text-[#00D26A]' 
                        : isCurrent
                        ? 'text-white'
                        : 'text-[#666]'
                    }`}>
                      {s.title.replace(/[🎉🔒🤖💬🚀]/g, '').trim()}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Action Button */}
            {step.action && (
              <a 
                href={step.action.href}
                onClick={step.action.onClick}
                className="block mb-6"
              >
                <Button className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] text-white h-12">
                  <Sparkles className="w-5 h-5 mr-2" />
                  {step.action.label}
                </Button>
              </a>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between bg-[rgba(0,0,0,0.3)]">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </Button>

            <button
              onClick={handleSkip}
              className="text-sm text-[#666] hover:text-white transition-colors"
            >
              Passer le guide
            </button>

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] hover:from-[#FF7A2D] hover:to-[#FFA05A] text-white"
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Terminé !
                </>
              ) : (
                <>
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
