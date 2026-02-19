'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, DollarSign, TrendingUp, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const [coaches, setCoaches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCoaches(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalUsers = coaches.length
  const totalRevenue = coaches.reduce((sum, c) => sum + (c.revenue || 0), 0)
  const mrr = coaches.filter(c => c.plan !== 'free').length * 97

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fafafa', padding: 32 }}>
      <button onClick={() => router.push('/dashboard')} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px 16px', borderRadius: 8, color: 'white', cursor: 'pointer' }}>
        <ArrowLeft size={16} /> Retour
      </button>

      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 32 }}>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Users size={20} color="#FF5C00" />
            <span style={{ fontSize: 14, color: '#888' }}>Total Coaches</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{totalUsers}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <DollarSign size={20} color="#00D26A" />
            <span style={{ fontSize: 14, color: '#888' }}>MRR</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{mrr}€</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <TrendingUp size={20} color="#3B82F6" />
            <span style={{ fontSize: 14, color: '#888' }}>Revenue Total</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{totalRevenue}€</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Liste des Coaches</h2>
        
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: 12, fontSize: 13, color: '#888' }}>Nom</th>
                  <th style={{ textAlign: 'left', padding: 12, fontSize: 13, color: '#888' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: 12, fontSize: 13, color: '#888' }}>Plan</th>
                  <th style={{ textAlign: 'left', padding: 12, fontSize: 13, color: '#888' }}>Créé le</th>
                  <th style={{ textAlign: 'left', padding: 12, fontSize: 13, color: '#888' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coaches.map(coach => (
                  <tr key={coach.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: 12 }}>{coach.name || '-'}</td>
                    <td style={{ padding: 12 }}>{coach.email}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ background: coach.plan === 'elite' ? '#FF5C00' : coach.plan === 'pro' ? '#3B82F6' : '#666', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                        {coach.plan || 'free'}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 13, color: '#888' }}>
                      {new Date(coach.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: 12 }}>
                      <button style={{ background: 'rgba(255,92,0,0.2)', border: 'none', padding: '6px 12px', borderRadius: 6, color: '#FF5C00', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
