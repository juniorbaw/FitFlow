'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DemoPage() {
  const router = useRouter()
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div style={{ padding: 24, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: 24, fontWeight: 800, textDecoration: 'none', color: 'inherit' }}>
          Fit<span style={{ color: '#FF5C00' }}>Flow</span>
        </Link>
        <button onClick={() => router.push('/')} style={{ padding: '10px 20px', background: '#FF5C00', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontWeight: 600 }}>
          Retour à l'accueil
        </button>
      </div>
      <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16, textAlign: 'center' }}>
          Démo <span style={{ color: '#FF5C00' }}>FitFlow</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 40, fontSize: 18 }}>
          Découvrez comment FitFlow transforme vos commentaires Instagram en clients
        </p>
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 32, border: '1px solid var(--border)' }}>
          <iframe 
            src="/videos/explainer.html" 
            style={{ width: '100%', height: '600px', border: 'none', borderRadius: 12 }}
            title="FitFlow Explainer"
          />
        </div>
      </div>
    </div>
  )
}
