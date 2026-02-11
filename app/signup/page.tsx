'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check } from 'lucide-react'

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
        options: {
          data: {
            name: formData.name,
          }
        }
      })

      if (signupError) throw signupError

      if (authData.user) {
        // Créer le profil coach
        const webhookToken = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64')
        
        await supabase.from('coaches').insert({
          user_id: authData.user.id,
          email: formData.email,
          name: formData.name,
          business_name: formData.businessName,
          plan: formData.plan,
          webhook_token: webhookToken,
        })

        setStep(2) // Passer au paiement
      }
    } catch (error: any) {
      console.error('Signup error:', error)
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
        body: JSON.stringify({
          plan: formData.plan,
          billingPeriod: 'monthly',
        }),
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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5C00]/5 via-transparent to-[#3B82F6]/5"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#FF5C00]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF8A00] text-white scale-110' : 'bg-[rgba(255,255,255,0.05)] text-gray-500'
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 2 && <div className={`w-24 h-1 mx-2 rounded ${step > s ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF8A00]' : 'bg-[rgba(255,255,255,0.05)]'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-32 mt-4">
            <span className={`text-sm font-semibold ${step >= 1 ? 'text-[#FF5C00]' : 'text-gray-500'}`}>Inscription</span>
            <span className={`text-sm font-semibold ${step >= 2 ? 'text-[#FF5C00]' : 'text-gray-500'}`}>Paiement</span>
          </div>
        </div>

        {step === 1 && (
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-black text-white mb-2">Créer votre compte</h2>
            <p className="text-gray-400 mb-8">Commencez à générer des leads Instagram en 5 minutes</p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">Nom complet</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">Nom du business</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="FitCoach Pro"
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="coach@fitflow.com"
                  required
                  className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">Mot de passe</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">Confirmer mot de passe</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3 text-sm">Choisir un plan</label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setFormData({ ...formData, plan: 'starter' })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.plan === 'starter'
                        ? 'border-[#FF5C00] bg-[rgba(255,92,0,0.1)]'
                        : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,92,0,0.5)]'
                    }`}
                  >
                    <div className="font-bold text-white mb-1">Starter</div>
                    <div className="text-2xl font-black text-white">47€<span className="text-sm text-gray-400">/mois</span></div>
                  </div>
                  <div
                    onClick={() => setFormData({ ...formData, plan: 'pro' })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                      formData.plan === 'pro'
                        ? 'border-[#FF5C00] bg-[rgba(255,92,0,0.1)]'
                        : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,92,0,0.5)]'
                    }`}
                  >
                    <div className="absolute -top-2 right-4 bg-[#FF5C00] text-white px-2 py-0.5 rounded-full text-xs font-bold">Populaire</div>
                    <div className="font-bold text-white mb-1">Pro</div>
                    <div className="text-2xl font-black text-white">147€<span className="text-sm text-gray-400">/mois</span></div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#FF5C00] to-[#FF8A00] hover:from-[#FF6D1A] hover:to-[#FF9B1A] text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#FF5C00]/20"
              >
                {loading ? 'Création du compte...' : 'Continuer vers le paiement →'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Déjà un compte ?{' '}
                <Link href="/login" className="text-[#FF5C00] hover:text-[#FF6D1A] font-bold transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-black text-white mb-2">Paiement sécurisé</h2>
            <p className="text-gray-400 mb-8">Un seul clic pour activer votre compte</p>

            <div className="bg-[rgba(255,92,0,0.05)] border border-[rgba(255,92,0,0.15)] rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-lg capitalize">Plan {formData.plan}</div>
                  <div className="text-gray-400 text-sm">Facturation mensuelle</div>
                </div>
                <div className="text-3xl font-black text-[#FF5C00]">
                  {formData.plan === 'starter' ? '47' : '147'}€<span className="text-sm">/mois</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleStripeCheckout}
              disabled={loading}
              className="w-full h-14 bg-[#635BFF] hover:bg-[#5651E0] text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-lg"
            >
              {loading ? 'Redirection...' : 'Payer avec Stripe →'}
            </Button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Paiement 100% sécurisé par Stripe • Annulation possible à tout moment
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
