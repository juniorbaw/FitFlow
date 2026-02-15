'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Zap, TrendingUp, Users, BarChart3, Sparkles, X, Play } from 'lucide-react'

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"
const BLUE = "#3B82F6"

const stats = [
  { value: "3-5", label: "Nouveaux clients/semaine", icon: "👥" },
  { value: "30 sec", label: "Temps de réponse", icon: "⚡" },
  { value: "85%", label: "Taux de réponse", icon: "📈" },
  { value: "24/7", label: "Automatisation", icon: "🤖" },
]

const features = [
  { icon: "🤖", title: "IA Gemini Ultra", desc: "Analyse sémantique avancée pour détecter l'intention d'achat réelle" },
  { icon: "⚡", title: "Réponse Instantanée", desc: "Vos prospects reçoivent un DM personnalisé en moins de 30 secondes" },
  { icon: "🎯", title: "Lead Scoring 1-10", desc: "Priorise automatiquement les prospects les plus chauds pour maximiser vos conversions" },
  { icon: "📊", title: "Analytics Temps Réel", desc: "Tableau de bord avec métriques essentielles : leads, conversions, revenus" },
  { icon: "💬", title: "Templates Personnalisés", desc: "Messages adaptatifs selon le profil et l'engagement du prospect" },
  { icon: "🔒", title: "100% Conforme", desc: "Utilise uniquement l'API officielle Instagram - Votre compte est protégé" },
]

const socialProof = [
  { text: "Configuration en 10 minutes chrono", icon: "⏱️" },
  { text: "Aucune carte bancaire requise", icon: "💳" },
  { text: "Support 7j/7 en français", icon: "🇫🇷" },
  { text: "Garantie satisfait ou remboursé 30 jours", icon: "✅" },
]

const objections = [
  {
    q: "Est-ce conforme aux règles Instagram ?",
    a: "Absolument ! FitFlow utilise uniquement l'API officielle Instagram approuvée par Meta. Votre compte est 100% sécurisé et nous respectons toutes les guidelines."
  },
  {
    q: "Combien de temps avant les premiers résultats ?",
    a: "La plupart de nos utilisateurs génèrent leurs premiers leads qualifiés dans les 24-48h. Les premiers clients payants arrivent généralement sous 7-10 jours."
  },
  {
    q: "Dois-je avoir des compétences techniques ?",
    a: "Zéro compétence requise ! Notre setup guidé prend 10 minutes. Si vous savez poster sur Instagram, vous savez utiliser FitFlow."
  },
  {
    q: "Combien de temps dois-je y consacrer ?",
    a: "5-10 minutes par jour maximum pour vérifier vos nouveaux leads. Tout le reste (détection, scoring, messages) est automatisé 24/7."
  },
  {
    q: "L'essai est-il vraiment gratuit ?",
    a: "Oui ! 14 jours complets, toutes les fonctionnalités, aucune carte bancaire. Vous pouvez annuler en 1 clic à tout moment."
  },
  {
    q: "Que se passe-t-il avec mes données ?",
    a: "Vos données sont hébergées sur Supabase (infrastructure ultra-sécurisée). Nous ne vendons JAMAIS vos informations. Conformité RGPD totale."
  }
]

