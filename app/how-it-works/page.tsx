'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"
const BLUE = "#3B82F6"

export default function HowItWorksPage() {
  const router = useRouter()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) setTheme(savedTheme)
  }, [])
  
  const isDark = theme === 'dark'
  const bg = isDark ? '#0a0a0a' : '#ffffff'
  const text = isDark ? '#fafafa' : '#0a0a0a'
  const textSecondary = isDark ? '#999' : '#666'
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  const steps = [
    {
      number: "1",
      title: "Connexion Instagram",
      description: "Connectez votre compte Instagram professionnel via Facebook. FitFlow accède à vos commentaires pour détecter les leads.",
      icon: "📱",
      details: [
        "✅ Connexion sécurisée via Facebook OAuth",
        "✅ Accès lecture seule aux commentaires",
        "✅ Aucun post automatique",
        "✅ Révocation possible à tout moment"
      ]
    },
    {
      number: "2",
      title: "Détection automatique",
      description: "L'IA analyse chaque commentaire et attribue un score de qualité de 1 à 10 selon l'intention d'achat.",
      icon: "🤖",
      details: [
        "🔍 Analyse en temps réel des commentaires",
        "💎 Score VIP (9-10) : Intention forte",
        "⭐ Score Standard (7-8) : Intérêt modéré",
        "📊 Score Low (1-6) : Simple interaction"
      ]
    },
    {
      number: "3",
      title: "DM automatique",
      description: "Les leads VIP reçoivent un DM personnalisé instantanément. Vous recevez une notification pour suivre.",
      icon: "💬",
      details: [
        "⚡ Réponse en moins de 60 secondes",
        "✍️ Message personnalisé par l'IA",
        "📲 Notifications push en temps réel",
        "📈 Taux de conversion x3"
      ]
    },
    {
      number: "4",
      title: "Dashboard & Analytics",
      description: "Suivez vos performances : leads captés, taux de conversion, revenus générés par post.",
      icon: "📊",
      details: [
        "📈 Graphiques de performance",
        "💰 Tracking revenue par semaine",
        "🎯 Meilleurs posts identifiés",
        "🔔 Alertes leads VIP"
      ]
    }
  ]

  const faqs = [
    {
      q: "Pourquoi connecter Facebook ET Instagram ?",
      a: "Instagram appartient à Meta (Facebook). Pour des raisons de sécurité, Meta impose une connexion via Facebook pour accéder aux données Instagram professionnelles. FitFlow n'accède qu'à vos commentaires Instagram, pas à vos données Facebook."
    },
    {
      q: "Est-ce que FitFlow poste à ma place ?",
      a: "Non ! FitFlow lit uniquement vos commentaires et envoie des DMs. Vous gardez 100% du contrôle sur vos publications."
    },
    {
      q: "Comment fonctionne le score de lead ?",
      a: "L'IA analyse le texte du commentaire et détecte : mots-clés d'achat ('prix', 'combien', 'programme'), émojis positifs, questions directes, urgence. Plus le signal d'intention est fort, plus le score est élevé."
    },
    {
      q: "Puis-je personnaliser les DMs ?",
      a: "Oui ! Dans Settings, vous pouvez configurer votre template de DM. L'IA l'adaptera automatiquement selon le contexte du commentaire."
    },
    {
      q: "Que se passe-t-il si je me déconnecte ?",
      a: "Si vous cliquez sur 'Se déconnecter' dans le menu utilisateur, vous quittez votre session. Pour reconnecter Instagram, allez dans Settings > Connexions."
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ padding: '24px clamp(16px, 4vw, 32px)', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 20 }}>
          Fit<span style={{ color: ORANGE }}>Flow</span>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: ORANGE,
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          ← Retour au dashboard
        </button>
      </div>

      {/* Hero Section */}
      <div style={{ padding: 'clamp(48px, 8vh, 80px) clamp(16px, 4vw, 32px)', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 24 }}>
          Comment fonctionne <span style={{ color: ORANGE }}>FitFlow</span> ?
        </div>
        <div style={{ fontSize: 18, color: textSecondary, lineHeight: 1.6 }}>
          De la connexion Instagram à la conversion client : tout ce que vous devez savoir sur le système d'automatisation FitFlow.
        </div>
      </div>

      {/* Steps */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px) 80px' }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ marginBottom: 48, display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Step Number */}
            <div style={{ 
              width: 80, 
              height: 80, 
              borderRadius: 20, 
              background: `linear-gradient(135deg, ${ORANGE}, #ff8040)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 900,
              color: 'white',
              flexShrink: 0
            }}>
              {step.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ 
                  background: cardBg, 
                  border: `1px solid ${border}`,
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  color: ORANGE
                }}>
                  Étape {step.number}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{step.title}</div>
              </div>
              
              <div style={{ fontSize: 16, color: textSecondary, lineHeight: 1.7, marginBottom: 20 }}>
                {step.description}
              </div>

              <div style={{ 
                background: cardBg, 
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: 20
              }}>
                {step.details.map((detail, i) => (
                  <div key={i} style={{ 
                    fontSize: 14, 
                    marginBottom: i < step.details.length - 1 ? 10 : 0,
                    color: text,
                    lineHeight: 1.6
                  }}>
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div style={{ background: cardBg, borderTop: `1px solid ${border}`, padding: 'clamp(48px, 8vh, 80px) clamp(16px, 4vw, 32px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, marginBottom: 48, textAlign: 'center' }}>
            Questions fréquentes
          </div>

          {faqs.map((faq, idx) => (
            <div key={idx} style={{ 
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 16,
              padding: 24,
              marginBottom: 16
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: ORANGE }}>
                {faq.q}
              </div>
              <div style={{ fontSize: 15, color: textSecondary, lineHeight: 1.7 }}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ padding: 'clamp(48px, 8vh, 80px) clamp(16px, 4vw, 32px)', textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>
          Prêt à transformer vos commentaires en revenus ?
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: ORANGE,
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 16
          }}
        >
          Retour au dashboard
        </button>
      </div>
    </div>
  )
}
