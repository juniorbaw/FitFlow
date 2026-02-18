'use client'

import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '32px' }}>
      <button onClick={() => router.back()} style={{ marginBottom: 24, padding: '8px 16px', background: 'var(--orange)', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer' }}>
        ← Retour
      </button>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Settings</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Page en construction...</p>
    </div>
  )
}
