'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockLeads } from '@/lib/mock-data'
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

// Mock conversations data
const mockConversations: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      sender: 'lead',
      content: 'Salut ! J\'adore ton contenu sur la prise de masse ! 💪',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    },
    {
      id: '2',
      sender: 'ai',
      content: 'Salut @fitness_marie ! 🔥 Super content que mon contenu te plaise ! Tu cherches à prendre de la masse en ce moment ? J\'ai justement lancé un programme spécial qui cartonne en ce moment 💯',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read'
    },
    {
      id: '3',
      sender: 'lead',
      content: 'Oui carrément ! C\'est quoi ton programme ?',
      timestamp: new Date(Date.now() - 3400000),
      status: 'read'
    },
    {
      id: '4',
      sender: 'ai',
      content: 'C\'est un programme de 12 semaines avec nutrition + training personnalisé. J\'ai déjà 47 clients qui ont pris entre 4 et 8kg de muscle sec ! Je t\'envoie le lien en DM ? 🎯',
      timestamp: new Date(Date.now() - 3300000),
      status: 'delivered'
    }
  ],
  '2': [
    {
      id: '1',
      sender: 'lead',
      content: 'Tes abdos sont incroyables 😍',
      timestamp: new Date(Date.now() - 7200000),
      status: 'read'
    },
    {
      id: '2',
      sender: 'ai',
      content: 'Merci beaucoup ! 😊 C\'est le résultat de 3 mois d\'entraînement ciblé. Tu veux savoir comment j\'ai fait ?',
      timestamp: new Date(Date.now() - 7100000),
      status: 'read'
    },
    {
      id: '3',
      sender: 'lead',
      content: 'Ouiii svp !',
      timestamp: new Date(Date.now() - 7000000),
      status: 'read'
    }
  ]
}

