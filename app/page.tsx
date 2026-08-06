'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"
const BLUE = "#3B82F6"

const features = [
  { icon: "🤖", title: "IA de Scoring", desc: "Chaque commentaire est analysé et noté de 1 à 10 selon l'intention d'achat réelle." },
  { icon: "⚡", title: "DM en 30 Secondes", desc: "Les prospects chauds reçoivent un message personnalisé instantanément." },
  { icon: "🎯", title: "Leads Qualifiés", desc: "Fini le tri manuel. L'IA priorise les prospects les plus susceptibles de convertir." },
  { icon: "📊", title: "Dashboard Temps Réel", desc: "Suivez vos leads, conversions et revenus dans un tableau de bord clair." },
  { icon: "💬", title: "Messages Adaptatifs", desc: "Chaque DM est personnalisé selon le profil et le commentaire du prospect." },
  { icon: "🔒", title: "100% Conforme", desc: "API officielle Instagram. Votre compte est protégé, aucun risque de ban." },
]

const steps = [
  { num: "01", title: "Un prospect commente", desc: "Quelqu'un commente votre post Instagram avec une intention d'achat.", visual: "💬" },
  { num: "02", title: "L'IA analyse et score", desc: "En moins de 5 secondes, le commentaire est scoré de 1 à 10 par notre IA.", visual: "🧠" },
  { num: "03", title: "DM personnalisé envoyé", desc: "Si le score est ≥ 7, un DM sur-mesure est envoyé automatiquement.", visual: "🚀" },
]

const comparisons = [
  { label: "Temps de réponse", before: "2-24h", after: "30 sec", gain: "×48" },
  { label: "Qualification", before: "Au feeling", after: "Score IA 1-10", gain: "+40%" },
  { label: "Disponibilité", before: "8h/jour", after: "24/7", gain: "×3" },
  { label: "Temps/semaine", before: "10-15h", after: "30 min", gain: "-95%" },
]

const faqs = [
  { q: "Est-ce conforme aux règles Instagram ?", a: "Oui. FitFlow utilise uniquement l'API officielle approuvée par Meta. Votre compte est 100% sécurisé." },
  { q: "Combien de temps avant les premiers résultats ?", a: "La plupart des utilisateurs génèrent leurs premiers leads qualifiés en 24-48h. Les premiers clients payants sous 7-10 jours." },
  { q: "Dois-je avoir des compétences techniques ?", a: "Zéro. Notre setup guidé prend 10 minutes. Si vous savez poster sur Instagram, vous savez utiliser FitFlow." },
  { q: "L'essai est-il vraiment gratuit ?", a: "Oui ! 14 jours complets, toutes les fonctionnalités, aucune carte bancaire requise." },
  { q: "Combien de temps dois-je y consacrer ?", a: "5-10 minutes par jour maximum pour vérifier vos leads. Tout le reste est automatisé." },
]

const plans = [
  { name: "Starter", price: "29", features: ["50 leads/mois", "Score IA basique", "5 Auto-DMs/jour", "Dashboard"], cta: "Commencer", popular: false, href: "/signup" },
  { name: "Pro", price: "47", features: ["Leads illimités", "Score IA avancé", "50 Auto-DMs/jour", "Content AI", "Templates personnalisés", "Support prioritaire"], cta: "Essai Gratuit 14j", popular: true, href: "/signup" },
  { name: "Elite", price: "97", features: ["Tout le plan Pro", "100 Auto-DMs/jour", "Analytics avancés", "Account manager dédié", "Setup personnalisé"], cta: "Nous contacter", popular: false, href: "/contact" },
]

