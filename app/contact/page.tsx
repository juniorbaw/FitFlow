'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, Mail, MessageSquare, Instagram, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

const ORANGE = '#FF5C00'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    
    // Simuler l'envoi (à remplacer par vraie API)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSent(true)
    setSending(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
    
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fafafa' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '20px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>
              <span style={{ color: ORANGE }}>Fit</span>
              <span style={{ color: '#fafafa' }}>Flow</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
        <Link 
          href="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            color: '#888', 
            textDecoration: 'none', 
            fontSize: 14, 
            marginBottom: 24 
          }}
        >
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16 }}>
          Nous contacter
        </h1>
        <p style={{ fontSize: 18, color: '#888', marginBottom: 48 }}>
          Une question, une demande de démo ou un problème technique ? Nous sommes là pour vous aider.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
          <Card style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: 24, borderRadius: 16 }}>
            <Mail size={32} style={{ color: ORANGE, marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Email</h3>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Pour toute question commerciale ou technique</p>
            <a href="mailto:contact@fitflow.app" style={{ color: ORANGE, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              contact@fitflow.app
            </a>
          </Card>

          <Card style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: 24, borderRadius: 16 }}>
            <Instagram size={32} style={{ color: ORANGE, marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Instagram</h3>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>Suivez-nous pour des tips et actualités</p>
            <a href="https://instagram.com/fitflow" target="_blank" rel="noopener" style={{ color: ORANGE, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              @fitflow
            </a>
          </Card>
        </div>

        {/* Form */}
        <Card style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: 32, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <MessageSquare size={24} style={{ color: ORANGE }} />
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Envoyez-nous un message</h2>
          </div>

          {sent && (
            <div style={{ 
              padding: 16, 
              background: 'rgba(16,185,129,0.1)', 
              border: '1px solid rgba(16,185,129,0.3)', 
              borderRadius: 12, 
              marginBottom: 24,
              color: '#10B981',
              fontSize: 14
            }}>
              ✓ Message envoyé ! Nous vous répondrons dans les 24h.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <Label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>Nom complet</Label>
              <Input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fafafa' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>Email</Label>
              <Input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fafafa' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>Sujet</Label>
              <Input 
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Ex: Demande de démo"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fafafa' }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <Label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>Message</Label>
              <textarea 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Décrivez votre demande..."
                rows={6}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: '#fafafa',
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <Button 
              type="submit"
              disabled={sending}
              style={{ 
                background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`, 
                border: 'none',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <Send size={16} /> {sending ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