export function LeadsTab() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [conversationMode, setConversationMode] = useState<ConversationMode>('auto')
  const [draftMessage, setDraftMessage] = useState('')

  const filteredLeads = filter === 'all' 
    ? mockLeads 
    : mockLeads.filter(lead => lead.category === filter)

  const selectedLeadData = mockLeads.find(l => l.id === selectedLead)
  const conversation = selectedLead ? mockConversations[selectedLead] || [] : []

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
      "Hey ! J'ai remarqué que tu t'intéresses au fitness 💪 J'ai un programme spécial qui pourrait te plaire. Tu veux en savoir plus ?",
      "Salut ! Merci pour ton commentaire 🔥 Je propose un coaching perso adapté à tes objectifs. Ça t'intéresse ?",
      "Coucou ! Super de te voir actif sur mes posts ! J'ai justement des places qui se libèrent pour mon programme. On en parle ?",
    ]
    setDraftMessage(suggestions[Math.floor(Math.random() * suggestions.length)])
  }

  return (
    <div className="h-full flex gap-6">
      {/* Left Panel - Leads List */}
      <div className={`${selectedLead ? 'w-2/5' : 'w-full'} space-y-4 transition-all duration-300`}>
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'all' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}
          >
            Tous ({mockLeads.length})
          </Button>
          <Button
            onClick={() => setFilter('vip')}
            variant={filter === 'vip' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'vip' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}
          >
            🔥 VIP ({mockLeads.filter(l => l.category === 'vip').length})
          </Button>
          <Button
            onClick={() => setFilter('standard')}
            variant={filter === 'standard' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'standard' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}
          >
            Standard ({mockLeads.filter(l => l.category === 'standard').length})
          </Button>
          <Button
            onClick={() => setFilter('low')}
            variant={filter === 'low' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'low' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}
          >
            Low ({mockLeads.filter(l => l.category === 'low').length})
          </Button>
        </div>

        {/* Leads Cards */}
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
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {lead.username.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold truncate">@{lead.username}</span>
                      <Badge variant={getCategoryBadgeVariant(lead.category)} className="text-xs">
                        {lead.ai_score}/10
                      </Badge>
                    </div>
                    <p className="text-sm text-[#888] line-clamp-2 mb-2">{lead.comment}</p>
                    <div className="flex items-center gap-3 text-xs text-[#666]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                      <Badge variant={getStatusBadgeVariant(lead.status)} className="text-xs">
                        {lead.status === 'converted' ? '✅ Converti' : 
                         lead.status === 'replied' ? '💬 Répondu' :
                         lead.status === 'dm_sent' ? '📤 DM envoyé' : '👁️ Nouveau'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedLead(lead.id)
                  }}
                  className="bg-[rgba(255,92,0,0.1)] hover:bg-[rgba(255,92,0,0.2)] text-[#FF5C00] border border-[rgba(255,92,0,0.3)] flex-shrink-0"
                >
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
      </div>

      {/* Right Panel - Conversation */}
      {selectedLead && selectedLeadData && (
        <div className="w-3/5 flex flex-col h-[calc(100vh-200px)]">
          <Card className="flex-1 flex flex-col bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between bg-[rgba(255,92,0,0.05)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] flex items-center justify-center">
                  <span className="text-white font-bold">
                    {selectedLeadData.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">@{selectedLeadData.username}</h3>
                  <p className="text-xs text-[#888]">
                    Score IA: {selectedLeadData.ai_score}/10 • {selectedLeadData.category.toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedLead(null)}
                className="text-[#888] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-16 h-16 text-[#555] mb-4" />
                  <p className="text-[#888] mb-2">Aucun message pour l'instant</p>
                  <p className="text-sm text-[#666]">Envoie un message pour démarrer la conversation</p>
                </div>
              ) : (
                conversation.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'lead' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                        message.sender === 'lead'
                          ? 'bg-[rgba(255,255,255,0.05)] text-white'
                          : message.sender === 'ai'
                          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white'
                          : 'bg-gradient-to-r from-[#FF5C00] to-[#FF8A3D] text-white'
                      }`}
                    >
                      {message.sender === 'ai' && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold opacity-90">IA FitFlow</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className="flex items-center justify-end gap-2 mt-1.5">
                        <span className="text-[10px] opacity-60">
                          {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.status && message.sender !== 'lead' && (
                          <span className="text-[10px] opacity-60">
                            {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓' : '⏳'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Control Mode Toggle */}
            <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.07)] bg-[rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-[#888]">Mode de réponse:</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setConversationMode('auto')}
                    className={conversationMode === 'auto' 
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white'
                      : 'bg-[rgba(255,255,255,0.05)] text-[#888] hover:text-white'
                    }
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    IA Auto
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setConversationMode('manual')}
                    className={conversationMode === 'manual'
                      ? 'bg-[#FF5C00] text-white'
                      : 'bg-[rgba(255,255,255,0.05)] text-[#888] hover:text-white'
                    }
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Manuel
                  </Button>
                </div>
              </div>

              {conversationMode === 'auto' && (
                <div className="bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-purple-300 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">Mode automatique activé</span>
                  </div>
                  <p className="text-xs text-purple-200/70">
                    L'IA répond automatiquement aux nouveaux messages en fonction du score du lead.
                  </p>
                </div>
              )}

              {conversationMode === 'manual' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={generateAISuggestion}
                      className="bg-[rgba(139,92,246,0.1)] hover:bg-[rgba(139,92,246,0.2)] text-purple-300 border border-[rgba(139,92,246,0.3)] flex-shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      Suggestion IA
                    </Button>
                    {draftMessage && (
                      <Button
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(draftMessage)}
                        className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#888] hover:text-white flex-shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Copier
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={draftMessage}
                      onChange={(e) => setDraftMessage(e.target.value)}
                      placeholder="Écris ton message ou génère une suggestion IA..."
                      className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white placeholder-[#666] focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] text-sm"
                    />
                    <Button
                      size="sm"
                      disabled={!draftMessage}
                      className="bg-[#FF5C00] hover:bg-[#FF7A2D] text-white disabled:opacity-50 disabled:cursor-not-allowed px-6"
                    >
                      <Send className="w-4 h-4 mr-1.5" />
                      Envoyer
                    </Button>
                  </div>
                  
                  {draftMessage && (
                    <p className="text-xs text-[#666] flex items-center gap-1.5">
                      💡 <span>Tu peux modifier le message avant de l'envoyer</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
