'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const ORANGE = "#FF5C00"
const GREEN = "#00D26A"
const BLUE = "#3B82F6"

export function AutoDMTab() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDMData()
  }, [])

  const fetchDMData = async () => {
    try {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .in('status', ['dm_sent', 'replied', 'converted'])
        .order('created_at', { ascending: false })
        .limit(50)
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching DM data:', error)
    } finally {
      setLoading(false)
    }
  }

  const dmsSent = leads.filter(l => l.status === 'dm_sent').length
  const replies = leads.filter(l => l.status === 'replied').length
  const converted = leads.filter(l => l.status === 'converted').length
  const replyRate = leads.length > 0 ? Math.round(((replies + converted) / leads.length) * 100) : 0

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
        Chargement...
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 24 }}>
        Auto-DM
      </h2>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        {[
          { label: 'DMs envoyés', value: dmsSent, icon: '✉️', color: BLUE },
          { label: 'Réponses', value: replies, icon: '💬', color: GREEN },
          { label: 'Convertis', value: converted, icon: '🏆', color: ORANGE },
          { label: 'Taux de réponse', value: `${replyRate}%`, icon: '📈', color: ORANGE },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, flex: 1, minWidth: 180 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{stat.label}</span>
              <span style={{ fontSize: 20 }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* System status */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Système d'automatisation</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,210,106,0.1)', border: '1px solid rgba(0,210,106,0.2)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: GREEN }}>
            <span style={{ width: 7, height: 7, background: GREEN, borderRadius: '50%' }}></span>
            Actif
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>
          Les DMs sont envoyés automatiquement aux leads qualifiés. Les messages sont personnalisés en fonction du score AI et du contenu du commentaire.
        </p>
      </div>

      {/* Recent DMs */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>DMs récents</div>
        </div>
        {leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 8 }}>Aucun DM envoyé pour l'instant</h3>
            <p style={{ fontSize: 13, color: '#888' }}>Les DMs seront envoyés automatiquement dès que des leads qualifiés seront détectés.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>@{lead.instagram_username || lead.username || 'unknown'}</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{lead.comment_text || lead.comment || ''}</div>
              </div>
              <span style={{
                background: lead.status === 'converted' ? 'rgba(0,210,106,0.15)' : lead.status === 'replied' ? 'rgba(59,130,246,0.15)' : 'rgba(255,184,0,0.15)',
                color: lead.status === 'converted' ? GREEN : lead.status === 'replied' ? BLUE : '#FFB800',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600
              }}>
                {lead.status === 'converted' ? 'Converti' : lead.status === 'replied' ? 'Répondu' : 'DM envoyé'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
