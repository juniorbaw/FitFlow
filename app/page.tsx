'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const content = {
  fr: {
    nav: {
      login: 'Connexion',
      signup: 'Essai gratuit',
      language: 'FR',
    },
    hero: {
      headline: 'Le studio digital des coachs fitness qui veulent des clients qualifiés chaque semaine.',
      highlight: 'clients qualifiés',
      subhead:
        "FitFlow automatise vos conversations Instagram pour transformer les commentaires en rendez-vous et en ventes. Conçu pour les coachs fitness premium.",
      primaryCta: 'Commencer gratuitement',
      secondaryCta: 'Voir la démo',
      trust: 'Essai 14 jours gratuit • Sans carte bancaire • Mise en place en 10 minutes',
      badge: 'N°1 Automation Instagram pour coachs fitness',
    },
    stats: [
      { value: '7.5x', label: 'Plus de conversions Instagram' },
      { value: '10h', label: 'Gagnées chaque semaine' },
      { value: '97%', label: 'Coach satisfaction' },
    ],
    logos: {
      title: 'Adopté par les coachs et studios les plus exigeants',
      items: ['PulseLab', 'HeroFit', 'Studio Forme', 'Athletica', 'Core+'],
    },
    features: {
      title: 'Un design pensé pour convertir',
      subtitle: 'Chaque interaction devient une opportunité de coaching premium.',
      items: [
        {
          title: 'Réponses instantanées & personnalisées',
          description:
            "L'IA FitFlow comprend le contexte et répond avec votre voix pour nourrir la relation et guider vers la prise de rendez-vous.",
        },
        {
          title: 'Scoring intelligent des leads',
          description:
            'Priorisez automatiquement les prospects chauds et déclenchez des séquences adaptées à leur niveau de motivation.',
        },
        {
          title: 'Calendrier rempli sans effort',
          description:
            'Synchronisez votre agenda et laissez FitFlow proposer les créneaux parfaits pour vos séances et bilans.',
        },
      ],
    },
    workflow: {
      title: 'Le parcours FitFlow',
      steps: [
        {
          title: 'Connectez votre Instagram',
          description: "Connexion sécurisée via l'API Meta, sans risque pour votre compte.",
        },
        {
          title: 'Définissez vos offres',
          description: "Choisissez vos messages, offres et scripts pour chaque type d'interaction.",
        },
        {
          title: 'Laissez FitFlow closer',
          description: 'L’automatisation s’occupe des relances, de la qualification et du booking.',
        },
      ],
    },
    testimonials: {
      title: 'Ils ont transformé leur acquisition',
      items: [
        {
          quote:
            'En 3 semaines, j’ai doublé mes appels de découverte. Le style des messages est parfait.',
          name: 'Chloé Martin',
          role: 'Coach fitness & mobilité',
        },
        {
          quote: 'FitFlow a remplacé 2 heures de DMs par jour. Je ne reviendrai jamais en arrière.',
          name: 'Nicolas Rey',
          role: 'Préparateur physique',
        },
        {
          quote:
            'La qualif auto me permet de prendre seulement les clients premium. Mon chiffre a explosé.',
          name: 'Sarah Gomes',
          role: 'Studio manager',
        },
      ],
    },
    pricing: {
      title: 'Un plan simple pour coachs ambitieux',
      subtitle: 'Tout ce dont vous avez besoin pour convertir Instagram en revenus récurrents.',
      price: '€189',
      period: '/mois',
      cta: 'Lancer mon essai',
      includes: [
        'Automatisations illimitées',
        'Scoring IA + segmentation',
        'Synchronisation Calendly/Google',
        'Tableaux de bord conversions',
        'Support prioritaire coaches',
      ],
    },
    finalCta: {
      title: 'Prêt à remplir votre agenda ?',
      subtitle: 'Rejoignez les coachs fitness qui transforment Instagram en machine à clients.',
      button: 'Démarrer FitFlow',
    },
    footer: {
      rights: '© 2026 FitFlow. Tous droits réservés.',
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
    },
  },
  en: {
    nav: {
      login: 'Sign in',
      signup: 'Start free',
      language: 'EN',
    },
    hero: {
      headline: 'The growth studio for fitness coaches who want qualified clients every week.',
      highlight: 'qualified clients',
      subhead:
        'FitFlow automates Instagram conversations to turn comments into booked sessions and revenue. Built for premium fitness coaches.',
      primaryCta: 'Start free',
      secondaryCta: 'Watch demo',
      trust: '14-day free trial • No credit card • Live in 10 minutes',
      badge: '#1 Instagram Automation for Fitness Coaches',
    },
    stats: [
      { value: '7.5x', label: 'More Instagram conversions' },
      { value: '10h', label: 'Saved every week' },
      { value: '97%', label: 'Coach satisfaction' },
    ],
    logos: {
      title: 'Trusted by elite coaches & studios',
      items: ['PulseLab', 'HeroFit', 'Studio Forme', 'Athletica', 'Core+'],
    },
    features: {
      title: 'A design built to convert',
      subtitle: 'Every interaction becomes a premium coaching opportunity.',
      items: [
        {
          title: 'Instant, personalized replies',
          description:
            'FitFlow AI understands context and responds in your voice to nurture trust and drive booking.',
        },
        {
          title: 'Smart lead scoring',
          description: 'Automatically prioritize hot prospects and trigger sequences based on motivation.',
        },
        {
          title: 'Calendar filled effortlessly',
          description: 'Sync your schedule and let FitFlow propose the perfect session times.',
        },
      ],
    },
    workflow: {
      title: 'The FitFlow journey',
      steps: [
        {
          title: 'Connect Instagram',
          description: 'Secure Meta API connection without risking your account.',
        },
        {
          title: 'Define your offers',
          description: 'Choose messages, offers, and scripts for every interaction type.',
        },
        {
          title: 'Let FitFlow close',
          description: 'Automation handles follow-ups, qualification, and booking.',
        },
      ],
    },
    testimonials: {
      title: 'They transformed acquisition',
      items: [
        {
          quote:
            'In 3 weeks I doubled discovery calls. The tone of the messages is exactly right.',
          name: 'Chloé Martin',
          role: 'Fitness & mobility coach',
        },
        {
          quote: 'FitFlow replaced 2 hours of DMs per day. I will never go back.',
          name: 'Nicolas Rey',
          role: 'Performance coach',
        },
        {
          quote:
            'Auto qualification lets me focus on premium clients only. Revenue skyrocketed.',
          name: 'Sarah Gomes',
          role: 'Studio manager',
        },
      ],
    },
    pricing: {
      title: 'One simple plan for ambitious coaches',
      subtitle: 'Everything you need to convert Instagram into recurring revenue.',
      price: '€189',
      period: '/month',
      cta: 'Start my trial',
      includes: [
        'Unlimited automations',
        'AI scoring + segmentation',
        'Calendly/Google sync',
        'Conversion dashboards',
        'Priority coach support',
      ],
    },
    finalCta: {
      title: 'Ready to fill your calendar?',
      subtitle: 'Join fitness coaches turning Instagram into a client machine.',
      button: 'Launch FitFlow',
    },
    footer: {
      rights: '© 2026 FitFlow. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
  },
}

