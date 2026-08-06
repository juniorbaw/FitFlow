'use client'

import { useState, useRef } from "react";

const ORANGE = "#FF5C00";
const GREEN = "#00D26A";
const BLUE = "#3B82F6";
const YELLOW = "#FFB800";
const RED = "#FF4D4D";
const PURPLE = "#A855F7";

interface AnalysisResult {
  viralScore: number;
  verdict: string;
  duration: string;
  estimatedViews: string;
  estimatedLikes: string;
  bestPostTime: string;
  hookAnalysis: { score: number; firstThreeSeconds: string; retention: string; suggestions: string[] };
  contentAnalysis: { score: number; pacing: string; storytelling: string; suggestions: string[] };
  audioAnalysis: { score: number; hasMusic: boolean; hasVoiceover: boolean; musicEnergy: string; suggestion: string };
  captionSuggestions: { style: string; caption: string; score: number }[];
  hashtags: { highReach: string[]; mediumReach: string[]; niche: string[]; recommended: string };
  competitorBenchmark: { avgViralScore: number; yourPosition: string; topPerformers: string };
}

export function VideoAnalyzerTab() {
  const [activeTab, setActiveTab] = useState("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [scriptText, setScriptText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultTab, setResultTab] = useState("overview");
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scoreColor = (s: number) => s >= 80 ? GREEN : s >= 60 ? BLUE : s >= 40 ? YELLOW : RED;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const CircleScore = ({ score, size = 120 }: { score: number; size?: number }) => (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={size/2-10} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
      <circle cx={size/2} cy={size/2} r={size/2-10} fill="none" stroke={scoreColor(score)} strokeWidth="8"
        strokeDasharray={`${(score/100) * (Math.PI * (size-20))} ${Math.PI * (size-20)}`}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dasharray 1s" }} />
      <text x={size/2} y={size/2 - 4} textAnchor="middle" fill="white" fontSize={size/4} fontWeight="900">{score}</text>
      <text x={size/2} y={size/2 + 14} textAnchor="middle" fill="#666" fontSize={size/10}>/100</text>
    </svg>
  );

  const handleAnalyze = async () => {
    const content = activeTab === 'url' ? videoUrl : scriptText;
    if (activeTab !== 'upload' && !content.trim()) return;
    if (activeTab === 'upload' && !videoFile) return;

    setAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('mode', activeTab);
      if (activeTab === 'upload' && videoFile) {
        formData.append('file', videoFile);
        formData.append('content', `Vidéo fitness uploadée: ${videoFile.name}`);
      } else {
        formData.append('content', content);
      }

      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
        setResultTab("overview");
      }
    } catch (e) {
      setError('Erreur de connexion. Réessayez.');
    } finally {
      setAnalyzing(false);
    }
  };

  const canAnalyze = activeTab === 'upload' ? !!videoFile : activeTab === 'url' ? !!videoUrl.trim() : !!scriptText.trim();

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fafafa", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* CONTENT */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 0 32px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>🎬</span> Video Analyzer AI
            </h1>
            <p style={{ fontSize: 15, color: "#888" }}>
              Analyse tes Reels avant de publier. L'IA prédit le potentiel viral et optimise chaque aspect.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3 }}>
            {[
              { id: "upload", label: "📤 Upload" },
              { id: "url", label: "🔗 URL Instagram" },
              { id: "script", label: "📝 Script/Idée" },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer",
                background: activeTab === t.id ? `${PURPLE}18` : "transparent",
                color: activeTab === t.id ? PURPLE : "#666"
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28 }}>

              {activeTab === "upload" && (
                <div>
                  <div onClick={() => fileInputRef.current?.click()} style={{
                    border: `2px dashed ${PURPLE}40`, borderRadius: 16,
                    padding: "48px 24px", textAlign: "center", cursor: "pointer",
                    background: `${PURPLE}06`
                  }}>
                    <input ref={fileInputRef} type="file" accept="video/*" style={{ display: "none" }}
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎥</div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: PURPLE, marginBottom: 6 }}>Glisse ta vidéo ici</p>
                    <p style={{ fontSize: 13, color: "#666" }}>ou clique pour sélectionner</p>
                    <p style={{ fontSize: 11, color: "#444", marginTop: 12 }}>MP4, MOV · Max 100MB · Max 3 min</p>
                  </div>
                  {videoFile && (
                    <div style={{
                      marginTop: 12, padding: "12px 16px", borderRadius: 10,
                      background: `${GREEN}10`, border: `1px solid ${GREEN}20`,
                      fontSize: 13, color: GREEN, fontWeight: 600,
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <span>✓ {videoFile.name}</span>
                      <span onClick={() => setVideoFile(null)} style={{ cursor: "pointer", color: "#888" }}>✕</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "url" && (
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10 }}>URL du Reel Instagram</label>
                  <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.instagram.com/reel/ABC123..."
                    style={{ width: "100%", padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                  <p style={{ fontSize: 12, color: "#555", marginTop: 8 }}>Analyse un Reel déjà publié pour obtenir des conseils d'optimisation</p>
                </div>
              )}

              {activeTab === "script" && (
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10 }}>Décris ton idée de Reel</label>
                  <textarea value={scriptText} onChange={(e) => setScriptText(e.target.value)}
                    placeholder="Ex : Je veux faire un Reel de 30 secondes sur les 3 erreurs de débutant en musculation..."
                    rows={8}
                    style={{ width: "100%", padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white", fontSize: 14, lineHeight: 1.6, resize: "none", outline: "none", fontFamily: "inherit" }} />
                  <p style={{ fontSize: 12, color: "#555", marginTop: 8 }}>L'IA évalue le potentiel viral de ton idée avant même de filmer</p>
                </div>
              )}

              {error && (
                <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 10, background: `${RED}10`, border: `1px solid ${RED}20`, fontSize: 13, color: RED }}>
                  ❌ {error}
                </div>
              )}

              <button onClick={handleAnalyze} disabled={!canAnalyze || analyzing} style={{
                width: "100%", padding: "14px", marginTop: 16,
                background: canAnalyze ? `linear-gradient(135deg, ${PURPLE}, #C084FC)` : "rgba(255,255,255,0.04)",
                border: "none", borderRadius: 12, color: "white",
                fontSize: 15, fontWeight: 700, cursor: canAnalyze ? "pointer" : "not-allowed",
                boxShadow: canAnalyze ? `0 8px 24px ${PURPLE}30` : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: analyzing ? 0.7 : 1
              }}>
                {analyzing ? (
                  <><span style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} /> Analyse en cours...</>
                ) : <>🧠 Analyser avec l'IA</>}
              </button>
            </div>

            {/* Tips */}
            <div style={{ background: `${PURPLE}06`, border: `1px solid ${PURPLE}15`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 12 }}>🎯 Ce que l'IA analyse</div>
              {[
                "Hook (3 premières secondes) — est-ce qu'on reste ?",
                "Rythme & montage — trop lent ? trop rapide ?",
                "Structure narrative — problème → solution → CTA",
                "Potentiel viral — comparaison avec les top Reels fitness",
                "Caption optimale — 3 versions avec hashtags"
              ].map((tip, i) => (
                <div key={i} style={{ fontSize: 12, color: "#888", display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: PURPLE }}>→</span> {tip}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Results */}
          <div>
            {result ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Score Header */}
                <div style={{ background: `linear-gradient(135deg, ${PURPLE}10, ${PURPLE}04)`, border: `1px solid ${PURPLE}20`, borderRadius: 20, padding: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                    <div style={{ textAlign: "center" }}>
                      <CircleScore score={result.viralScore} size={130} />
                      <div style={{ fontSize: 12, color: "#888", marginTop: 6, fontWeight: 600 }}>Score Viral</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        <span style={{ background: `${scoreColor(result.viralScore)}15`, color: scoreColor(result.viralScore), padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                          {result.viralScore >= 80 ? "🔥 Viral potentiel" : result.viralScore >= 60 ? "👍 Bon potentiel" : "⚠️ À améliorer"}
                        </span>
                        <span style={{ background: "rgba(255,255,255,0.04)", padding: "6px 14px", borderRadius: 20, fontSize: 13, color: "#888" }}>⏱ {result.duration}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {[
                          { icon: "👁️", label: "Vues estimées", value: result.estimatedViews },
                          { icon: "❤️", label: "Likes estimés", value: result.estimatedLikes },
                          { icon: "🕐", label: "Meilleur créneau", value: result.bestPostTime },
                        ].map((s, i) => (
                          <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
                            <div style={{ fontSize: 14, marginBottom: 4 }}>{s.icon}</div>
                            <div style={{ fontSize: 10, color: "#555", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>{s.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#ccc" }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-scores */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {[
                    { score: result.hookAnalysis.score, label: "Hook", sub: "3 premières sec." },
                    { score: result.contentAnalysis.score, label: "Contenu", sub: "Structure & rythme" },
                    { score: result.audioAnalysis.score, label: "Audio", sub: "Musique & voix" },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16 }}>
                      <CircleScore score={s.score} size={80} />
                      <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8, color: "#ccc" }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: "#666" }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Detail Tabs */}
                <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
                  <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {[
                      { id: "overview", label: "🎯 Conseils" },
                      { id: "captions", label: "✍️ Captions" },
                      { id: "hashtags", label: "#️⃣ Hashtags" },
                    ].map(t => (
                      <button key={t.id} onClick={() => setResultTab(t.id)} style={{
                        flex: 1, padding: "14px", border: "none", cursor: "pointer",
                        fontSize: 13, fontWeight: 700,
                        background: resultTab === t.id ? `${PURPLE}10` : "transparent",
                        color: resultTab === t.id ? PURPLE : "#666",
                        borderBottom: resultTab === t.id ? `2px solid ${PURPLE}` : "2px solid transparent"
                      }}>{t.label}</button>
                    ))}
                  </div>

                  <div style={{ padding: 24 }}>

                    {resultTab === "overview" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Hook */}
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                            <span>🪝</span> Hook — {result.hookAnalysis.firstThreeSeconds}
                          </div>
                          {result.hookAnalysis.suggestions.map((s, i) => (
                            <div key={i} style={{ fontSize: 13, color: "#aaa", padding: "8px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", gap: 10 }}>
                              <span style={{ background: `${PURPLE}15`, color: PURPLE, width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                              {s}
                            </div>
                          ))}
                        </div>
                        {/* Content */}
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                            <span>🎬</span> Contenu — {result.contentAnalysis.storytelling}
                          </div>
                          {result.contentAnalysis.suggestions.map((s, i) => (
                            <div key={i} style={{ fontSize: 13, color: "#aaa", padding: "8px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", gap: 10 }}>
                              <span style={{ background: `${BLUE}15`, color: BLUE, width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                              {s}
                            </div>
                          ))}
                        </div>
                        {/* Audio */}
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                            <span>🎵</span> Audio — {result.audioAnalysis.musicEnergy}
                          </div>
                          <p style={{ fontSize: 13, color: "#aaa" }}>{result.audioAnalysis.suggestion}</p>
                        </div>
                        {/* Benchmark */}
                        <div style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}15`, borderRadius: 14, padding: 16, marginTop: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: GREEN, marginBottom: 8 }}>
                            📊 Tu es dans le {result.competitorBenchmark.yourPosition} de ta niche
                          </div>
                          <p style={{ fontSize: 13, color: "#aaa" }}>
                            Score moyen dans ta niche : {result.competitorBenchmark.avgViralScore}/100. {result.competitorBenchmark.topPerformers}
                          </p>
                        </div>
                      </div>
                    )}

                    {resultTab === "captions" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <p style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>3 captions optimisées générées par l'IA. Cliquez pour copier.</p>
                        {result.captionSuggestions.map((c, i) => (
                          <div key={i} onClick={() => copyToClipboard(c.caption, `caption-${i}`)}
                            style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${copied === `caption-${i}` ? GREEN : "rgba(255,255,255,0.06)"}`, borderRadius: 16, padding: 20, cursor: "pointer" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ background: `${PURPLE}15`, color: PURPLE, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{c.style}</span>
                                <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor(c.score) }}>{c.score}/100</span>
                              </div>
                              <span style={{ fontSize: 12, color: copied === `caption-${i}` ? GREEN : "#555" }}>
                                {copied === `caption-${i}` ? "✓ Copié !" : "📋 Copier"}
                              </span>
                            </div>
                            <pre style={{ fontSize: 13, color: "#ccc", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{c.caption}</pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {resultTab === "hashtags" && (
                      <div>
                        <p style={{ fontSize: 13, color: ORANGE, fontWeight: 600, background: `${ORANGE}08`, padding: "10px 14px", borderRadius: 10, marginBottom: 20 }}>
                          💡 {result.hashtags.recommended}
                        </p>
                        {[
                          { label: "🌍 High Reach (500K+ posts)", tags: result.hashtags.highReach, color: GREEN },
                          { label: "📈 Medium Reach (50K-500K)", tags: result.hashtags.mediumReach, color: BLUE },
                          { label: "🎯 Niche (< 50K — meilleur engagement)", tags: result.hashtags.niche, color: PURPLE },
                        ].map((group, i) => (
                          <div key={i} style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: group.color, marginBottom: 10 }}>{group.label}</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                              {group.tags.map((tag, j) => (
                                <span key={j} onClick={() => copyToClipboard(tag, `tag-${i}-${j}`)}
                                  style={{ background: `${group.color}10`, border: `1px solid ${copied === `tag-${i}-${j}` ? group.color : group.color + "20"}`, color: group.color, padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const all = [...(result.hashtags.highReach.slice(0,3)), ...(result.hashtags.mediumReach.slice(0,5)), ...(result.hashtags.niche.slice(0,7))].join(" ");
                            copyToClipboard(all, "all-hashtags");
                          }}
                          style={{ width: "100%", padding: "12px", background: `linear-gradient(135deg, ${PURPLE}, #C084FC)`, border: "none", borderRadius: 12, color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
                          {copied === "all-hashtags" ? "✓ Copié !" : "📋 Copier le mix optimal (15 hashtags)"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 500 }}>
                {analyzing ? (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 48, height: 48, border: `3px solid ${PURPLE}`, borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite" }} />
                    <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Analyse IA en cours...</p>
                    <p style={{ fontSize: 13, color: "#666" }}>Hook, rythme, audio, potentiel viral...</p>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>🎬</div>
                    <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Prêt à analyser ton Reel</p>
                    <p style={{ fontSize: 14, color: "#666", maxWidth: 350, lineHeight: 1.6, margin: "0 auto" }}>
                      Upload ta vidéo, colle un lien Instagram, ou décris ton idée de Reel.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
