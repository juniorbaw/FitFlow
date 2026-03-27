'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { User, Settings, LogOut, HelpCircle, Sun, Moon } from 'lucide-react'
export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    getUser()
    
    // Load theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF5C00, #FF8A00)',
          border: '2px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: 16,
          color: 'white',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {user.email?.[0].toUpperCase() || 'U'}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: 0,
          width: 240,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          boxShadow: '0 8px 24px var(--shadow)',
          padding: '8px',
          zIndex: 1000
        }}>
          {/* User Info */}
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid var(--border)',
            marginBottom: 8
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {user.user_metadata?.name || 'Coach'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {user.email}
            </div>
          </div>

          {/* Menu Items */}
          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.2s',
              color: 'var(--text-primary)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <User style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Dashboard</span>
            </div>
          </Link>

          <Link href="/settings" onClick={() => setIsOpen(false)}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.2s',
              color: 'var(--text-primary)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <Settings style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Paramètres</span>
            </div>
          </Link>

          <Link href="/how-it-works" onClick={() => setIsOpen(false)}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.2s',
              color: 'var(--text-primary)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <HelpCircle style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Comment ça marche</span>
            </div>
          </Link>

          {/* Theme Toggle */}
          <div 
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.2s',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {theme === 'light' ? (
              <Moon style={{ width: 18, height: 18 }} />
            ) : (
              <Sun style={{ width: 18, height: 18 }} />
            )}
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {theme === 'light' ? 'Mode nuit' : 'Mode jour'}
            </span>
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }}></div>

          {/* Logout */}
          <div
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.2s',
              color: '#FF3B30'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,59,48,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut style={{ width: 18, height: 18 }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Se déconnecter</span>
          </div>
        </div>
      )}
    </div>
  )
}