export default function LandingPage() {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('fitflow-lang') : null
    if (stored === 'fr' || stored === 'en') {
      setLanguage(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fitflow-lang', language)
    }
  }, [language])

  const copy = useMemo(() => content[language], [language])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950 font-bold">
              F
            </div>
            <span className="text-lg font-semibold tracking-tight">FitFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            >
              {copy.nav.language}
            </button>
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-white">
                {copy.nav.login}
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-slate-950 hover:bg-white/90">{copy.nav.signup}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-surface">
          <div className="container mx-auto grid items-center gap-12 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <span className="badge-premium">{copy.hero.badge}</span>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
                {copy.hero.headline.split(copy.hero.highlight)[0]}
                <span className="text-white/90 underline decoration-emerald-400/80 decoration-4 underline-offset-4">
                  {copy.hero.highlight}
                </span>
                {copy.hero.headline.split(copy.hero.highlight)[1]}
              </h1>
              <p className="text-lg text-white/70 md:text-xl">{copy.hero.subhead}</p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-emerald-400 text-slate-950 hover:bg-emerald-300" size="lg">
                  {copy.hero.primaryCta}
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  size="lg"
                >
                  {copy.hero.secondaryCta}
                </Button>
              </div>
              <p className="text-sm text-white/60">{copy.hero.trust}</p>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[36px] bg-emerald-400/20 blur-3xl" />
              <Card className="glass-card relative overflow-hidden border-white/10 bg-white/5">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                      FitFlow Studio
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">Live</span>
                  </div>
                  <div className="mt-6">
                    <Image
                      src="/fitflow-hero.svg"
                      alt="FitFlow premium automation"
                      width={520}
                      height={420}
                      className="w-full"
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-white/70">
                    {copy.stats.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-lg font-semibold text-white">{item.value}</p>
                        <p>{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-12">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm uppercase tracking-[0.4em] text-white/40">
              {copy.logos.title}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-white/70">
              {copy.logos.items.map((logo) => (
                <span
                  key={logo}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container mx-auto px-4 py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">FitFlow</p>
              <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">{copy.features.title}</h2>
              <p className="mt-4 text-white/70">{copy.features.subtitle}</p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {copy.features.items.map((item) => (
                <Card key={item.title} className="glass-card border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950">
          <div className="container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">Automation flow</p>
              <h3 className="mt-4 text-3xl font-semibold text-white">{copy.workflow.title}</h3>
              <div className="mt-6 space-y-5">
                {copy.workflow.steps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-slate-950 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                      <p className="text-sm text-white/70">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6">
              <Card className="glass-card border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Live playbook</p>
                <h4 className="mt-3 text-2xl font-semibold text-white">
                  Scripts premium, DM automation, et dashboards en temps réel.
                </h4>
                <p className="mt-3 text-sm text-white/70">
                  Ajustez vos messages, visualisez vos conversions et pilotez vos campagnes comme un studio haut de
                  gamme.
                </p>
              </Card>
              <Card className="glass-card border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Coach insights</p>
                <h4 className="mt-3 text-2xl font-semibold text-white">Lead scoring, KPI & relances automatiques.</h4>
                <p className="mt-3 text-sm text-white/70">
                  L’intelligence FitFlow sélectionne vos prospects prêts et alimente votre pipeline.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Reviews</p>
                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">{copy.testimonials.title}</h2>
              </div>
              <Button className="bg-white text-slate-950 hover:bg-white/90">{copy.hero.secondaryCta}</Button>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {copy.testimonials.items.map((testimonial) => (
                <Card key={testimonial.name} className="glass-card border-white/10 bg-white/5 p-6">
                  <p className="text-base text-white/80">“{testimonial.quote}”</p>
                  <p className="mt-6 text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-white/50">{testimonial.role}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950">
          <div className="container mx-auto px-4 py-20">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-emerald-400/20 via-white/5 to-transparent p-8">
                <h2 className="text-3xl font-semibold text-white md:text-4xl">{copy.pricing.title}</h2>
                <p className="mt-4 text-white/70">{copy.pricing.subtitle}</p>
                <div className="mt-6 flex items-end gap-3">
                  <span className="text-5xl font-semibold text-white">{copy.pricing.price}</span>
                  <span className="text-sm text-white/60">{copy.pricing.period}</span>
                </div>
                <Button className="mt-6 bg-emerald-400 text-slate-950 hover:bg-emerald-300" size="lg">
                  {copy.pricing.cta}
                </Button>
              </div>
              <Card className="glass-card border-white/10 bg-white/5 p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Included</p>
                <ul className="mt-6 space-y-3 text-sm text-white/70">
                  {copy.pricing.includes.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container mx-auto px-4 py-20">
            <div className="rounded-[36px] border border-white/10 bg-gradient-to-r from-emerald-400/20 via-white/5 to-transparent p-10 text-center">
              <h2 className="text-3xl font-semibold text-white md:text-4xl">{copy.finalCta.title}</h2>
              <p className="mt-4 text-white/70">{copy.finalCta.subtitle}</p>
              <Button className="mt-6 bg-white text-slate-950 hover:bg-white/90" size="lg">
                {copy.finalCta.button}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950 py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-white/50 md:flex-row">
          <span>{copy.footer.rights}</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white">
              {copy.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-white">
              {copy.footer.terms}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
