'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import {
  CheckCircle2,
  MessageSquare,
  Send,
  Sparkles,
  Eye,
  Clock,
  TrendingUp,
  X,
  Copy,
  RefreshCw
} from 'lucide-react'

type FilterType = 'all' | 'vip' | 'standard' | 'low'
type ConversationMode = 'auto' | 'manual'

interface Message {
  id: string
  sender: 'coach' | 'lead' | 'ai'
  content: string
  timestamp: Date
  status?: 'sent' | 'delivered' | 'read'
}

export function LeadsTab() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [conversationMode, setConversationMode] = useState<ConversationMode>('auto')
  const [draftMessage, setDraftMessage] = useState('')
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategory = (lead: any) => {
    if (!lead.ai_score) return 'low'
    if (lead.ai_score >= 9) return 'vip'
    if (lead.ai_score >= 7) return 'standard'
    return 'low'
  }

  const filteredLeads = filter === 'all'
    ? leads
    : leads.filter(lead => getCategory(lead) === filter)

  const selectedLeadData = leads.find(l => l.id === selectedLead)

  const getCategoryBadgeVariant = (category: string) => {
    switch(category) {
      case 'vip': return 'orange'
      case 'standard': return 'blue'
      default: return 'gray'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'converted': return 'green'
      case 'replied': return 'blue'
      case 'dm_sent': return 'yellow'
      default: return 'gray'
    }
  }

  const generateAISuggestion = () => {
    const suggestions = [
      "Hey ! J'ai remarqué que tu t'intéresses au fitness. J'ai un programme spécial qui pourrait te plaire. Tu veux en savoir plus ?",
      "Salut ! Merci pour ton commentaire. Je propose un coaching perso adapté à tes objectifs. Ça t'intéresse ?",
      "Coucou ! Super de te voir actif sur mes posts ! J'ai justement des places qui se libèrent pour mon programme. On en parle ?",
    ]
    setDraftMessage(suggestions[Math.floor(Math.random() * suggestions.length)])
  }

  if (loading) {
    return <div className="text-center py-12 text-[#888]">Chargement...</div>
  }

  return (
    <div className="h-full flex gap-6">
      {/* Left Panel - Leads List */}
      <div className={`${selectedLead ? 'w-2/5' : 'w-full'} space-y-4 transition-all duration-300`}>
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'default' : 'outline'} size="sm" className={filter === 'all' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}>
            Tous ({leads.length})
          </Button>
          <Button onClick={() => setFilter('vip')} variant={filter === 'vip' ? 'default' : 'outline'} size="sm" className={filter === 'vip' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}>
            VIP ({leads.filter(l => getCategory(l) === 'vip').length})
          </Button>
          <Button onClick={() => setFilter('standard')} variant={filter === 'standard' ? 'default' : 'outline'} size="sm" className={filter === 'standard' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}>
            Standard ({leads.filter(l => getCategory(l) === 'standard').length})
          </Button>
          <Button onClick={() => setFilter('low')} variant={filter === 'low' ? 'default' : 'outline'} size="sm" className={filter === 'low' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}>
            Low ({leads.filter(l => getCategory(l) === 'low').length})
          </Button>
        </div>

        {/* Leads Cards */}
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">Aucun lead pour l'instant</h3>
            <p className="text-sm text-[#888]">Vos premiers leads apparaîtront ici dès que l'automatisation sera active.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
            {filteredLeads.map((lead) => (
              <Card
                key={lead.id}
                onClick={() => setSelectedLead(lead.id)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedLead === lead.id
                    ? 'bg-[rgba(255,92,0,0.15)] border-[#FF5C00] ring-2 ring-[#FF5C00]/30'
                    : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,92,0,0.08)] hover:border-[rgba(255,92,0,0.3)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {(lead.username || lead.instagram_username || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold truncate">@{lead.username || lead.instagram_username || 'unknown'}</span>
                        <Badge variant={getCategoryBadgeVariant(getCategory(lead))} className="text-xs">
                          {lead.ai_score || 0}/10
                        </Badge>
                      </div>
                      <p className="text-sm text-[#888] line-clamp-2 mb-2">{lead.comment || lead.comment_text || ''}</p>
                      <div className="flex items-center gap-3 text-xs text-[#666]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lead.created_at ? new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}
                        </span>
                        <Badge variant={getStatusBadgeVariant(lead.status || 'new')} className="text-xs">
                          {lead.status === 'converted' ? 'Converti' :
                           lead.status === 'replied' ? 'Répondu' :
                           lead.status === 'dm_sent' ? 'DM envoyé' : 'Nouveau'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedLead(lead.id) }} className="bg-[rgba(255,92,0,0.1)] hover:bg-[rgba(255,92,0,0.2)] text-[#FF5C00] border border-[rgba(255,92,0,0.3)] flex-shrink-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                {lead.status === 'converted' && lead.revenue && (
                  <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between">
                    <span className="text-sm text-[#00D26A] font-semibold flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Revenu: {lead.revenue}€
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel - Lead Detail */}
      {selectedLead && selectedLeadData && (
        <div className="w-3/5 flex flex-col h-[calc(100vh-200px)]">
          <Card className="flex-1 flex flex-col bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between bg-[rgba(255,92,0,0.05)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] flex items-center justify-center">
                  <span className="text-white font-bold">
                    {(selectedLeadData.username || selectedLeadData.instagram_username || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">@{selectedLeadData.username || selectedLeadData.instagram_username || 'unknown'}</h3>
                  <p className="text-xs text-[#888]">
                    Score IA: {selectedLeadData.ai_score || 0}/10 • {getCategory(selectedLeadData).toUpperCase()}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedLead(null)} className="text-[#888] hover:text-white hover:bg-[rgba(255,255,255,0.05)]">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Lead Info */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)]">
                <h4 className="text-sm font-semibold text-white mb-2">Commentaire</h4>
                <p className="text-sm text-[#888]">{selectedLeadData.comment || selectedLeadData.comment_text || 'Aucun commentaire'}</p>
              </div>
              {selectedLeadData.ai_reason && (
                <div className="p-4 rounded-lg bg-[rgba(255,92,0,0.05)]">
                  <h4 className="text-sm font-semibold text-white mb-2">Analyse IA</h4>
                  <p className="text-sm text-[#888]">{selectedLeadData.ai_reason}</p>
                </div>
              )}
              {selectedLeadData.suggested_reply && (
                <div className="p-4 rounded-lg bg-[rgba(139,92,246,0.05)]">
                  <h4 className="text-sm font-semibold text-white mb-2">Réponse suggérée</h4>
                  <p className="text-sm text-[#888]">{selectedLeadData.suggested_reply}</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.07)] bg-[rgba(0,0,0,0.2)]">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button size="sm" onClick={generateAISuggestion} className="bg-[rgba(139,92,246,0.1)] hover:bg-[rgba(139,92,246,0.2)] text-purple-300 border border-[rgba(139,92,246,0.3)] flex-shrink-0">
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Suggestion IA
                  </Button>
                  {draftMessage && (
                    <Button size="sm" onClick={() => navigator.clipboard.writeText(draftMessage)} className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#888] hover:text-white flex-shrink-0">
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      Copier
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={draftMessage} onChange={(e) => setDraftMessage(e.target.value)} placeholder="Écris ton message ou génère une suggestion IA..." className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white placeholder-[#666] focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] text-sm" />
                  <Button size="sm" disabled={!draftMessage} className="bg-[#FF5C00] hover:bg-[#FF7A2D] text-white disabled:opacity-50 disabled:cursor-not-allowed px-6">
                    <Send className="w-4 h-4 mr-1.5" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
