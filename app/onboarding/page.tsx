'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Instagram, Check, Sparkles, Zap } from 'lucide-react'

const ORANGE = "#FF5C00"

const STEPS = [
  { id: 1, title: "Connectez Instagram", icon: Instagram },
  { id: 2, title: "Choisissez votre plan", icon: Zap },
  { id: 3, title: "Configurez vos messages", icon: Sparkles },
  { id: 4, title: "C'est prêt !", icon: Check },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [coach, setCoach] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)

    const { data: coachData } = await supabase
      .from('coaches')
      .select('*')
      .eq('user_id', user.id)
      .single()

    setCoach(coachData)

    // Déterminer l'étape actuelle
    if (coachData?.instagram_username) {
      setCurrentStep(2) // Instagram déjà connecté
    }
    if (coachData?.subscription_tier && coachData.subscription_tier !== 'free') {
      setCurrentStep(3) // Plan déjà choisi
    }
  }

  const handleInstagramConnect = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=/onboarding`,
          scopes: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement',
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Instagram connection error:', error)
      setLoading(false)
    }
  }

  const handlePlanSelect = async (plan: 'starter' | 'pro') => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          user_id: user.id,
          email: coach?.email || user.email,
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
            <div style={{ 
              width: 100, 
              height: 100, 
              margin: "0 auto 32px",
              background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Instagram style={{ width: 50, height: 50, color: "white" }} />
            </div>

            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
              Connectez votre Instagram
            </h2>
            <p style={{ fontSize: 16, color: "#888", marginBottom: 40, lineHeight: 1.6 }}>
              FitFlow a besoin d'accéder à votre compte Instagram pour détecter les leads 
              dans vos commentaires et envoyer des DMs automatiques.
            </p>

            <button
              onClick={handleInstagramConnect}
              disabled={loading}
              style={{
                padding: "16px 32px",
                background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                border: "none",
                borderRadius: 12,
                color: "white",
                fontSize: 16,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                boxShadow: `0 8px 24px ${ORANGE}30`,
                transition: "transform 0.2s",
                opacity: loading ? 0.7 : 1
              }}
            >
              <Instagram style={{ width: 20, height: 20 }} />
              {loading ? "Connexion..." : "Connecter Instagram"}
            </button>

            {coach?.instagram_username && (
              <div style={{ marginTop: 32, padding: 16, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12 }}>
                <p style={{ fontSize: 14, color: "#22C55E" }}>
                  ✅ Connecté : @{coach.instagram_username}
                </p>
                <button
                  onClick={() => setCurrentStep(2)}
                  style={{
                    marginTop: 12,
                    padding: "10px 20px",
                    background: "transparent",
                    border: `1px solid ${ORANGE}`,
                    borderRadius: 8,
                    color: ORANGE,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Continuer →
                </button>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, textAlign: "center" }}>
              Choisissez votre plan
            </h2>
            <p style={{ fontSize: 16, color: "#888", marginBottom: 40, textAlign: "center" }}>
              Commencez avec 14 jours d'essai gratuit
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {/* Starter */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32 }}>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Starter</h3>
                <div style={{ fontSize: 40, fontWeight: 900, color: ORANGE, marginBottom: 24 }}>
                  47€<span style={{ fontSize: 16, color: "#666" }}>/mois</span>
                </div>
                <button
                  onClick={() => handlePlanSelect('starter')}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: 14,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "white",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    marginBottom: 20
                  }}
                >
                  Choisir Starter
                </button>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["100 leads/mois", "Scoring IA basique", "Flows ManyChat", "Support email"].map((f, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, marginBottom: 12, fontSize: 14, color: "#ccc" }}>
                      <Check style={{ width: 16, height: 16, color: ORANGE, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro */}
              <div style={{ background: `rgba(255,92,0,0.05)`, border: `2px solid ${ORANGE}`, borderRadius: 20, padding: 32, position: "relative" }}>
                <div style={{ 
                  position: "absolute", 
                  top: -12, 
                  left: "50%", 
                  transform: "translateX(-50%)",
                  background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                  padding: "4px 16px",
                  borderRadius: 50,
                  fontSize: 12,
                  fontWeight: 800
                }}>
                  POPULAIRE
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Pro</h3>
                <div style={{ fontSize: 40, fontWeight: 900, color: ORANGE, marginBottom: 24 }}>
                  97€<span style={{ fontSize: 16, color: "#666" }}>/mois</span>
                </div>
                <button
                  onClick={() => handlePlanSelect('pro')}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: 14,
                    background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                    border: "none",
                    borderRadius: 12,
                    color: "white",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    marginBottom: 20
                  }}
                >
                  Démarrer avec Pro
                </button>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {["Leads illimités", "Scoring IA avancé", "Flows premium", "Instagram API", "Support prioritaire"].map((f, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, marginBottom: 12, fontSize: 14, color: "#ccc" }}>
                      <Check style={{ width: 16, height: 16, color: ORANGE, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
              Configuration en cours...
            </h2>
            <p style={{ fontSize: 16, color: "#888", marginBottom: 40 }}>
              Nous configurons ManyChat et Make.com pour votre compte
            </p>
            <div style={{ width: 64, height: 64, border: `4px solid ${ORANGE}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fafafa", fontFamily: "'DM Sans', -apple-system, sans-serif", padding: "clamp(20px, 5vw, 40px)" }}>
      {/* Progress Steps */}
      <div style={{ maxWidth: 800, margin: "0 auto 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          
          return (
            <div key={step.id} style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: isCompleted ? `linear-gradient(135deg, ${ORANGE}, #FF8A00)` : isActive ? `rgba(255,92,0,0.2)` : "rgba(255,255,255,0.05)",
                  border: isActive ? `2px solid ${ORANGE}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8
                }}>
                  <Icon style={{ width: 20, height: 20, color: isCompleted || isActive ? ORANGE : "#666" }} />
                </div>
                <span style={{ fontSize: 12, color: isActive ? ORANGE : "#666", fontWeight: isActive ? 700 : 400, textAlign: "center" }}>
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div style={{ height: 2, flex: 1, background: isCompleted ? ORANGE : "rgba(255,255,255,0.1)", marginBottom: 24 }}></div>
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      {renderStep()}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
