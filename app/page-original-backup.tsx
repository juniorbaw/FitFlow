'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Zap, TrendingUp, Users, BarChart3, Sparkles } from 'lucide-react'

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"
const BLUE = "#3B82F6"

const stats = [
  { value: "3 200€", label: "Revenue moyen/mois", icon: "💰" },
  { value: "150+", label: "Leads/semaine", icon: "👥" },
  { value: "12%", label: "Taux conversion", icon: "📈" },
  { value: "24/7", label: "Automatisation", icon: "⚡" },
]

const features = [
  { icon: "🎯", title: "Scoring IA", desc: "Gemini analyse chaque commentaire et note le potentiel de 1 à 10" },
  { icon: "✉️", title: "DMs Auto", desc: "ManyChat envoie des messages personnalisés selon le score du lead" },
  { icon: "📊", title: "Dashboard", desc: "Analytics temps réel : leads, conversions, revenue par post" },
  { icon: "🔥", title: "Funnel Visuel", desc: "Suivez votre taux de conversion à chaque étape" },
  { icon: "💎", title: "VIP Detection", desc: "Les leads 9-10/10 sont priorisés automatiquement" },
  { icon: "📈", title: "ROI Tracking", desc: "Calculez votre retour sur investissement en temps réel" },
]

const testimonials = [
  { name: "Marie F.", role: "Coach Fitness", quote: "150 leads/semaine et 18 conversions. FitFlow a transformé mon business !", score: "9.2/10" },
  { name: "Thomas C.", role: "Personal Trainer", quote: "Le scoring IA est bluffant. Je ne perds plus de temps sur des leads froids.", score: "8.8/10" },
  { name: "Sophie W.", role: "Nutrition Coach", quote: "3 200€ de revenue supplémentaire le premier mois. Incroyable !", score: "9.5/10" },
]

