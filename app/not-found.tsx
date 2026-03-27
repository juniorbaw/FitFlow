import Link from 'next/link'

export default function NotFound() {
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
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontSize: 80, fontWeight: 900, color: '#FF5C00', marginBottom: 16 }}>404</h1>
        <p style={{ fontSize: 20, color: '#888', marginBottom: 32 }}>Cette page n'existe pas</p>
        <Link href="/dashboard" style={{
          background: 'linear-gradient(135deg, #FF5C00, #FF8A00)',
          color: 'white',
          padding: '12px 32px',
          borderRadius: 12,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 16,
          display: 'inline-block'
        }}>
          ← Retour au Dashboard
        </Link>
      </div>
    </div>
  )
}
