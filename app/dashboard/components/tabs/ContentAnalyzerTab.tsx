'use client'

import { useState } from "react";

const ORANGE = "#FF5C00";
const GREEN = "#00D26A";
const BLUE = "#3B82F6";
const YELLOW = "#FFB800";
const RED = "#FF4D4D";

export function ContentAnalyzerTab() {
  const [postContent, setPostContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(true);

  const [mockResult, setMockResult] = useState({
    score: 82,
    verdict: "good",
    strengths: [
      "Hook fort qui capte l'attention immédiatement",
      "Call-to-action clair ('Commente PRÊT')",
      "Utilisation efficace des emojis pour la lisibilité",
      "Storytelling personnel qui crée de la connexion"
    ],
    weaknesses: [
      "Manque de hashtags stratégiques (#fitness #transformation)",
      "Pas de question ouverte pour encourager les commentaires",
      "Le CTA pourrait être plus spécifique"
    ],
    suggestions: [
      "Ajoutez 5-8 hashtags ciblés : #coachfitness #transformationfitness #pertedepoids",
      "Terminez par une question : 'Quel est TON plus grand blocage fitness ?'",
      "Ajoutez un chiffre concret : '12 semaines pour des résultats visibles'",
      "Utilisez un line break après le hook pour créer du suspense"
    ],
    bestTime: "Mardi ou Jeudi, 12h-13h ou 18h-19h",
    reach: "2 500 - 4 000 comptes",
    engagement: "high"
  };

  const verdictMap: Record<string, { label: string; color: string; emoji: string }> = {
    excellent: { label: "Excellent", color: GREEN, emoji: "🔥" },
    good: { label: "Bon", color: BLUE, emoji: "👍" },
    average: { label: "Moyen", color: YELLOW, emoji: "⚠️" },
    poor: { label: "Faible", color: RED, emoji: "❌" },
  };

  const v = verdictMap[mockResult.verdict];
  const scoreColor = mockResult.score >= 80 ? GREEN : mockResult.score >= 60 ? BLUE : mockResult.score >= 40 ? YELLOW : RED;

  const handleAnalyze = async () => {
    if (!postContent.trim()) return;
    setAnalyzing(true);
    setShowResult(false);
    try {
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: postContent })
      });
      if (!response.ok) throw new Error('Erreur API');
      const data = await response.json();
      setMockResult(data);
      setShowResult(true);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Erreur lors de l\'analyse. Réessayez.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>✨</span> Analyseur de Contenu IA
        </h1>
        <p style={{ fontSize: 15, color: "#888" }}>
          Optimise tes posts Instagram avant de publier. L&apos;IA analyse et te donne des conseils personnalisés.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* LEFT - Input */}
        <div>
          <div style={{
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20, padding: 28
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>📝</span> Ton futur post
              </label>
              <span style={{ fontSize: 12, color: "#555" }}>{postContent.length}/2200</span>
            </div>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value.slice(0, 2200))}
              placeholder={"Colle ta caption Instagram ici...\n\nExemple : 🔥 J'ai aidé 47 personnes à perdre du poids en 12 semaines. Voici comment..."}
              rows={14}
              style={{
                width: "100%", padding: "18px", borderRadius: 14,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                color: "white", fontSize: 14, lineHeight: 1.7, resize: "none",
                outline: "none", fontFamily: "inherit",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => { e.target.style.borderColor = `${ORANGE}50`; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.06)"; }}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={handleAnalyze}
                disabled={!postContent.trim() || analyzing}
                style={{
                  flex: 1, padding: "14px",
                  background: postContent.trim()
                    ? `linear-gradient(135deg, ${ORANGE}, #FF8A00)`
                    : "rgba(255,255,255,0.04)",
                  border: "none", borderRadius: 12, color: "white",
                  fontSize: 15, fontWeight: 700, cursor: postContent.trim() ? "pointer" : "not-allowed",
                  boxShadow: postContent.trim() ? `0 8px 24px ${ORANGE}25` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: analyzing ? 0.7 : 1
                }}
              >
                {analyzing ? (
                  <>
                    <span style={{
                      width: 16, height: 16, border: "2px solid white",
                      borderTopColor: "transparent", borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block"
                    }} />
                    Analyse en cours...
                  </>
                ) : (
                  <>✨ Analyser avec l&apos;IA</>
                )}
              </button>
              <button
                onClick={() => { setPostContent(""); setShowResult(false); }}
                style={{
                  padding: "14px 20px", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
                  color: "#888", fontSize: 13, fontWeight: 600, cursor: "pointer"
                }}
              >Effacer</button>
            </div>
          </div>

          {/* Tips */}
          <div style={{
            marginTop: 16, background: "rgba(59,130,246,0.04)",
            border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: 20
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: BLUE, marginBottom: 10 }}>💡 Astuces pour un post optimisé</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                "Commencez par un hook accrocheur (question, stat choc)",
                "Incluez un CTA clair (Commente, DM, Lien en bio)",
                "5-10 hashtags ciblés dans votre niche",
                "Racontez une histoire (transformation, avant/après)"
              ].map((tip, i) => (
                <div key={i} style={{ fontSize: 13, color: "#888", display: "flex", gap: 8 }}>
                  <span style={{ color: BLUE }}>→</span> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT - Results */}
        <div>
          {showResult ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Score Card */}
              <div style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, padding: 28, textAlign: "center"
              }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                      <circle cx="70" cy="70" r="58" fill="none" stroke={scoreColor} strokeWidth="10"
                        strokeDasharray={`${(mockResult.score / 100) * 364} 364`}
                        strokeDashoffset="0" strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                        style={{ transition: "stroke-dasharray 1s" }}
                      />
                      <text x="70" y="64" textAnchor="middle" fill="white" fontSize="36" fontWeight="900">
                        {mockResult.score}
                      </text>
                      <text x="70" y="84" textAnchor="middle" fill="#666" fontSize="12">/100</text>
                    </svg>
                  </div>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: `${v.color}12`, border: `1px solid ${v.color}25`,
                  padding: "8px 20px", borderRadius: 50
                }}>
                  <span>{v.emoji}</span>
                  <span style={{ fontWeight: 700, color: v.color, fontSize: 14 }}>{v.label}</span>
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { icon: "🕐", label: "Meilleur créneau", value: mockResult.bestTime },
                  { icon: "👁️", label: "Portée estimée", value: mockResult.reach },
                  { icon: "📈", label: "Engagement", value: mockResult.engagement === "high" ? "Élevé" : mockResult.engagement === "medium" ? "Moyen" : "Faible" },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14, padding: "14px 12px", textAlign: "center"
                  }}>
                    <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: 10, color: "#555", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#ccc" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Strengths */}
              <div style={{
                background: "rgba(0,210,106,0.03)", border: "1px solid rgba(0,210,106,0.1)",
                borderRadius: 16, padding: 22
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>✅</span> Points forts
                </div>
                {mockResult.strengths.map((s, i) => (
                  <div key={i} style={{
                    fontSize: 13, color: "#aaa", padding: "8px 0",
                    borderTop: i > 0 ? "1px solid rgba(0,210,106,0.06)" : "none",
                    display: "flex", gap: 10
                  }}>
                    <span style={{ color: GREEN, flexShrink: 0 }}>•</span> {s}
                  </div>
                ))}
              </div>

              {/* Weaknesses */}
              <div style={{
                background: "rgba(255,77,77,0.03)", border: "1px solid rgba(255,77,77,0.1)",
                borderRadius: 16, padding: 22
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: RED, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>⚠️</span> Points à améliorer
                </div>
                {mockResult.weaknesses.map((w, i) => (
                  <div key={i} style={{
                    fontSize: 13, color: "#aaa", padding: "8px 0",
                    borderTop: i > 0 ? "1px solid rgba(255,77,77,0.06)" : "none",
                    display: "flex", gap: 10
                  }}>
                    <span style={{ color: RED, flexShrink: 0 }}>•</span> {w}
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div style={{
                background: "rgba(255,92,0,0.03)", border: "1px solid rgba(255,92,0,0.1)",
                borderRadius: 16, padding: 22
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: ORANGE, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>💡</span> Suggestions
                </div>
                {mockResult.suggestions.map((s, i) => (
                  <div key={i} style={{
                    fontSize: 13, color: "#aaa", padding: "10px 0",
                    borderTop: i > 0 ? "1px solid rgba(255,92,0,0.06)" : "none",
                    display: "flex", gap: 10
                  }}>
                    <span style={{
                      background: `${ORANGE}15`, color: ORANGE,
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800
                    }}>{i + 1}</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20, padding: 28, height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", minHeight: 500
            }}>
              {analyzing ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: 48, height: 48, border: `3px solid ${ORANGE}`,
                    borderTopColor: "transparent", borderRadius: "50%",
                    margin: "0 auto 20px",
                    animation: "spin 0.8s linear infinite"
                  }} />
                  <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Analyse en cours...</p>
                  <p style={{ fontSize: 13, color: "#666" }}>L&apos;IA examine votre contenu</p>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>✍️</div>
                  <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Prêt à analyser</p>
                  <p style={{ fontSize: 14, color: "#666", maxWidth: 300, lineHeight: 1.6 }}>
                    Collez votre caption Instagram à gauche et cliquez sur &quot;Analyser&quot; pour obtenir un score et des suggestions.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
