import Link from 'next/link'

export default function NotFound() {
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
        <div style={{ fontSize: 80, fontWeight: 900, color: '#FF5C00', marginBottom: 8 }}>404</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Page introuvable</h1>
        <p style={{ fontSize: 16, color: '#888', marginBottom: 32, lineHeight: 1.6 }}>
          La page que tu cherches n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: '#FF5C00',
            color: 'white',
            padding: '14px 32px',
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
