'use client'

import { useState } from "react";

const ORANGE = "#FF5C00";
const GREEN = "#00D26A";
const BLUE = "#3B82F6";
const RED = "#FF4D4D";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("instagram");
  const [igConnected, setIgConnected] = useState(false);
  const [autoDm, setAutoDm] = useState(true);
  const [dmLimit, setDmLimit] = useState(50);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const tabs = [
    { id: "profile", label: "Profil", icon: "👤" },
    { id: "instagram", label: "Instagram", icon: "📸" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "billing", label: "Facturation", icon: "💳" },
    { id: "security", label: "Sécurité", icon: "🔒" },
  ];

  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <div
      onClick={onChange}
      style={{
        width: 48, height: 26, borderRadius: 13, cursor: "pointer",
        background: on ? GREEN : "rgba(255,255,255,0.1)",
        padding: 3, transition: "all 0.2s", display: "flex",
        justifyContent: on ? "flex-end" : "flex-start", alignItems: "center"
      }}
    >
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", transition: "all 0.2s" }} />
    </div>
  );

  const InputField = ({ label, placeholder, value, type = "text", disabled = false }: { label: string; placeholder?: string; value?: string; type?: string; disabled?: boolean }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#888", display: "block", marginBottom: 8 }}>{label}</label>
      <input
        type={type} defaultValue={value} placeholder={placeholder} disabled={disabled}
        style={{
          width: "100%", padding: "13px 18px", borderRadius: 12,
          background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: disabled ? "#555" : "white", fontSize: 14, outline: "none",
          fontFamily: "inherit", opacity: disabled ? 0.6 : 1
        }}
      />
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#050508", color: "#fafafa",
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* NAV */}
      <div style={{
        padding: "0 32px", height: 60, borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontWeight: 800, fontSize: 20 }}>Fit<span style={{ color: ORANGE }}>Flow</span></span>
          <span style={{ color: "#444" }}>›</span>
          <span style={{ fontSize: 14, color: "#888", fontWeight: 600 }}>Paramètres</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/dashboard" style={{ fontSize: 13, color: "#666", textDecoration: "none", fontWeight: 600 }}>← Retour au Dashboard</a>
          <button style={{
            background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.15)",
            color: RED, padding: "8px 16px", borderRadius: 10,
            fontSize: 12, fontWeight: 600, cursor: "pointer"
          }}>Déconnexion</button>
        </div>
      </div>

      {/* LAYOUT */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 32 }}>

        {/* Sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Paramètres</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {tabs.map(tab => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "12px 16px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                  border: "none", cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 10,
                  background: activeTab === tab.id ? "rgba(255,92,0,0.1)" : "transparent",
                  color: activeTab === tab.id ? ORANGE : "#777",
                  outline: activeTab === tab.id ? `1px solid rgba(255,92,0,0.15)` : "none",
                  transition: "all 0.15s"
                }}
              >
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20, padding: 32
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 28 }}>Profil</h3>

              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, fontWeight: 900
                }}>S</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Souleymane</div>
                  <div style={{ fontSize: 13, color: "#666" }}>souleymane@email.com</div>
                  <button style={{
                    marginTop: 8, padding: "6px 14px", borderRadius: 8,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#aaa", fontSize: 12, fontWeight: 600, cursor: "pointer"
                  }}>Changer la photo</button>
                </div>
              </div>

              <InputField label="Nom complet" value="Souleymane" />
              <InputField label="Email" value="souleymane@email.com" type="email" />
              <InputField label="Téléphone (optionnel)" placeholder="+33 6 12 34 56 78" />

              <button style={{
                padding: "14px 32px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: `0 6px 20px ${ORANGE}25`
              }}>💾 Sauvegarder</button>
            </div>
          )}

          {/* INSTAGRAM */}
          {activeTab === "instagram" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Connection Status */}
              <div style={{
                background: igConnected ? "rgba(0,210,106,0.04)" : "rgba(255,92,0,0.04)",
                border: `1px solid ${igConnected ? "rgba(0,210,106,0.12)" : "rgba(255,92,0,0.12)"}`,
                borderRadius: 20, padding: 32
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Connexion Instagram</h3>

                {igConnected ? (
                  <div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 16,
                      background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 20, marginBottom: 16
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: "linear-gradient(135deg, #833AB4, #E1306C, #FCAF45)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 24
                      }}>📸</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>@votre_compte_fitness</div>
                        <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>✓ Connecté</div>
                      </div>
                      <button
                        onClick={() => setIgConnected(false)}
                        style={{
                          marginLeft: "auto", padding: "8px 16px", borderRadius: 8,
                          background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.15)",
                          color: RED, fontSize: 12, fontWeight: 600, cursor: "pointer"
                        }}
                      >Déconnecter</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <p style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>
                      Connectez votre compte Instagram Business pour activer l&apos;automatisation
                    </p>
                    <button
                      onClick={() => setIgConnected(true)}
                      style={{
                        background: "linear-gradient(135deg, #833AB4, #E1306C, #FCAF45)",
                        border: "none", borderRadius: 12, color: "white",
                        padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer",
                        display: "inline-flex", alignItems: "center", gap: 10
                      }}
                    >
                      <span>📸</span> Connecter Instagram
                    </button>
                    <p style={{ fontSize: 12, color: "#555", marginTop: 12 }}>
                      Nécessite un compte Instagram Business ou Creator
                    </p>
                  </div>
                )}
              </div>

              {/* Auto-DM Settings */}
              <div style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, padding: 32
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Automatisation</h3>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.04)"
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Activer l&apos;envoi automatique de DMs</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Les leads qualifiés reçoivent automatiquement un message</div>
                  </div>
                  <Toggle on={autoDm} onChange={() => setAutoDm(!autoDm)} />
                </div>

                <div style={{ padding: "20px 0" }}>
                  <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10 }}>
                    Limite quotidienne de DMs
                  </label>
                  <input
                    type="number" value={dmLimit}
                    onChange={(e) => setDmLimit(Number(e.target.value))}
                    style={{
                      width: "100%", padding: "13px 18px", borderRadius: 12,
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      color: "white", fontSize: 14, outline: "none", fontFamily: "inherit"
                    }}
                  />
                  <p style={{ fontSize: 12, color: "#555", marginTop: 8 }}>
                    Recommandé : 50/jour pour éviter les restrictions Instagram
                  </p>
                </div>

                <button style={{
                  padding: "14px 32px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                  color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer"
                }}>💾 Sauvegarder</button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20, padding: 32
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 28 }}>Notifications</h3>

              {[
                { label: "Nouveaux leads VIP", desc: "Notifié quand un lead avec score ≥ 9 est détecté", on: emailNotifs, toggle: () => setEmailNotifs(!emailNotifs) },
                { label: "DMs envoyés", desc: "Résumé des DMs automatiques envoyés", on: pushNotifs, toggle: () => setPushNotifs(!pushNotifs) },
                { label: "Rapport hebdomadaire", desc: "Reçevez un rapport de performance chaque lundi", on: weeklyReport, toggle: () => setWeeklyReport(!weeklyReport) },
              ].map((n, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "18px 0",
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none"
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{n.label}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{n.desc}</div>
                  </div>
                  <Toggle on={n.on} onChange={n.toggle} />
                </div>
              ))}
            </div>
          )}

          {/* BILLING */}
          {activeTab === "billing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                background: "rgba(255,92,0,0.04)", border: "1px solid rgba(255,92,0,0.12)",
                borderRadius: 20, padding: 32
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Plan actuel</div>
                    <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Pro</h3>
                    <p style={{ fontSize: 14, color: "#888" }}>47€/mois · Prochain renouvellement le 15 mars 2026</p>
                  </div>
                  <button style={{
                    padding: "10px 20px", borderRadius: 10,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#aaa", fontSize: 13, fontWeight: 600, cursor: "pointer"
                  }}>Changer de plan</button>
                </div>
              </div>

              <div style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, padding: 32
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Historique de facturation</h3>
                {[
                  { date: "15 fév 2026", amount: "47€", status: "Payé" },
                  { date: "15 jan 2026", amount: "47€", status: "Payé" },
                  { date: "15 déc 2025", amount: "47€", status: "Payé" },
                ].map((inv, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 0",
                    borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none"
                  }}>
                    <span style={{ fontSize: 14 }}>{inv.date}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{inv.amount}</span>
                    <span style={{
                      background: "rgba(0,210,106,0.1)", color: GREEN,
                      padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700
                    }}>{inv.status}</span>
                    <button style={{
                      background: "none", border: "none", color: BLUE,
                      fontSize: 12, fontWeight: 600, cursor: "pointer"
                    }}>Télécharger</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20, padding: 32
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 28 }}>Sécurité</h3>

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Changer le mot de passe</h4>
                <InputField label="Mot de passe actuel" placeholder="••••••••" type="password" />
                <InputField label="Nouveau mot de passe" placeholder="••••••••" type="password" />
                <InputField label="Confirmer" placeholder="••••••••" type="password" />
                <button style={{
                  padding: "14px 32px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                  color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer"
                }}>Mettre à jour</button>
              </div>

              <div style={{
                marginTop: 32, paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.06)"
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: RED, marginBottom: 8 }}>Zone dangereuse</h4>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
                  Supprimer votre compte et toutes vos données. Cette action est irréversible.
                </p>
                <button style={{
                  padding: "10px 20px", borderRadius: 10,
                  background: "rgba(255,77,77,0.08)", border: "1px solid rgba(255,77,77,0.2)",
                  color: RED, fontSize: 13, fontWeight: 700, cursor: "pointer"
                }}>Supprimer mon compte</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
