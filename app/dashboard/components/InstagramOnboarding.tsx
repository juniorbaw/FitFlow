'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Instagram, X, Sparkles, CheckCircle } from 'lucide-react'

const ORANGE = "#FF5C00"

interface InstagramOnboardingProps {
  onClose: () => void
  onSkip: () => void
}

export default function InstagramOnboarding({ onClose, onSkip }: InstagramOnboardingProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleConnectInstagram = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?redirectTo=/dashboard`,
          scopes: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement',
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Instagram connection error:', error)
      alert('Erreur lors de la connexion Instagram')
      setLoading(false)
    }
  }

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        backdropFilter: 'blur(8px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          position: 'relative',
          boxShadow: `0 20px 60px ${ORANGE}20`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <X style={{ width: 18, height: 18, color: '#999' }} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 20px',
              background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${ORANGE}30`
            }}>
              <Instagram style={{ width: 40, height: 40, color: 'white' }} />
            </div>
            
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 800, 
              color: 'white', 
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Connecter Instagram
            </h2>
            
            <p style={{ fontSize: '15px', color: '#888', lineHeight: '1.6' }}>
              Débloquez tout le potentiel de FitFlow en connectant votre compte Instagram
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '32px' }}>
            {[
              {
                icon: '🎯',
                title: 'Détection automatique des commentaires',
                description: 'FitFlow surveille vos posts et détecte les leads potentiels'
              },
              {
                icon: '💬',
                title: 'Envoi de DMs personnalisés',
                description: 'Messages automatiques et personnalisés via ManyChat'
              },
              {
                icon: '📊',
                title: 'Analytics en temps réel',
                description: 'Trackez les performances de vos posts et conversions'
              },
              {
                icon: '🤖',
                title: 'Scoring IA des leads',
                description: 'Identifiez automatiquement vos meilleurs prospects'
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  marginBottom: '20px',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ 
                  fontSize: '32px',
                  flexShrink: 0
                }}>
                  {benefit.icon}
                </div>
                <div>
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: 700, 
                    color: 'white',
                    marginBottom: '4px'
                  }}>
                    {benefit.title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.5' }}>
                    {benefit.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div style={{ 
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '13px', color: '#93C5FD', lineHeight: '1.6' }}>
              <strong style={{ color: '#60A5FA' }}>🔒 Sécurisé par Meta</strong>
              <br />
              Vos données Instagram sont protégées. Nous utilisons l'API officielle Meta Business.
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleConnectInstagram}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: `0 8px 24px ${ORANGE}30`,
                transition: 'transform 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? (
                <>
                  <div style={{ 
                    width: 16, 
                    height: 16, 
                    border: '2px solid white', 
                    borderTopColor: 'transparent', 
                    borderRadius: '50%', 
                    animation: 'spin 0.6s linear infinite' 
                  }}></div>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Instagram style={{ width: 18, height: 18 }} />
                  Connecter Instagram
                  <Sparkles style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>

            <button
              onClick={onSkip}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#888',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              Je le ferai plus tard
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
