'use client'

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const ORANGE = "#FF5C00";
const GREEN = "#00D26A";
const BLUE = "#3B82F6";

export function RevenueTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [period, setPeriod] = useState("month");
  const [conversions, setConversions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState("");
  const [addClient, setAddClient] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => { fetchConversions(); }, [period]);

  const fetchConversions = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer le coach_id depuis coaches table
      const { data: coach } = await supabase
        .from('coaches')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (!coach) return;

      const now = new Date();
      let from = new Date();
      if (period === "week") from.setDate(now.getDate() - 7);
      else if (period === "month") from.setMonth(now.getMonth() - 1);
      else from.setFullYear(now.getFullYear() - 1);

      // Les revenus viennent des leads convertis avec revenue > 0
      const { data } = await supabase
        .from('leads')
        .select('id, username, comment, revenue, conversion_date, status, created_at')
        .eq('coach_id', coach.id)
        .eq('status', 'converted')
        .gt('revenue', 0)
        .gte('created_at', from.toISOString())
        .order('created_at', { ascending: false });

      setConversions(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRevenue = async () => {
    if (!addAmount) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (!coach) return;

    // Créer un lead converti manuellement
    await supabase.from('leads').insert({
      coach_id: coach.id,
      username: addClient.replace('@', '') || 'client_manuel',
      comment: addDesc || 'Revenu ajouté manuellement',
      status: 'converted',
      revenue: Number(addAmount),
      conversion_date: new Date().toISOString(),
      ai_score: 0,
    });

    setShowAddModal(false);
    setAddAmount(""); setAddClient(""); setAddDesc("");
    setSaving(false);
    fetchConversions();
  };

  // Calculs réels depuis leads convertis
  const totalRevenue = conversions.reduce((s, r) => s + (r.revenue || 0), 0);
  const uniqueClients = new Set(conversions.map(r => r.username)).size;
  const avgRevenue = uniqueClients > 0 ? Math.round(totalRevenue / uniqueClients) : 0;

  // Chart — 4 semaines
  const weeklyData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (3 - i) * 7 - 7);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - (3 - i) * 7);
    const weekRevs = conversions.filter(r => {
      const d = new Date(r.created_at);
      return d >= weekStart && d < weekEnd;
    });
    return {
      label: `Sem ${i + 1}`,
      total: weekRevs.reduce((s, r) => s + (r.revenue || 0), 0),
    };
  });
  const maxRevTotal = Math.max(...weeklyData.map(w => w.total), 1);
  const hasData = conversions.length > 0;

  return (
    <div style={{ padding: "0 0 28px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Revenue</h1>
          <p style={{ fontSize: 14, color: "#666" }}>Suivez vos revenus générés via FitFlow</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3 }}>
            {[{ id: "week", label: "Semaine" }, { id: "month", label: "Mois" }, { id: "year", label: "Année" }].map(p => (
              <button key={p.id} onClick={() => setPeriod(p.id)} style={{
                padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: "none", cursor: "pointer",
                background: period === p.id ? "rgba(255,92,0,0.12)" : "transparent",
                color: period === p.id ? ORANGE : "#666"
              }}>{p.label}</button>
            ))}
          </div>
          <button onClick={() => setShowAddModal(true)} style={{
            background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
            border: "none", borderRadius: 10, color: "white",
            padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: `0 4px 16px ${ORANGE}25`
          }}>+ Ajouter un revenu</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Revenue Total", value: hasData ? `${totalRevenue.toLocaleString()}€` : "0€", icon: "💰", color: ORANGE },
          { label: "Revenue / Client", value: uniqueClients > 0 ? `${avgRevenue}€` : "—", icon: "📈", color: BLUE },
          { label: "Clients Convertis", value: String(uniqueClients || 0), icon: "👥", color: GREEN },
          { label: "Conversions", value: String(conversions.length), icon: "🎯", color: ORANGE },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "22px 20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</span>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: 28, marginBottom: 24
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, display: "block", marginBottom: 24 }}>Revenus par semaine</span>
        {hasData ? (
          <div style={{ display: "flex", alignItems: "flex-end", height: 180, gap: 20, padding: "0 8px" }}>
            {weeklyData.map((w, i) => {
              const h = (w.total / maxRevTotal) * 160;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#aaa" }}>
                    {w.total > 0 ? `${w.total.toLocaleString()}€` : "—"}
                  </span>
                  <div style={{
                    height: Math.max(h, w.total > 0 ? 4 : 0), width: "100%",
                    background: `linear-gradient(180deg, ${ORANGE}, ${ORANGE}50)`,
                    borderRadius: "6px 6px 2px 2px"
                  }} />
                  <span style={{ fontSize: 12, color: "#555" }}>{w.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
              <p style={{ fontSize: 14, color: "#555" }}>Ajoutez votre premier revenu pour voir le graphique</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Conversions */}
      <div style={{
        background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: 28
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, display: "block", marginBottom: 20 }}>Dernières conversions</span>

        {hasData ? (
          <>
            <div style={{
              display: "grid", gridTemplateColumns: "150px 1fr 100px 80px",
              padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#444",
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 4
            }}>
              <span>Client</span>
              <span>Commentaire</span>
              <span>Montant</span>
              <span style={{ textAlign: "right" }}>Date</span>
            </div>
            {conversions.map((r, i) => (
              <div key={r.id || i} style={{
                display: "grid", gridTemplateColumns: "150px 1fr 100px 80px",
                padding: "14px 16px", alignItems: "center", borderRadius: 10,
                background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent"
              }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>@{r.username}</span>
                <span style={{ fontSize: 13, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 16 }}>
                  {r.comment || "—"}
                </span>
                <span style={{ fontSize: 15, fontWeight: 800, color: GREEN }}>+{r.revenue}€</span>
                <span style={{ fontSize: 12, color: "#555", textAlign: "right" }}>
                  {new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#888", marginBottom: 8 }}>Aucun revenu enregistré</p>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>
              Ajoutez manuellement vos revenus ou connectez Instagram pour les générer automatiquement.
            </p>
            <button onClick={() => setShowAddModal(true)} style={{
              padding: "12px 28px", borderRadius: 12,
              background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
              border: "none", color: "white", fontWeight: 700,
              fontSize: 14, cursor: "pointer"
            }}>+ Ajouter un revenu</button>
          </div>
        )}
      </div>

      {/* Add Revenue Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            background: "#111", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20, padding: 32, width: 440
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>💰 Ajouter un revenu</h3>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Montant (€) *</label>
              <input type="number" placeholder="297" value={addAmount}
                onChange={e => setAddAmount(e.target.value)} style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "white", fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box"
                }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Client (optionnel)</label>
              <input type="text" placeholder="@username" value={addClient}
                onChange={e => setAddClient(e.target.value)} style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "white", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box"
                }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Description</label>
              <input type="text" placeholder="Programme 12 semaines" value={addDesc}
                onChange={e => setAddDesc(e.target.value)} style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "white", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box"
                }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleAddRevenue} disabled={saving || !addAmount} style={{
                flex: 1, padding: "14px",
                background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                border: "none", borderRadius: 12, color: "white",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                opacity: (saving || !addAmount) ? 0.6 : 1
              }}>{saving ? "Ajout..." : "Ajouter"}</button>
              <button onClick={() => setShowAddModal(false)} style={{
                padding: "14px 24px", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
                color: "#888", fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
