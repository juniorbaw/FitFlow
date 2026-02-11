'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  const plans = {
    starter: {
      name: 'FitFlow Starter',
      description: 'Automatisez vos DMs Instagram',
      monthly: 47,
      annual: 38,
      features: [
        { text: 'ManyChat + IA pour détecter les commentaires', included: true },
        { text: 'DMs automatiques personnalisés', included: true },
        { text: 'Setup en 1-2h par coach', included: true },
        { text: 'Support email', included: true },
        { text: 'Scoring IA des leads', included: false },
        { text: 'Dashboard analytics temps réel', included: false },
        { text: 'Tracking ROI par post/lead', included: false },
      ],
    },
    pro: {
      name: 'FitFlow Pro',
      description: 'Tout Starter + Analytics avancés',
      monthly: 147,
      annual: 118,
      popular: true,
      features: [
        { text: 'Tout du plan Starter', included: true },
        { text: 'Scoring IA (Gemini) de chaque lead', included: true },
        { text: 'Dashboard analytics temps réel', included: true },
        { text: 'Tracking ROI par post/lead', included: true },
        { text: 'Suivi des conversions', included: true },
        { text: 'Data centralisée Airtable', included: true },
        { text: 'Support prioritaire', included: true },
      ],
    },
  }

  return (
    <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Commencez avec Starter, évoluez vers Pro quand vous êtes prêt
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-[rgba(255,255,255,0.05)] rounded-full">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-[#FF5C00] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                billingPeriod === 'annual'
                  ? 'bg-[#FF5C00] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annuel
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-semibold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <Card className="p-8 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] relative">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{plans.starter.name}</h3>
              <p className="text-gray-400">{plans.starter.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">
                  {billingPeriod === 'monthly' ? plans.starter.monthly : plans.starter.annual}€
                </span>
                <span className="text-gray-400">/mois</span>
              </div>
              {billingPeriod === 'annual' && (
                <p className="text-sm text-gray-500 mt-2">
                  Soit {plans.starter.annual * 12}€/an (au lieu de {plans.starter.monthly * 12}€)
                </p>
              )}
            </div>

            <Button
              className="w-full mb-6 bg-white text-black hover:bg-gray-200"
              onClick={() => window.location.href = `/signup?plan=starter&billing=${billingPeriod}`}
            >
              Commencer avec Starter
            </Button>

            <ul className="space-y-3">
              {plans.starter.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={feature.included ? 'text-white' : 'text-gray-600'}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 bg-gradient-to-br from-[rgba(255,92,0,0.1)] to-[rgba(255,138,61,0.05)] border-[#FF5C00] relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-[#FF5C00] text-white text-sm font-semibold rounded-full">
                ⭐ Populaire
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{plans.pro.name}</h3>
              <p className="text-gray-400">{plans.pro.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">
                  {billingPeriod === 'monthly' ? plans.pro.monthly : plans.pro.annual}€
                </span>
                <span className="text-gray-400">/mois</span>
              </div>
              {billingPeriod === 'annual' && (
                <p className="text-sm text-gray-500 mt-2">
                  Soit {plans.pro.annual * 12}€/an (au lieu de {plans.pro.monthly * 12}€)
                </p>
              )}
            </div>

            <Button
              className="w-full mb-6 bg-[#FF5C00] text-white hover:bg-[#FF7A2D]"
              onClick={() => window.location.href = `/signup?plan=pro&billing=${billingPeriod}`}
            >
              Commencer avec Pro
            </Button>

            <ul className="space-y-3">
              {plans.pro.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#FF5C00] flex-shrink-0 mt-0.5" />
                  <span className="text-white">{feature.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Questions fréquentes
          </h3>
          <div className="space-y-4">
            {[
              {
                q: 'Puis-je changer de plan plus tard ?',
                a: 'Oui, vous pouvez upgrader du plan Starter vers Pro à tout moment.',
              },
              {
                q: 'Y a-t-il un essai gratuit ?',
                a: 'Oui, 7 jours d\'essai gratuit sur tous les plans, sans carte bancaire requise.',
              },
              {
                q: 'Comment fonctionne le scoring IA ?',
                a: 'Notre IA analyse chaque commentaire Instagram et lui attribue un score de 1 à 10 basé sur l\'intention d\'achat, l\'urgence et la qualification.',
              },
              {
                q: 'Puis-je annuler à tout moment ?',
                a: 'Oui, sans engagement. Vous pouvez annuler votre abonnement à tout moment.',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-6 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-xl"
              >
                <summary className="cursor-pointer font-semibold text-white list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-[#FF5C00] group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