const comparisonData = [
  { feature: "Réponse manuelle Instagram", manual: "2-24h", fitflow: "30 secondes", multiplier: "48x plus rapide" },
  { feature: "Qualification des leads", manual: "Aléatoire", fitflow: "Score IA 1-10", multiplier: "+40% conversion" },
  { feature: "Disponibilité", manual: "8h/jour", fitflow: "24/7 automatique", multiplier: "3x plus de leads" },
  { feature: "Temps/semaine", manual: "10-15h", fitflow: "30 min", multiplier: "95% de temps gagné" },
]

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Popup d'exit intent (quand souris sort de la page)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showPopup) {
        setShowPopup(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [showPopup])

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fafafa", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      {/* HEADER STICKY */}
      <div style={{ padding: "16px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.95)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: -0.5 }}>
            Fit<span style={{ color: ORANGE }}>Flow</span>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link href="/demo-video" style={{ color: "#888", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}>
              🎥 Voir la démo
            </Link>
            <Link href="/pricing" style={{ color: "#888", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}>
              Tarifs
            </Link>
            <Link href="/login" style={{ color: "#888", fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}>
              Connexion
            </Link>
            <Link 
              href="/signup" 
              style={{ 
                background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, 
                color: "white", 
                padding: "10px 24px", 
                borderRadius: 20, 
                fontSize: 14, 
                fontWeight: 700, 
                textDecoration: "none", 
                transition: "transform 0.2s", 
                display: "inline-block" 
              }}
            >
              Essai Gratuit 14j →
            </Link>
          </div>
        </div>
      </div>

      {/* HERO SECTION - OPTIMISÉE CONVERSION */}
      <div style={{ padding: "60px 32px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Gradient background */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 800, background: `radial-gradient(circle, ${ORANGE}15 0%, transparent 70%)`, pointerEvents: "none" }}></div>
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          {/* Badge de preuve sociale */}
          <div style={{ 
            display: "inline-block", 
            background: "rgba(255, 92, 0, 0.1)", 
            border: "1px solid rgba(255, 92, 0, 0.3)",
            padding: "8px 20px", 
            borderRadius: 50, 
            fontSize: 13, 
            fontWeight: 700,
            color: ORANGE,
            marginBottom: 24
          }}>
            🔥 Rejoignez 500+ coachs qui automatisent leur croissance
          </div>

          <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: -2, lineHeight: 1.1, marginBottom: 24 }}>
            Transformez Vos Commentaires<br />
            Instagram en <span style={{ 
              background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Clients Payants</span>
          </h1>

          <p style={{ fontSize: 22, color: "#aaa", marginBottom: 16, lineHeight: 1.5 }}>
            L'IA détecte automatiquement vos prospects chauds sur Instagram<br />
            et leur envoie un DM personnalisé <strong style={{ color: "white" }}>en 30 secondes</strong>
          </p>

          <p style={{ fontSize: 16, color: "#666", marginBottom: 40 }}>
            Sans toucher votre téléphone. Sans code. Sans compétence technique.
          </p>

          {/* CTA Principal avec indicateurs de confiance */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <Link 
              href="/signup" 
              style={{ 
                background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                color: "white", 
                padding: "20px 48px", 
                borderRadius: 24, 
                fontSize: 18, 
                fontWeight: 700, 
                textDecoration: "none", 
                display: "inline-flex", 
                alignItems: "center", 
                gap: 12, 
                boxShadow: `0 20px 60px ${ORANGE}40`,
                transition: "all 0.3s"
              }}
            >
              🚀 Démarrer Gratuitement (14 jours)
              <ArrowRight style={{ width: 20, height: 20 }} />
            </Link>
            
            <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#888" }}>
              <span>✅ Aucune carte bancaire</span>
              <span>✅ Setup en 10 min</span>
              <span>✅ Support 7j/7</span>
            </div>
          </div>

          {/* STATS - Plus visibles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, maxWidth: 1000, margin: "60px auto 0" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ 
                background: "rgba(255,255,255,0.03)", 
                border: "1px solid rgba(255,255,255,0.08)", 
                borderRadius: 16, 
                padding: 24, 
                textAlign: "center",
                transition: "all 0.3s"
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: ORANGE, marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO DEMO SECTION - NOUVEAU */}
      <div style={{ padding: "60px 32px", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 16 }}>
            Voyez FitFlow en Action
          </h2>
          <p style={{ fontSize: 18, color: "#888", marginBottom: 40 }}>
            Découvrez comment FitFlow transforme un simple commentaire en client payant
          </p>
          
          <Link
            href="/demo-video"
            style={{
              position: "relative",
              display: "block",
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(255, 92, 0, 0.3)",
              borderRadius: 24,
              overflow: "hidden",
              aspectRatio: "16/9",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
          >
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 80,
              height: 80,
              background: ORANGE,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 10px 40px ${ORANGE}60`
            }}>
              <Play style={{ width: 32, height: 32, color: "white", marginLeft: 4 }} fill="white" />
            </div>
            
            <div style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              textAlign: "left"
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                Du Commentaire au Client en 3 Minutes
              </div>
              <div style={{ fontSize: 14, color: "#aaa" }}>
                Démo interactive • 3:42 min
              </div>
            </div>
          </Link>

          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 32, fontSize: 14, color: "#888" }}>
            <span>✨ Pas de fluff marketing</span>
            <span>🎯 Démonstration réelle</span>
            <span>⏱️ Moins de 4 minutes</span>
          </div>
        </div>
      </div>

      {/* COMPARISON TABLE - Avant/Après */}
      <div style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16 }}>
              Avec ou Sans FitFlow ?
            </h2>
            <p style={{ fontSize: 18, color: "#888" }}>
              La différence est flagrante
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontWeight: 700, color: "#888" }}></div>
              <div style={{ fontWeight: 700, color: "#888", textAlign: "center" }}>Sans FitFlow</div>
              <div style={{ fontWeight: 700, color: ORANGE, textAlign: "center" }}>Avec FitFlow</div>
              <div style={{ fontWeight: 700, color: GREEN, textAlign: "center" }}>Résultat</div>
            </div>

            {/* Rows */}
            {comparisonData.map((row, i) => (
              <div key={i} style={{ 
                display: "grid", 
                gridTemplateColumns: "2fr 1fr 1fr 1.5fr", 
                padding: "24px 32px", 
                borderBottom: i < comparisonData.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
              }}>
                <div style={{ fontWeight: 600 }}>{row.feature}</div>
                <div style={{ textAlign: "center", color: "#666" }}>{row.manual}</div>
                <div style={{ textAlign: "center", color: ORANGE, fontWeight: 700 }}>{row.fitflow}</div>
                <div style={{ textAlign: "center", color: GREEN, fontWeight: 700 }}>{row.multiplier}</div>
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
              Tout Ce Dont Vous Avez Besoin
            </h2>
            <p style={{ fontSize: 18, color: "#888" }}>
              Une plateforme complète pour automatiser votre croissance Instagram
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {features.map((feature, i) => (
              <div 
                key={i} 
                style={{ 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.08)", 
                  borderRadius: 20, 
                  padding: 32, 
                  transition: "all 0.3s",
                  cursor: "pointer"
                }} 
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>{feature.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: "white" }}>{feature.title}</h3>
                <p style={{ fontSize: 15, color: "#888", lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOCIAL PROOF BANNER */}
      <div style={{ padding: "40px 32px", background: `linear-gradient(135deg, ${ORANGE}10, transparent)`, borderTop: "1px solid rgba(255, 92, 0, 0.2)", borderBottom: "1px solid rgba(255, 92, 0, 0.2)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          {socialProof.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ SECTION */}
      <div style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16 }}>
              Questions Fréquentes
            </h2>
            <p style={{ fontSize: 18, color: "#888" }}>
              Toutes les réponses à vos interrogations
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {objections.map((faq, i) => (
              <details 
                key={i}
                style={{ 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.08)", 
                  borderRadius: 16, 
                  padding: 24,
                  cursor: "pointer"
                }}
              >
                <summary style={{ 
                  fontSize: 18, 
                  fontWeight: 700, 
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  {faq.q}
                  <span style={{ color: ORANGE, fontSize: 24 }}>+</span>
                </summary>
                <p style={{ 
                  marginTop: 16, 
                  paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  color: "#aaa", 
                  lineHeight: 1.7,
                  fontSize: 15
                }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* CTA FINAL - OPTIMISÉ */}
      <div style={{ padding: "100px 32px", textAlign: "center", position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: `${ORANGE}10`, borderRadius: "50%", filter: "blur(100px)" }}></div>
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
          <div style={{ 
            display: "inline-block", 
            background: "rgba(0, 210, 106, 0.1)", 
            border: "1px solid rgba(0, 210, 106, 0.3)",
            padding: "8px 20px", 
            borderRadius: 50, 
            fontSize: 13, 
            fontWeight: 700,
            color: GREEN,
            marginBottom: 24
          }}>
            ⚡ Offre de lancement - 14 jours gratuits
          </div>

          <h2 style={{ fontSize: 56, fontWeight: 900, letterSpacing: -1.5, marginBottom: 24, lineHeight: 1.1 }}>
            Pendant Que Vous Hésitez,<br />
            Vos Concurrents <span style={{ color: ORANGE }}>Automatisent</span>
          </h2>
          
          <p style={{ fontSize: 20, color: "#aaa", marginBottom: 40, lineHeight: 1.6 }}>
            Chaque jour sans FitFlow = des dizaines de leads perdus.<br />
            <strong style={{ color: "white" }}>Commencez maintenant, gratuitement.</strong>
          </p>

          <Link 
            href="/signup" 
            style={{ 
              background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
              color: "white", 
              padding: "20px 56px", 
              borderRadius: 24, 
              fontSize: 18, 
              fontWeight: 700, 
              textDecoration: "none", 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 12, 
              boxShadow: `0 20px 60px ${ORANGE}50`,
              transition: "all 0.3s"
            }}
          >
            🚀 Transformer Mon Instagram Maintenant
            <ArrowRight style={{ width: 22, height: 22 }} />
          </Link>

          <p style={{ marginTop: 24, fontSize: 14, color: "#666" }}>
            ✨ Installation en 10 min • Aucun engagement • Support inclus
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: "40px 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ color: "#666", fontSize: 14 }}>
            © 2026 FitFlow. Tous droits réservés.
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 14 }}>
            <Link href="/privacy" style={{ color: "#666", textDecoration: "none" }}>Confidentialité</Link>
            <Link href="/terms" style={{ color: "#666", textDecoration: "none" }}>CGU</Link>
            <Link href="/contact" style={{ color: "#666", textDecoration: "none" }}>Contact</Link>
          </div>
        </div>
      </div>

      {/* EXIT INTENT POPUP */}
      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: 20
        }}>
          <div style={{
            background: "#0a0a0a",
            border: `2px solid ${ORANGE}`,
            borderRadius: 24,
            padding: 48,
            maxWidth: 600,
            position: "relative",
            textAlign: "center"
          }}>
            <button 
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                borderRadius: "50%",
                width: 32,
                height: 32,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={20} />
            </button>

            <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
            <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>
              Attendez ! Offre Spéciale 🎁
            </h3>
            <p style={{ fontSize: 18, color: "#aaa", marginBottom: 24 }}>
              Rejoignez notre liste VIP et recevez un <strong style={{ color: ORANGE }}>guide exclusif</strong><br />
              "10 Stratégies Instagram pour Générer 50+ Leads/Semaine"
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setShowPopup(false); }} style={{ marginBottom: 16 }}>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: 16,
                  marginBottom: 12
                }}
              />
              <button 
                type="submit"
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                  border: "none",
                  borderRadius: 12,
                  color: "white",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                📥 Recevoir Le Guide Gratuit
              </button>
            </form>

            <p style={{ fontSize: 12, color: "#666" }}>
              + Accès prioritaire aux nouvelles fonctionnalités
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
