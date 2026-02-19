'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Check, X, Sparkles, Zap, Crown, ArrowLeft } from 'lucide-react'

const ORANGE = "#FF5C00"

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 47,
    priceId: 'prod_TyPu3MklJdRMpw',
    description: 'Parfait pour démarrer',
    icon: Zap,
    features: [
      { text: '100 leads/mois', included: true },
      { text: 'Scoring IA basique', included: true },
      { text: 'Automatisation DM standard', included: true },
      { text: 'Dashboard analytics', included: true },
      { text: 'Support email', included: true },
      { text: 'Automatisation avancée', included: false },
      { text: 'Instagram API', included: false },
      { text: 'Support prioritaire', included: false },
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 97,
    priceId: 'prod_TyQ2uyeVIWNanX',
    description: 'Pour les coachs sérieux',
    icon: Crown,
    features: [
      { text: 'Leads illimités', included: true },
      { text: 'Scoring IA avancé', included: true },
      { text: 'Automatisation DM premium', included: true },
      { text: 'Dashboard analytics avancé', included: true },
      { text: 'Automatisation complète', included: true },
      { text: 'Instagram API', included: true },
      { text: 'Support prioritaire', included: true },
      { text: 'Onboarding personnalisé', included: true },
    ],
    popular: true,
  },
]

function PricingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [loading, setLoading] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [canceled, setCanceled] = useState(false)

  useEffect(() => {
    checkUser()
    if (searchParams.get('canceled') === 'true') {
      setCanceled(true)
      setTimeout(() => setCanceled(false), 5000)
    }
  }, [searchParams])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleSelectPlan = async (plan: typeof PLANS[0]) => {
    if (!user) {
      router.push('/login?redirect=/pricing')
      return
    }

    setLoading(plan.id)

    try {
      const { data: coach } = await supabase
        .from('coaches')
        .select('email')
        .eq('user_id', user.id)
        .single()

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.id,
          user_id: user.id,
          email: coach?.email || user.email,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Erreur lors de la création de la session de paiement')
      setLoading(null)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fafafa", fontFamily: "'DM Sans', -apple-system, sans-serif", width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
      
      {/* Header */}
      <div style={{ padding: "16px clamp(16px, 4vw, 32px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <button 
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#888" }}
          >
            <ArrowLeft style={{ width: 18, height: 18 }} />
          </button>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5, color: "white" }}>
            Fit<span style={{ color: ORANGE }}>Flow</span>
          </div>
        </Link>
      </div>

      {/* Canceled Message */}
      {canceled && (
        <div style={{ 
          background: "rgba(255,77,77,0.1)", 
          border: "1px solid rgba(255,77,77,0.3)", 
          borderRadius: 12, 
          padding: 16, 
          margin: "16px auto", 
          maxWidth: 600,
          textAlign: "center",
          color: "#FF9999"
        }}>
          Paiement annulé. Vous pouvez réessayer quand vous voulez !
        </div>
      )}

      {/* Hero Section */}
      <div style={{ padding: "clamp(40px, 8vw, 80px) clamp(16px, 4vw, 32px)", textAlign: "center", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: `${ORANGE}15`, border: `1px solid ${ORANGE}30`, borderRadius: 50, padding: "8px 20px", marginBottom: 24 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: ORANGE }}>💎 Pricing Simple et Transparent</span>
        </div>

        <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, marginBottom: 16, letterSpacing: "-2px", lineHeight: 1.1 }}>
          Choisissez votre plan<br />
          <span style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            et démarrez aujourd'hui
          </span>
        </h1>

        <p style={{ fontSize: 18, color: "#888", maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.6 }}>
          Transformez vos followers Instagram en clients payants avec l'automatisation IA
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: "0 clamp(16px, 4vw, 32px) 80px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24
      }}>
        {PLANS.map((plan) => {
          const Icon = plan.icon
          return (
            <div 
              key={plan.id}
              style={{ 
                background: plan.popular ? "rgba(255,92,0,0.05)" : "rgba(255,255,255,0.03)", 
                border: plan.popular ? `2px solid ${ORANGE}` : "1px solid rgba(255,255,255,0.07)", 
                borderRadius: 20, 
                padding: "clamp(24px, 5vw, 32px)",
                position: "relative",
                transition: "all 0.3s",
                boxSizing: "border-box"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)"
                e.currentTarget.style.boxShadow = plan.popular ? `0 20px 60px ${ORANGE}30` : "0 20px 60px rgba(0,0,0,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              {plan.popular && (
                <div style={{ 
                  position: "absolute", 
                  top: -12, 
                  left: "50%", 
                  transform: "translateX(-50%)",
                  background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 800,
                  padding: "6px 20px",
                  borderRadius: 50,
                  boxShadow: `0 4px 16px ${ORANGE}40`
                }}>
                  ⭐ POPULAIRE
                </div>
              )}

              {/* Icon */}
              <div style={{ 
                width: 64, 
                height: 64, 
                background: plan.popular ? `linear-gradient(135deg, ${ORANGE}, #FF8A00)` : "rgba(255,255,255,0.05)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20
              }}>
                <Icon style={{ width: 32, height: 32, color: plan.popular ? "white" : ORANGE }} />
              </div>

              {/* Plan Name */}
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{plan.name}</h3>
              <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>{plan.description}</p>

              {/* Price */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: plan.popular ? ORANGE : "white" }}>{plan.price}€</span>
                  <span style={{ fontSize: 16, color: "#666" }}>/mois</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loading !== null}
                style={{
                  width: "100%",
                  padding: 16,
                  background: plan.popular ? `linear-gradient(135deg, ${ORANGE}, #FF8A00)` : "rgba(255,255,255,0.06)",
                  border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  marginBottom: 32,
                  transition: "all 0.2s",
                  opacity: loading && loading !== plan.id ? 0.5 : 1,
                  boxSizing: "border-box"
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {loading === plan.id ? "Chargement..." : plan.popular ? "Démarrer maintenant" : "Choisir Starter"}
              </button>

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {plan.features.map((feature, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: "50%", 
                      background: feature.included ? `${ORANGE}20` : "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      {feature.included ? (
                        <Check style={{ width: 12, height: 12, color: ORANGE }} />
                      ) : (
                        <X style={{ width: 12, height: 12, color: "#444" }} />
                      )}
                    </div>
                    <span style={{ fontSize: 14, color: feature.included ? "#ccc" : "#555" }}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ / Info */}
      <div style={{ 
        maxWidth: 800, 
        margin: "0 auto 80px", 
        padding: "0 clamp(16px, 4vw, 32px)",
        textAlign: "center"
      }}>
        <div style={{ 
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 16,
          padding: "clamp(20px, 5vw, 32px)"
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#60A5FA" }}>
            🎁 14 jours d'essai gratuit
          </h3>
          <p style={{ fontSize: 14, color: "#93C5FD", lineHeight: 1.6 }}>
            Testez FitFlow sans risque pendant 14 jours. Annulez à tout moment depuis votre espace client.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 64, height: 64, border: "4px solid #FF5C00", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }}></div>
          <p style={{ color: "#888", fontWeight: 600 }}>Chargement...</p>
        </div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}