export default function HomePage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fafafa", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      {/* HEADER */}
      <div style={{ padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.8)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: -0.5 }}>
            Fit<span style={{ color: ORANGE }}>Flow</span>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link href="/demo" style={{ color: "#888", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}>Démo</Link>
            <Link href="/login" style={{ color: "#888", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}>Connexion</Link>
            <Link href="/signup" style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, color: "white", padding: "10px 24px", borderRadius: 20, fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "transform 0.2s", display: "inline-block" }}>
              Commencer →
            </Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: "100px 32px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "20%", width: 500, height: 500, background: `${ORANGE}15`, borderRadius: "50%", filter: "blur(100px)" }}></div>
        <div style={{ position: "absolute", bottom: 0, right: "20%", width: 500, height: 500, background: `${BLUE}15`, borderRadius: "50%", filter: "blur(100px)" }}></div>
        
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: "rgba(255,92,0,0.1)", border: `1px solid rgba(255,92,0,0.2)`, padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, color: ORANGE, marginBottom: 24 }}>
            <Sparkles style={{ width: 14, height: 14, display: "inline", marginRight: 6 }} />
            Automatisation IA pour coachs Instagram
          </div>
          
          <h1 style={{ fontSize: 72, fontWeight: 900, letterSpacing: -2, lineHeight: 1.1, marginBottom: 24, background: "linear-gradient(135deg, #fff, #aaa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Transformez vos commentaires Instagram en{' '}
            <span style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              clients payants
            </span>
          </h1>
          
          <p style={{ fontSize: 20, color: "#888", lineHeight: 1.6, marginBottom: 40, maxWidth: 700, margin: "0 auto 40px" }}>
            FitFlow détecte, score et répond automatiquement à chaque commentaire. 
            Vous générez des leads qualifiés 24/7, sans lever le petit doigt.
          </p>
          
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 60 }}>
            <Link href="/signup" style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, color: "white", padding: "16px 40px", borderRadius: 24, fontSize: 16, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: `0 8px 32px ${ORANGE}40` }}>
              Commencer gratuitement <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
            <Link href="/demo" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "16px 40px", borderRadius: 24, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
              📺 Voir la vidéo
            </Link>
          </div>
          
          {/* VIDEO EXPLAINER - Nouvelle section */}
          <div style={{ marginTop: 80, marginBottom: 40 }}>
            <div style={{ maxWidth: 840, margin: "0 auto" }}>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: 2 }}>Comment ça marche</span>
              </div>
              <div style={{ position: "relative", paddingBottom: "61.9%", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)", borderRadius: 24, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
                <iframe
                  src="/videos/explainer.html"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                  allow="autoplay"
                  loading="lazy"
                  title="FitFlow Explainer"
                />
              </div>
            </div>
          </div>

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, maxWidth: 900, margin: "0 auto" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: ORANGE, marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: "80px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -1, marginBottom: 16 }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ fontSize: 18, color: "#888" }}>
              Un système complet pour automatiser votre génération de leads Instagram
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {features.map((feature, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, transition: "all 0.3s" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${ORANGE}40`)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{feature.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: "white" }}>{feature.title}</h3>
                <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -1, marginBottom: 16 }}>
              Tarifs simples et transparents
            </h2>
            <p style={{ fontSize: 18, color: "#888", marginBottom: 32 }}>
              Choisissez le plan qui correspond à votre ambition
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 12 }}>
              <button onClick={() => setBillingPeriod('monthly')} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: billingPeriod === 'monthly' ? `${ORANGE}20` : "transparent", color: billingPeriod === 'monthly' ? ORANGE : "#888", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
                Mensuel
              </button>
              <button onClick={() => setBillingPeriod('annual')} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: billingPeriod === 'annual' ? `${ORANGE}20` : "transparent", color: billingPeriod === 'annual' ? ORANGE : "#888", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
                Annuel <span style={{ background: GREEN, color: "white", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 800 }}>-20%</span>
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {/* STARTER */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 40 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Starter</h3>
              <div style={{ fontSize: 48, fontWeight: 900, color: ORANGE, marginBottom: 24 }}>
                {billingPeriod === 'monthly' ? '47' : '38'}€<span style={{ fontSize: 18, color: "#666" }}>/mois</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
                {["Détection auto commentaires", "DMs ManyChat", "Jusqu'à 50 leads/mois", "Dashboard basique"].map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, fontSize: 14, color: "#ccc" }}>
                    <Check style={{ width: 18, height: 18, color: GREEN }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=starter" style={{ display: "block", textAlign: "center", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "14px", borderRadius: 16, fontSize: 16, fontWeight: 700, textDecoration: "none", transition: "all 0.2s" }}>
                Choisir Starter
              </Link>
            </div>

            {/* PRO */}
            <div style={{ background: `linear-gradient(135deg, ${ORANGE}15, ${BLUE}15)`, border: `2px solid ${ORANGE}`, borderRadius: 24, padding: 40, position: "relative" }}>
              <div style={{ position: "absolute", top: -12, right: 32, background: ORANGE, color: "white", padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                POPULAIRE
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Pro</h3>
              <div style={{ fontSize: 48, fontWeight: 900, color: ORANGE, marginBottom: 24 }}>
                {billingPeriod === 'monthly' ? '147' : '118'}€<span style={{ fontSize: 18, color: "#666" }}>/mois</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
                {["Tout Starter +", "Scoring IA Gemini", "Dashboard analytics complet", "Leads illimités", "Tracking ROI", "Support prioritaire"].map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, fontSize: 14, color: "#ccc" }}>
                    <Check style={{ width: 18, height: 18, color: GREEN }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=pro" style={{ display: "block", textAlign: "center", background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, color: "white", padding: "14px", borderRadius: 16, fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: `0 8px 24px ${ORANGE}40` }}>
                Choisir Pro →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: "80px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: 48, fontWeight: 900, textAlign: "center", marginBottom: 60 }}>
            Ils génèrent déjà des leads avec FitFlow
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: ORANGE, marginBottom: 16 }}>{t.score}</div>
                <p style={{ fontSize: 15, color: "#ccc", lineHeight: 1.6, marginBottom: 20 }}>"{t.quote}"</p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "white" }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ padding: "100px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: `${ORANGE}10`, borderRadius: "50%", filter: "blur(100px)" }}></div>
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 56, fontWeight: 900, letterSpacing: -1, marginBottom: 24 }}>
            Prêt à transformer votre Instagram en machine à leads ?
          </h2>
          <p style={{ fontSize: 20, color: "#888", marginBottom: 40 }}>
            Rejoignez les coachs qui génèrent 150+ leads qualifiés chaque semaine
          </p>
          <Link href="/signup" style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, color: "white", padding: "18px 48px", borderRadius: 24, fontSize: 18, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: `0 12px 40px ${ORANGE}50` }}>
            Commencer maintenant <ArrowRight style={{ width: 20, height: 20 }} />
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: "40px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <div style={{ color: "#666", fontSize: 14 }}>
          © 2026 FitFlow. Tous droits réservés.
        </div>
      </div>
    </div>
  )
}
