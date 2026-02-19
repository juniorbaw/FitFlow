'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      color: '#fafafa',
      padding: 20,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Quelque chose s'est mal passé</h1>
        <p style={{ fontSize: 16, color: '#888', marginBottom: 32, lineHeight: 1.6 }}>
          Une erreur inattendue est survenue. Réessaie ou retourne à l'accueil.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              background: '#FF5C00',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>
          <a
            href="/"
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  )
}