export default function FitFlowLanding() {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (count < 30000) {
      const timer = setTimeout(() => setCount((c) => Math.min(c + 600, 30000)), 20)
      return () => clearTimeout(timer)
    }
  }, [count])

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fafafa", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: "hidden" }}>

      {/* HEADER */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 40px", height: 64,
        background: scrolled ? "rgba(5,5,8,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.3s"
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
          Fit<span style={{ color: ORANGE }}>Flow</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#features" style={{ color: "#999", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Fonctionnalités</a>
          <a href="#pricing" style={{ color: "#999", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Tarifs</a>
          <a href="#faq" style={{ color: "#999", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>FAQ</a>
          <Link href="/login" style={{ color: "#ccc", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Connexion</Link>
          <Link href="/signup" style={{
            background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
            color: "white", padding: "10px 24px", borderRadius: 50,
            fontSize: 14, fontWeight: 700, textDecoration: "none",
            boxShadow: `0 4px 20px ${ORANGE}40`
          }}>
            Essai Gratuit →
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: "center", position: "relative" }}>
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 700, height: 700,
          background: `radial-gradient(circle, ${ORANGE}12 0%, transparent 70%)`,
          pointerEvents: "none"
        }} />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,92,0,0.08)", border: "1px solid rgba(255,92,0,0.2)",
            padding: "8px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600,
            color: ORANGE, marginBottom: 32
          }}>
            <span style={{ width: 6, height: 6, background: GREEN, borderRadius: "50%", display: "inline-block" }} />
            Bêta Privée — Places limitées
          </div>
          <h1 style={{ fontSize: 60, fontWeight: 900, letterSpacing: -2, lineHeight: 1.08, marginBottom: 24 }}>
            Transformez Vos<br />Commentaires Instagram en{" "}
            <span style={{
              background: `linear-gradient(135deg, ${ORANGE}, #FFB347)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              Clients Payants
            </span>
          </h1>
          <p style={{ fontSize: 20, color: "#999", lineHeight: 1.6, marginBottom: 12, maxWidth: 600, margin: "0 auto 12px" }}>
            L&apos;IA détecte vos prospects chauds et leur envoie un DM personnalisé <strong style={{ color: "white" }}>en 30 secondes</strong>. Sans toucher votre téléphone.
          </p>
          <p style={{ fontSize: 15, color: "#555", marginBottom: 40 }}>
            Sans code. Sans compétence technique. Setup en 10 minutes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <Link href="/signup" style={{
              background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
              color: "white", padding: "18px 48px", borderRadius: 16,
              fontSize: 17, fontWeight: 700, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 10,
              boxShadow: `0 16px 48px ${ORANGE}35`
            }}>
              Démarrer Gratuitement (14 jours)
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#666" }}>
              <span>✓ Aucune carte bancaire</span>
              <span>✓ Setup en 10 min</span>
              <span>✓ Support 7j/7</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 72, maxWidth: 700, margin: "72px auto 0" }}>
            {[
              { val: "3-5", label: "Nouveaux clients/semaine" },
              { val: "30s", label: "Temps de réponse" },
              { val: "85%", label: "Taux de réponse" },
              { val: "24/7", label: "Automatisation active" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16, padding: "24px 16px", textAlign: "center"
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: ORANGE, marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#777", lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN POINT - 30,000€ */}
      <section style={{ padding: "80px 24px", position: "relative" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto", textAlign: "center",
          background: "linear-gradient(180deg, rgba(255,92,0,0.06) 0%, rgba(255,92,0,0) 100%)",
          borderRadius: 32, padding: "64px 48px",
          border: "1px solid rgba(255,92,0,0.1)"
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: ORANGE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            Ce que ça vous coûte de ne rien faire
          </p>
          <div style={{ fontSize: 80, fontWeight: 900, color: ORANGE, letterSpacing: -3, marginBottom: 8 }}>
            {count.toLocaleString()} €
          </div>
          <p style={{ fontSize: 18, color: "#888", marginBottom: 32 }}>de revenus perdus chaque année</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {["💬 Commentaires non lus", "⏰ 2h/jour gaspillées", "👻 Leads fantômes"].map((t, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                padding: "10px 20px", borderRadius: 50, fontSize: 14, fontWeight: 500, color: "#ccc"
              }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: ORANGE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Comment ça marche</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>3 Étapes. Zéro Effort.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {steps.map((step, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, padding: 32, position: "relative", overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute", top: -10, right: -10, fontSize: 100, fontWeight: 900,
                  color: "rgba(255,92,0,0.04)", lineHeight: 1
                }}>{step.num}</div>
                <div style={{ fontSize: 48, marginBottom: 20 }}>{step.visual}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: ORANGE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Étape {step.num}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: "white" }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: ORANGE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Aperçu du Dashboard</p>
          <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1, marginBottom: 48 }}>Tout sous contrôle</h2>
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: 32, textAlign: "left"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <span style={{ fontWeight: 800, fontSize: 18 }}>Fit<span style={{ color: ORANGE }}>Flow</span></span>
              {["Vue d'ensemble", "Leads", "Auto-DM", "Content AI"].map((t, i) => (
                <span key={i} style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: i === 0 ? "rgba(255,92,0,0.15)" : "transparent",
                  color: i === 0 ? ORANGE : "#666"
                }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Leads", val: "—", color: ORANGE },
                { label: "Score moyen", val: "—", color: BLUE },
                { label: "DMs envoyés", val: "—", color: "#fff" },
                { label: "Conversions", val: "—", color: GREEN },
              ].map((c, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: 16
                }}>
                  <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>{c.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: c.color }}>{c.val}</div>
                </div>
              ))}
            </div>
            <div style={{
              background: "rgba(255,255,255,0.02)", borderRadius: 12, height: 140,
              display: "flex", alignItems: "flex-end", padding: "16px 16px 0", gap: 8
            }}>
              {[35, 52, 28, 65, 44, 78, 58, 90, 72, 85, 95, 68].map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0",
                  background: `linear-gradient(180deg, ${ORANGE}, ${ORANGE}30)`
                }} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#555" }}>
              Aperçu — Les données réelles apparaissent dans votre dashboard
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: ORANGE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Fonctionnalités</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>Tout Ce Dont Vous Avez Besoin</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, padding: 32
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "rgba(255,92,0,0.08)", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 20
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: ORANGE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Comparaison</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>Avant vs Après FitFlow</h2>
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px",
              padding: "16px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)"
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}></span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>Sans</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>FitFlow</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>Gain</span>
            </div>
            {comparisons.map((c, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px",
                padding: "20px 28px", borderBottom: i < comparisons.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none"
              }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{c.label}</span>
                <span style={{ fontSize: 14, color: "#555", textAlign: "center" }}>{c.before}</span>
                <span style={{ fontSize: 14, color: ORANGE, fontWeight: 700, textAlign: "center" }}>{c.after}</span>
                <span style={{ fontSize: 13, color: GREEN, fontWeight: 800, textAlign: "center", background: "rgba(0,210,106,0.08)", borderRadius: 20, padding: "4px 0" }}>{c.gain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: ORANGE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Tarifs</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>Simple et Transparent</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "start" }}>
            {plans.map((plan, i) => (
              <div key={i} style={{
                background: plan.popular ? "rgba(255,92,0,0.04)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${plan.popular ? "rgba(255,92,0,0.3)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 20, padding: 36, position: "relative",
                transform: plan.popular ? "scale(1.03)" : "none"
              }}>
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                    color: "white", padding: "5px 16px", borderRadius: 50,
                    fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase"
                  }}>Populaire</div>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: plan.popular ? ORANGE : "white" }}>{plan.price}€</span>
                  <span style={{ fontSize: 14, color: "#666" }}>/mois</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#ccc" }}>
                      <span style={{ color: GREEN, fontSize: 16 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href={plan.href} style={{
                  display: "block", width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  fontSize: 15, fontWeight: 700, cursor: "pointer", textAlign: "center", textDecoration: "none",
                  background: plan.popular ? `linear-gradient(135deg, ${ORANGE}, #FF8A00)` : "rgba(255,255,255,0.06)",
                  color: "white",
                  boxShadow: plan.popular ? `0 8px 24px ${ORANGE}30` : "none"
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "80px 24px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: ORANGE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>Questions Fréquentes</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16, padding: "20px 24px", cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{faq.q}</span>
                  <span style={{
                    color: ORANGE, fontSize: 20, fontWeight: 300,
                    transform: openFaq === i ? "rotate(45deg)" : "none",
                    transition: "transform 0.2s"
                  }}>+</span>
                </div>
                {openFaq === i && (
                  <p style={{
                    marginTop: 16, paddingTop: 16,
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    color: "#999", lineHeight: 1.7, fontSize: 15
                  }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 500, height: 500, background: `radial-gradient(circle, ${ORANGE}10, transparent 70%)`,
          pointerEvents: "none"
        }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20 }}>
            Pendant Que Vous Hésitez,<br />
            Vos Concurrents{" "}
            <span style={{ color: ORANGE }}>Automatisent</span>
          </h2>
          <p style={{ fontSize: 18, color: "#888", marginBottom: 40 }}>
            Chaque jour sans FitFlow = des dizaines de leads perdus.
          </p>
          <Link href="/signup" style={{
            background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
            color: "white", padding: "18px 56px", borderRadius: 16,
            fontSize: 17, fontWeight: 700, textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 10,
            boxShadow: `0 16px 48px ${ORANGE}40`
          }}>
            Transformer Mon Instagram Maintenant
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <p style={{ marginTop: 20, fontSize: 13, color: "#555" }}>
            ✓ 14 jours gratuits · ✓ Aucune carte bancaire · ✓ Annulation en 1 clic
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "32px 40px", borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span style={{ color: "#444", fontSize: 13 }}>© 2026 FitFlow. Tous droits réservés.</span>
        <div style={{ display: "flex", gap: 24 }}>
          <Link href="/privacy" style={{ color: "#444", fontSize: 13, textDecoration: "none" }}>Confidentialité</Link>
          <Link href="/terms" style={{ color: "#444", fontSize: 13, textDecoration: "none" }}>CGU</Link>
          <Link href="/contact" style={{ color: "#444", fontSize: 13, textDecoration: "none" }}>Contact</Link>
        </div>
      </footer>
    </div>
  )
}
