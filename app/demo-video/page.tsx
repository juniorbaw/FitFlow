'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DemoVideoPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [videoWatched, setVideoWatched] = useState(0) // Pourcentage regardé
  const [showCTA, setShowCTA] = useState(false)
  
  useEffect(() => {
    // Afficher le CTA après 15 secondes ou 30% de vidéo regardée
    const timer = setTimeout(() => setShowCTA(true), 15000)
    return () => clearTimeout(timer)
  }, [])

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const supabase = createClient()
      
      // Enregistrer dans waitlist
      const { error } = await supabase
        .from('waitlist')
        .insert([
          { 
            email, 
            source: 'demo-video-page',
            video_completion: videoWatched,
            created_at: new Date().toISOString()
          }
        ])
      
      if (error) throw error
      
      setSubmitStatus('success')
      
      // Rediriger vers signup après 2 secondes
      setTimeout(() => {
        router.push('/signup?ref=demo-video')
      }, 2000)
      
    } catch (error) {
      console.error('Erreur waitlist:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header avec retour */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
            Fit<span style={{ color: '#FF5C00' }}>Flow</span>
          </Link>
          <Link 
            href="/signup"
            className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ background: '#FF5C00', color: 'white' }}
          >
            Démarrer Gratuitement
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full" style={{ background: 'rgba(255, 92, 0, 0.1)', color: '#FF5C00' }}>
            <span className="text-sm font-semibold">🎥 Démo Interactive</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>
            Transformez Vos Commentaires<br />
            Instagram en <span style={{ color: '#FF5C00' }}>Clients Payants</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Découvrez comment FitFlow automatise 100% de votre prospection Instagram<br />
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Sans toucher votre téléphone.</span>
          </p>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span style={{ color: 'var(--text-secondary)' }}>Réponse en <strong>30 secondes</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <span style={{ color: 'var(--text-secondary)' }}><strong>IA Avancée</strong> (Gemini)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span style={{ color: 'var(--text-secondary)' }}>+<strong>3-5 clients/semaine</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Vidéo Section */}
      <section className="pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div 
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{ 
              background: 'var(--bg-card)',
              border: '1px solid var(--border)'
            }}
          >
            {/* Overlay de progression */}
            {showCTA && submitStatus === 'idle' && (
              <div 
                className="absolute top-4 right-4 z-10 px-4 py-2 rounded-lg backdrop-blur-xl"
                style={{ background: 'rgba(255, 92, 0, 0.9)', color: 'white' }}
              >
                <span className="text-sm font-semibold">🎁 Offre limitée visible ↓</span>
              </div>
            )}
            
            <iframe 
              src="/videos/explainer.html" 
              className="w-full"
              style={{ height: '600px', border: 'none' }}
              title="FitFlow Demo Explicative"
              onLoad={() => {
                // Tracking du chargement
                console.log('Vidéo chargée')
              }}
            />
          </div>

          {/* Trust Indicators sous la vidéo */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
              <span>✅</span>
              <span style={{ color: 'var(--text-secondary)' }}>Setup en 10 minutes</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
              <span>🔒</span>
              <span style={{ color: 'var(--text-secondary)' }}>Conforme Instagram API</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
              <span>⚡</span>
              <span style={{ color: 'var(--text-secondary)' }}>Résultats dès J+1</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Principal avec formulaire waitlist */}
      <section className="py-16 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto text-center">
          {submitStatus === 'success' ? (
            <div className="p-8 rounded-2xl" style={{ background: 'rgba(0, 210, 106, 0.1)', border: '2px solid #00D26A' }}>
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#00D26A' }}>
                Bienvenue dans FitFlow !
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Redirection vers la création de compte...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl md:text-5xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>
                Prêt à Automatiser Votre Croissance ?
              </h2>
              
              <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
                Rejoignez les coachs qui génèrent <strong>3-5 nouveaux clients par semaine</strong><br />
                grâce à l'automatisation Instagram
              </p>

              {/* Offre limitée */}
              <div 
                className="mb-8 p-6 rounded-xl"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255, 92, 0, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  border: '2px solid #FF5C00'
                }}
              >
                <div className="text-sm font-bold mb-2" style={{ color: '#FF5C00' }}>
                  🔥 OFFRE DE LANCEMENT
                </div>
                <div className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                  Essai Gratuit 14 Jours
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  Sans carte bancaire • Annulation en 1 clic • Support prioritaire
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="flex-1 px-6 py-4 rounded-lg text-lg outline-none focus:ring-2 transition-all"
                    style={{ 
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      background: '#FF5C00',
                      color: 'white',
                      minWidth: '180px'
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Envoi...
                      </span>
                    ) : (
                      '🚀 Commencer Gratuit'
                    )}
                  </button>
                </div>
                
                {submitStatus === 'error' && (
                  <p className="mt-4 text-red-500 text-sm">
                    Une erreur est survenue. Veuillez réessayer.
                  </p>
                )}
                
                <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  ✨ Aucune carte requise • Accès immédiat à toutes les fonctionnalités
                </p>
              </form>

              {/* Garantie */}
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Installation en 10 min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💳</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Aucun paiement maintenant</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔒</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Données sécurisées</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Section Bénéfices Clés */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            Ce Que Vous Obtenez Avec FitFlow
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'IA Ultra-Performante',
                description: 'Gemini AI analyse chaque commentaire et génère des réponses personnalisées qui convertissent',
                metric: '85% taux de réponse'
              },
              {
                icon: '⚡',
                title: 'Automatisation 24/7',
                description: 'Réponses instantanées même pendant votre sommeil. Ne perdez plus jamais un lead chaud',
                metric: 'Réponse en 30 sec'
              },
              {
                icon: '📊',
                title: 'Analytics Puissants',
                description: 'Dashboard en temps réel pour suivre vos leads, conversions et revenus générés',
                metric: 'ROI en temps réel'
              },
              {
                icon: '💬',
                title: 'Messages Personnalisés',
                description: 'Templates IA qui s\'adaptent au profil de chaque prospect pour maximiser les conversions',
                metric: '+40% conversion'
              },
              {
                icon: '🎯',
                title: 'Lead Scoring Intelligent',
                description: 'L\'IA note chaque lead de 1-10 pour prioriser automatiquement les prospects chauds',
                metric: 'Priorisation auto'
              },
              {
                icon: '🔗',
                title: 'Intégrations Natives',
                description: 'Stripe, Instagram, Gemini AI. Tout fonctionne ensemble sans configuration complexe',
                metric: 'Setup en 10 min'
              }
            ].map((benefit, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-xl transition-all hover:scale-105 cursor-pointer"
                style={{ 
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)'
                }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {benefit.title}
                </h3>
                <p className="mb-3" style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                  {benefit.description}
                </p>
                <div 
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ background: 'rgba(255, 92, 0, 0.1)', color: '#FF5C00' }}
                >
                  {benefit.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            Questions Fréquentes
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Est-ce que FitFlow respecte les règles Instagram ?',
                a: 'Absolument ! Nous utilisons uniquement l\'API officielle Instagram approuvée par Meta. Votre compte est 100% sécurisé.'
              },
              {
                q: 'Combien de temps faut-il pour voir des résultats ?',
                a: 'La plupart de nos utilisateurs génèrent leurs premiers leads qualifiés dans les 24-48h après installation. Les premiers clients payants arrivent généralement sous 7-10 jours.'
              },
              {
                q: 'L\'essai gratuit est-il vraiment sans engagement ?',
                a: 'Oui ! 14 jours gratuits, aucune carte bancaire requise. Vous pouvez annuler en 1 clic à tout moment.'
              },
              {
                q: 'Dois-je avoir des compétences techniques ?',
                a: 'Zéro compétence technique nécessaire. Le setup guidé prend 10 minutes chrono. Notre support vous aide si besoin.'
              },
              {
                q: 'Combien de temps dois-je y consacrer par jour ?',
                a: '5-10 minutes maximum pour vérifier vos nouveaux leads. Tout le reste est automatisé 24/7.'
              },
              {
                q: 'Que se passe-t-il avec mes données ?',
                a: 'Vos données sont hébergées sur Supabase (infrastructure sécurisée). Nous ne vendons JAMAIS vos informations. Vous restez propriétaire à 100%.'
              }
            ].map((faq, idx) => (
              <details 
                key={idx}
                className="p-6 rounded-xl cursor-pointer group"
                style={{ 
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)'
                }}
              >
                <summary className="font-bold text-lg list-none flex justify-between items-center" style={{ color: 'var(--text-primary)' }}>
                  <span>{faq.q}</span>
                  <span className="text-2xl group-open:rotate-180 transition-transform">›</span>
                </summary>
                <p className="mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>
            Rejoignez la Révolution<br />
            de l'Automatisation Fitness
          </h2>
          
          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Pendant que vous lisez ceci, vos concurrents automatisent déjà.<br />
            <strong>Ne vous laissez pas distancer.</strong>
          </p>

          <Link
            href="/signup"
            className="inline-block px-12 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-2xl"
            style={{ 
              background: 'linear-gradient(135deg, #FF5C00 0%, #FF8A00 100%)',
              color: 'white'
            }}
          >
            🚀 Démarrer Mon Essai Gratuit
          </Link>

          <p className="mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Setup en 10 minutes • Aucune carte requise • Support 7j/7
          </p>
        </div>
      </section>

      {/* Footer minimaliste */}
      <footer className="py-8 px-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div>© 2026 FitFlow. Tous droits réservés.</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:underline">Confidentialité</Link>
            <Link href="/terms" className="hover:underline">Conditions</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
