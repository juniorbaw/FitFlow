'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Facebook, Check, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

function SignupContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    plan: 'pro',
    billingPeriod: 'monthly' as 'monthly' | 'annual',
    businessName: '',
    niche: '',
  })
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const step = searchParams.get('step')
    const plan = searchParams.get('plan')
    const billing = searchParams.get('billing')
    
    if (step) setCurrentStep(parseInt(step))
    if (plan) setFormData(prev => ({ ...prev, plan }))
    if (billing) setFormData(prev => ({ ...prev, billingPeriod: billing as 'monthly' | 'annual' }))
  }, [searchParams])

  const handleFacebookLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?redirectTo=/signup?step=2`,
          scopes: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement',
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Erreur lors de la connexion')
      setLoading(false)
    }
  }

  const handleStripeCheckout = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: formData.plan,
          billingPeriod: formData.billingPeriod,
        }),
      })

      const { url, error: checkoutError } = await response.json()

      if (checkoutError) throw new Error(checkoutError)
      if (url) window.location.href = url
    } catch (error: any) {
      console.error('Checkout error:', error)
      setError(error.message || 'Erreur lors du paiement')
    } finally {
      setLoading(false)
    }
  }

  const handleFinishOnboarding = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error: updateError } = await supabase
        .from('coaches')
        .update({
          business_name: formData.businessName,
          niche: formData.niche,
          onboarding_complete: true,
          onboarding_step: 4,
        })
        .eq('user_id', user.id)

      if (updateError) throw updateError

      router.push('/dashboard')
    } catch (error: any) {
      console.error('Onboarding error:', error)
      setError(error.message || 'Erreur lors de la finalisation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= step ? 'bg-[#FF5C00] text-white' : 'bg-[rgba(255,255,255,0.05)] text-gray-500'
                  }`}>
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 transition-all ${currentStep > step ? 'bg-[#FF5C00]' : 'bg-[rgba(255,255,255,0.05)]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <Card className="p-8 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">Connectez votre Instagram</h2>
            <p className="text-gray-400 mb-8">FitFlow a besoin d&apos;accéder à votre compte Instagram Business</p>
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <Button onClick={handleFacebookLogin} disabled={loading} className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold rounded-full flex items-center justify-center gap-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Facebook className="w-5 h-5" />Connecter avec Facebook</>}
            </Button>
          </Card>
        )}

        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Choisissez votre plan</h2>
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 bg-[rgba(255,255,255,0.03)] p-1 rounded-full">
                <button onClick={() => setFormData({ ...formData, billingPeriod: 'monthly' })} className={`px-6 py-2 rounded-full font-semibold transition-all ${formData.billingPeriod === 'monthly' ? 'bg-[#FF5C00] text-white' : 'text-gray-400'}`}>Mensuel</button>
                <button onClick={() => setFormData({ ...formData, billingPeriod: 'annual' })} className={`px-6 py-2 rounded-full font-semibold transition-all ${formData.billingPeriod === 'annual' ? 'bg-[#FF5C00] text-white' : 'text-gray-400'}`}>
                  Annuel <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">-20%</span>
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card onClick={() => setFormData({ ...formData, plan: 'starter' })} className={`p-6 cursor-pointer transition-all ${formData.plan === 'starter' ? 'border-[#FF5C00] bg-[rgba(255,92,0,0.05)]' : 'border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)]'}`}>
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <div className="mb-4"><span className="text-4xl font-bold text-white">{formData.billingPeriod === 'monthly' ? '47' : '38'}€</span><span className="text-gray-400">/mois</span></div>
              </Card>
              <Card onClick={() => setFormData({ ...formData, plan: 'pro' })} className={`p-6 cursor-pointer transition-all relative ${formData.plan === 'pro' ? 'border-[#FF5C00] bg-[rgba(255,92,0,0.05)]' : 'border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)]'}`}>
                <div className="absolute -top-3 right-4 bg-[#FF5C00] text-white px-3 py-1 rounded-full text-xs font-bold">Populaire</div>
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <div className="mb-4"><span className="text-4xl font-bold text-white">{formData.billingPeriod === 'monthly' ? '147' : '118'}€</span><span className="text-gray-400">/mois</span></div>
              </Card>
            </div>
            <div className="text-center">
              <Button onClick={() => setCurrentStep(3)} className="px-12 py-3 bg-[#FF5C00] hover:bg-[#FF6D1A] text-white font-bold rounded-full">Continuer</Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <Card className="p-8 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Paiement sécurisé</h2>
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <Button onClick={handleStripeCheckout} disabled={loading} className="w-full h-12 bg-[#635BFF] hover:bg-[#5651E0] text-white font-semibold rounded-full">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Payer avec Stripe'}
            </Button>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className="p-8 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Configuration</h2>
            <div className="space-y-6">
              <div>
                <label className="text-white font-semibold mb-2 block">Nom de votre business</label>
                <input type="text" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white" />
              </div>
              <div>
                <label className="text-white font-semibold mb-2 block">Niche</label>
                <select value={formData.niche} onChange={(e) => setFormData({ ...formData, niche: e.target.value })} className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white">
                  <option value="">Sélectionnez...</option>
                  <option value="fitness">Fitness</option>
                </select>
              </div>
            </div>
            <Button onClick={handleFinishOnboarding} disabled={loading || !formData.businessName} className="w-full h-12 bg-[#FF5C00] text-white font-semibold rounded-full mt-8">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Terminer'}
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <SignupContent />
    </Suspense>
  )
}
