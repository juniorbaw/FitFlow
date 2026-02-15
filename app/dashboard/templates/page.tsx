'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TemplatesPage() {
  const router = useRouter()
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '32px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>
          ← Dashboard
        </Link>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>💬 Templates DM</h1>
        <div></div>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Templates de messages - En construction...</p>
    </div>
  )
}
