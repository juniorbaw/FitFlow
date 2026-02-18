'use client'

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      color: '#fafafa', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, sans-serif"
    }}>
      <div style={{ textAlign: 'center', padding: '20px', maxWidth: '500px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Une erreur est survenue</h2>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>{error.message}</p>
        <button onClick={reset} style={{
          background: '#FF5C00', 
          color: 'white', 
          padding: '12px 32px',
          borderRadius: 12, 
          border: 'none', 
          fontWeight: 700, 
          cursor: 'pointer',
          fontSize: 16
        }}>
          Réessayer
        </button>
      </div>
    </div>
  )
}
