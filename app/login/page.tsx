'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

const ORANGE = "#FF5C00"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email,public_profile,instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement',
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la connexion Facebook')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fafafa", fontFamily: "'DM Sans', -apple-system, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(12px, 3vw, 16px)", position: "relative", overflow: "hidden", width: "100%", maxWidth: "100vw" }}>
      
      {/* Background gradients */}
      <div style={{ position: "absolute", top: "10%", left: "10%", width: "min(500px, 80vw)", height: "min(500px, 80vw)", background: `${ORANGE}08`, borderRadius: "50%", filter: "blur(120px)" }}></div>
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "min(500px, 80vw)", height: "min(500px, 80vw)", background: "#3B82F608", borderRadius: "50%", filter: "blur(120px)" }}></div>

      <div style={{ width: "100%", maxWidth: "min(480px, 100%)", position: "relative", zIndex: 1 }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>
            Fit<span style={{ color: ORANGE }}>Flow</span>
          </div>
          <div style={{ fontSize: 15, color: "#888" }}>
            Connectez-vous à votre dashboard
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "clamp(16px, 4vw, 20px)", padding: "clamp(20px, 5vw, 48px)", backdropFilter: "blur(20px)", width: "100%", boxSizing: "border-box" }}>
          
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
              Bon retour ! 👋
            </h1>
            <p style={{ fontSize: 14, color: "#888" }}>
              Connectez-vous pour accéder à vos leads et analytics
            </p>
          </div>

          {error && (
            <div style={{ background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.2)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "#ff6b6b", fontWeight: 600 }}>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ marginBottom: 24 }}>
            
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#ccc", marginBottom: 8 }}>
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#555" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coach@fitflow.com"
                  required
                  style={{ width: "100%", padding: "14px 16px 14px 48px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white", fontSize: 14, outline: "none", transition: "all 0.2s", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = ORANGE}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#ccc", marginBottom: 8 }}>
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#555" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: "100%", padding: "14px 16px 14px 48px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white", fontSize: 14, outline: "none", transition: "all 0.2s", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = ORANGE}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: 16, background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, border: "none", borderRadius: 12, color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 24px ${ORANGE}30`, transition: "transform 0.2s", opacity: loading ? 0.7 : 1, boxSizing: "border-box" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }}></div>
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter <ArrowRight style={{ width: 18, height: 18 }} />
                </>
              )}
            </button>
          </form>

          {/* Divider OR */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}></div>
            <span style={{ color: "#666", fontSize: 13, fontWeight: 600 }}>OU</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}></div>
          </div>

          {/* Facebook Login Button */}
          <button
            onClick={handleFacebookLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: 16,
              background: "#1877F2",
              border: "none",
              borderRadius: 12,
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              transition: "all 0.2s",
              opacity: loading ? 0.7 : 1,
              boxSizing: "border-box",
              marginBottom: 24
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#166FE5")}
            onMouseLeave={(e) => e.currentTarget.style.background = "#1877F2"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {loading ? "Connexion..." : "Se connecter avec Facebook"}
          </button>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24 }}>
            <div style={{ textAlign: "center", fontSize: 13, color: "#888" }}>
              Pas encore de compte ?{' '}
              <Link href="/signup" style={{ color: ORANGE, fontWeight: 700, textDecoration: "none" }}>
                Créer un compte →
              </Link>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/" style={{ fontSize: 13, color: "#666", textDecoration: "none", transition: "color 0.2s" }}>
            ← Retour à l'accueil
          </Link>
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
