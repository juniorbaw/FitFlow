'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Calendar, Clock, Plus, Trash2, Image as ImageIcon, Tag, ArrowLeft, Sparkles } from 'lucide-react'

const ORANGE = "#FF5C00"

export default function SchedulePage() {
  const router = useRouter()
  const supabase = createClient()
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    caption: '',
    scheduled_time: '',
    image_url: '',
    tags: ''
  })

  useEffect(() => {
    checkUser()
    loadScheduledPosts()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  const loadScheduledPosts = async () => {
    // Données de démo
    setScheduledPosts([
      {
        id: '1',
        caption: 'Transform your life in 90 days! 💪 Join my exclusive coaching program. Limited spots available.',
        scheduled_time: '2026-02-15T18:00:00',
        status: 'scheduled',
        tags: ['fitness', 'coaching', 'transformation']
      },
      {
        id: '2',
        caption: 'New blog post: 5 Steps to Scale Your Business 🚀 Link in bio!',
        scheduled_time: '2026-02-18T14:30:00',
        status: 'scheduled',
        tags: ['business', 'entrepreneur', 'growth']
      },
      {
        id: '3',
        caption: 'Client transformation: -15kg in 3 months! 🔥 Ask me how in the comments',
        scheduled_time: '2026-02-20T09:00:00',
        status: 'scheduled',
        tags: ['transformation', 'results', 'motivation']
      }
    ])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newPost = {
      id: Date.now().toString(),
      caption: formData.caption,
      scheduled_time: formData.scheduled_time,
      status: 'scheduled',
      tags: formData.tags.split(',').map(t => t.trim())
    }
    
    setScheduledPosts([...scheduledPosts, newPost])
    alert('Post planifié avec succès! 🎉')
    setShowForm(false)
    setFormData({ caption: '', scheduled_time: '', image_url: '', tags: '' })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer ce post planifié?')) return
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id))
    alert('Post supprimé')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return date.toLocaleDateString('fr-FR', options)
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 64, height: 64, border: `4px solid ${ORANGE}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }}></div>
          <p style={{ color: "#888", fontWeight: 600 }}>Chargement du planning...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fafafa", fontFamily: "'DM Sans', -apple-system, sans-serif", width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px clamp(16px, 4vw, 32px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0a0a", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px)", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <button 
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#888" }}
            >
              <ArrowLeft style={{ width: 18, height: 18 }} />
            </button>
            <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5, color: "white" }}>
              Fit<span style={{ color: ORANGE }}>Flow</span>
            </div>
          </Link>
          
          <div style={{ height: 24, width: "1px", background: "rgba(255,255,255,0.1)" }}></div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar style={{ width: 18, height: 18, color: ORANGE }} />
            <span style={{ fontSize: 16, fontWeight: 700 }}>Planning</span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
            border: "none",
            borderRadius: "12px",
            padding: "12px 24px",
            color: "white",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: `0 8px 24px ${ORANGE}30`,
            transition: "transform 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <Plus style={{ width: 18, height: 18 }} />
          Nouveau post
        </button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "clamp(16px, 4vw, 32px)", width: "100%", boxSizing: "border-box" }}>
        
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Posts planifiés</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: ORANGE }}>{scheduledPosts.length}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Cette semaine</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#3B82F6" }}>
              {scheduledPosts.filter(p => new Date(p.scheduled_time) < new Date(Date.now() + 7*24*60*60*1000)).length}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Prochain post</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>
              {scheduledPosts.length > 0 ? new Date(scheduledPosts[0].scheduled_time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '-'}
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: "white" }}>
            Posts programmés
          </h2>

          {scheduledPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: 80, background: "rgba(255,255,255,0.02)", borderRadius: 20, border: "1px dashed rgba(255,255,255,0.1)" }}>
              <Calendar style={{ width: 64, height: 64, color: "#444", margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#666", marginBottom: 8 }}>Aucun post planifié</h3>
              <p style={{ fontSize: 14, color: "#555", marginBottom: 24 }}>Planifiez votre premier post pour automatiser votre contenu</p>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: `0 8px 24px ${ORANGE}30`
                }}
              >
                Créer un post
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {scheduledPosts.map((post) => (
                <div 
                  key={post.id}
                  style={{ 
                    background: "rgba(255,255,255,0.03)", 
                    border: "1px solid rgba(255,255,255,0.07)", 
                    borderRadius: 16, 
                    padding: 24,
                    transition: "all 0.2s",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                    e.currentTarget.style.borderColor = "rgba(255,92,0,0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)"
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div style={{ 
                          background: `${ORANGE}15`, 
                          border: `1px solid ${ORANGE}30`,
                          borderRadius: 8,
                          padding: "4px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          color: ORANGE
                        }}>
                          <Clock style={{ width: 12, height: 12, display: "inline", marginRight: 4 }} />
                          {formatDate(post.scheduled_time)}
                        </div>
                      </div>
                      
                      <p style={{ fontSize: 15, color: "white", lineHeight: 1.6, marginBottom: 16 }}>
                        {post.caption}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {post.tags.map((tag: string, idx: number) => (
                            <span 
                              key={idx}
                              style={{ 
                                background: "rgba(59,130,246,0.1)",
                                border: "1px solid rgba(59,130,246,0.2)",
                                borderRadius: 6,
                                padding: "4px 10px",
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#60A5FA"
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        background: "rgba(255,77,77,0.1)",
                        border: "1px solid rgba(255,77,77,0.2)",
                        borderRadius: 8,
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#FF4D4D",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,77,77,0.2)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,77,77,0.1)"
                      }}
                    >
                      <Trash2 style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setShowForm(false)}
        >
          <div 
            style={{ 
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: `0 20px 60px ${ORANGE}20`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '32px' }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, color: 'white' }}>
                <Sparkles style={{ width: 24, height: 24, display: 'inline', marginRight: 8, color: ORANGE }} />
                Nouveau post planifié
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 8 }}>
                    Caption du post *
                  </label>
                  <textarea
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="Écrivez votre caption ici..."
                    required
                    rows={5}
                    style={{ 
                      width: "100%", 
                      padding: "14px 16px", 
                      background: "rgba(255,255,255,0.06)", 
                      border: "1px solid rgba(255,255,255,0.1)", 
                      borderRadius: 12, 
                      color: "white", 
                      fontSize: 14, 
                      outline: "none", 
                      transition: "all 0.2s",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      resize: "vertical"
                    }}
                    onFocus={(e) => e.target.style.borderColor = ORANGE}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 8 }}>
                    Date et heure de publication *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    required
                    style={{ 
                      width: "100%", 
                      padding: "14px 16px", 
                      background: "rgba(255,255,255,0.06)", 
                      border: "1px solid rgba(255,255,255,0.1)", 
                      borderRadius: 12, 
                      color: "white", 
                      fontSize: 14, 
                      outline: "none", 
                      transition: "all 0.2s",
                      boxSizing: "border-box",
                      colorScheme: "dark"
                    }}
                    onFocus={(e) => e.target.style.borderColor = ORANGE}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#ccc', marginBottom: 8 }}>
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="fitness, motivation, transformation"
                    style={{ 
                      width: "100%", 
                      padding: "14px 16px", 
                      background: "rgba(255,255,255,0.06)", 
                      border: "1px solid rgba(255,255,255,0.1)", 
                      borderRadius: 12, 
                      color: "white", 
                      fontSize: 14, 
                      outline: "none", 
                      transition: "all 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.target.style.borderColor = ORANGE}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: `linear-gradient(135deg, ${ORANGE}, #FF8A00)`,
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "15px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: `0 8px 24px ${ORANGE}30`,
                      transition: "transform 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    Planifier le post
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      padding: "14px 24px",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#888",
                      fontSize: "15px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
