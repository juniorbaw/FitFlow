'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Briefcase, Check, ArrowRight, Sparkles } from 'lucide-react'

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    businessName: '',
    plan: 'pro',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name } }
      })

      if (signupError) throw signupError

      if (authData.user) {
        const webhookToken = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64')
        
        await supabase.from('coaches').insert({
          user_id: authData.user.id,
          email: formData.email,
          name: formData.name,
          business_name: formData.businessName,
          plan: formData.plan,
          webhook_token: webhookToken,
        })

        setStep(2)
      }
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  const handleStripeCheckout = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: formData.plan, billingPeriod: 'monthly' }),
      })

      const { url } = await response.json()
      if (url) window.location.href = url
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fafafa", fontFamily: "'DM Sans', -apple-system, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(12px, 3vw, 16px)", position: "relative", overflow: "hidden", width: "100%", maxWidth: "100vw" }}>
      
      {/* Background */}
      <div style={{ position: "absolute", top: "10%", left: "10%", width: "min(500px, 80vw)", height: "min(500px, 80vw)", background: `${ORANGE}08`, borderRadius: "50%", filter: "blur(120px)" }}></div>
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "min(500px, 80vw)", height: "min(500px, 80vw)", background: "#3B82F608", borderRadius: "50%", filter: "blur(120px)" }}></div>

      <div style={{ width: "100%", maxWidth: "min(640px, 100%)", position: "relative", zIndex: 1 }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>
            Fit<span style={{ color: ORANGE }}>Flow</span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 48 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: step >= s ? `linear-gradient(135deg, ${ORANGE}, #FF8A00)` : "rgba(255,255,255,0.06)", border: `2px solid ${step >= s ? ORANGE : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, transition: "all 0.3s" }}>
                {step > s ? <Check style={{ width: 18, height: 18 }} /> : s}
              </div>
              {s < 2 && <div style={{ width: 80, height: 2, background: step > s ? `linear-gradient(90deg, ${ORANGE}, #FF8A00)` : "rgba(255,255,255,0.06)", margin: "0 12px", transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "clamp(16px, 4vw, 20px)", padding: "clamp(20px, 5vw, 48px)", backdropFilter: "blur(20px)", width: "100%", boxSizing: "border-box" }}>
          
          {step === 1 && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
                  Créer votre compte
                </h1>
                <p style={{ fontSize: 14, color: "#888" }}>
                  Commencez à générer des leads Instagram en 5 minutes
                </p>
              </div>

              {error && (
                <div style={{ background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.2)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
                  <div style={{ fontSize: 13, color: "#ff6b6b", fontWeight: 600 }}>{error}</div>
                </div>
              )}

              <form onSubmit={handleSignup}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#ccc", marginBottom: 8 }}>Nom complet</label>
                    <div style={{ position: "relative" }}>
                      <User style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#555" }} />
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" required style={{ width: "100%", padding: "14px 16px 14px 48px", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white", fontSize: 14, outline: "none" }} onFocus={(e) => e.target.style.borderColor = ORANGE} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#ccc", marginBottom: 8 }}>Business</label>
                    <div style={{ position: "relative" }}>
                      <Briefcase style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#555" }} />
                      <input type="text" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} placeholder="FitCoach Pro" style={{ width: "100%", padding: "14px 16px 14px 48px", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white", fontSize: 14, outline: "none" }} onFocus={(e) => e.target.style.borderColor = ORANGE} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#ccc", marginBottom: 8 }}>Email</label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#555" }} />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="coach@fitflow.com" required style={{ width: "100%", padding: "14px 16px 14px 48px", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white", fontSize: 14, outline: "none" }} onFocus={(e) => e.target.style.borderColor = ORANGE} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#ccc", marginBottom: 8 }}>Mot de passe</label>
                    <div style={{ position: "relative" }}>
                      <Lock style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#555" }} />
                      <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" required style={{ width: "100%", padding: "14px 16px 14px 48px", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white", fontSize: 14, outline: "none" }} onFocus={(e) => e.target.style.borderColor = ORANGE} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#ccc", marginBottom: 8 }}>Confirmer</label>
                    <div style={{ position: "relative" }}>
                      <Lock style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#555" }} />
                      <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="••••••••" required style={{ width: "100%", padding: "14px 16px 14px 48px", boxSizing: "border-box", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white", fontSize: 14, outline: "none" }} onFocus={(e) => e.target.style.borderColor = ORANGE} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#ccc", marginBottom: 12 }}>Choisir un plan</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[
                      { id: 'starter', name: 'Starter', price: '47€' },
                      { id: 'pro', name: 'Pro', price: '147€', badge: 'Populaire' }
                    ].map((plan) => (
                      <div key={plan.id} onClick={() => setFormData({ ...formData, plan: plan.id })} style={{ padding: 20, background: formData.plan === plan.id ? `${ORANGE}15` : "rgba(255,255,255,0.03)", border: `2px solid ${formData.plan === plan.id ? ORANGE : "rgba(255,255,255,0.08)"}`, borderRadius: 12, cursor: "pointer", transition: "all 0.2s", position: "relative" }}>
                        {plan.badge && <div style={{ position: "absolute", top: -8, right: 12, background: ORANGE, color: "white", padding: "2px 10px", borderRadius: 12, fontSize: 10, fontWeight: 800 }}>{plan.badge}</div>}
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{plan.name}</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: formData.plan === plan.id ? ORANGE : "white" }}>{plan.price}<span style={{ fontSize: 12, color: "#666" }}>/mois</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, boxSizing: "border-box", border: "none", borderRadius: 12, color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 24px ${ORANGE}30`, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Création du compte...' : <><Sparkles style={{ width: 18, height: 18 }} /> Créer mon compte <ArrowRight style={{ width: 18, height: 18 }} /></>}
                </button>
              </form>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 24, paddingTop: 24, textAlign: "center", fontSize: 13, color: "#888" }}>
                Déjà un compte ?{' '}
                <Link href="/login" style={{ color: ORANGE, fontWeight: 700, textDecoration: "none" }}>
                  Se connecter
                </Link>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
                  Activer votre compte
                </h1>
                <p style={{ fontSize: 14, color: "#888" }}>
                  Un seul paiement pour débloquer toutes les fonctionnalités
                </p>
              </div>

              <div style={{ background: `${ORANGE}10`, border: `1px solid ${ORANGE}30`, borderRadius: 16, padding: 24, marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, textTransform: "capitalize", marginBottom: 4 }}>Plan {formData.plan}</div>
                    <div style={{ fontSize: 13, color: "#888" }}>Facturation mensuelle • Annulation possible</div>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: ORANGE }}>
                    {formData.plan === 'starter' ? '47' : '147'}€<span style={{ fontSize: 14 }}>/mois</span>
                  </div>
                </div>
              </div>

              <button onClick={handleStripeCheckout} disabled={loading} style={{ width: "100%", padding: 16, background: "#635BFF", boxSizing: "border-box", border: "none", borderRadius: 12, color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 24px #635BFF30", opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Redirection...' : <>Payer avec Stripe <ArrowRight style={{ width: 18, height: 18 }} /></>}
              </button>

              <div style={{ textAlign: "center", fontSize: 12, color: "#666", marginTop: 16 }}>
                Paiement 100% sécurisé par Stripe
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
