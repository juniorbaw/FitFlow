'use client'

import { useState, useEffect } from 'react'
import { Bot, Zap, MessageSquare, Settings, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function AutoDMTab() {
  const [dmEnabled, setDmEnabled] = useState(true)
  const [minScore, setMinScore] = useState(7)
  const [dailyLimit, setDailyLimit] = useState(50)
  const [leads, setLeads] = useState<any[]>([])
  const [stats, setStats] = useState({ sent: 0, replied: 0, converted: 0 })

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('leads')
      .select('*')
      .in('status', ['dm_sent', 'replied', 'converted'])
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) {
      setLeads(data)
      setStats({
        sent: data.filter(l => ['dm_sent', 'replied', 'converted'].includes(l.status)).length,
        replied: data.filter(l => ['replied', 'converted'].includes(l.status)).length,
        converted: data.filter(l => l.status === 'converted').length,
      })
    }
  }

  const dmsSentToday = stats.sent
  const responseRate = stats.sent > 0 ? Math.round((stats.replied / stats.sent) * 100) : 0

  return (
    <div className="space-y-6">
      {/* SECTION 1: STATUT DU SYSTÈME */}
      <Card className="p-6 bg-gradient-to-br from-[rgba(255,92,0,0.1)] to-[rgba(255,138,61,0.05)] border-[rgba(255,92,0,0.2)] rounded-2xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D]">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Auto-DM Intelligent</h2>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${dmEnabled ? 'bg-[#00D26A]' : 'bg-red-500'} animate-pulse`}></div>
                <span className={`text-sm font-semibold ${dmEnabled ? 'text-[#00D26A]' : 'text-red-500'}`}>
                  {dmEnabled ? '🟢 Système actif' : '🔴 Instagram non connecté'}
                </span>
              </div>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={dmEnabled} 
              onChange={(e) => setDmEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#00D26A]"></div>
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">DMs envoyés aujourd'hui</div>
            <div className="text-3xl font-bold text-white">{dmsSentToday} <span className="text-gray-500 text-lg">/ {dailyLimit}</span></div>
          </div>
          <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Taux de réponse</div>
            <div className="text-3xl font-bold text-[#00D26A]">{responseRate}%</div>
          </div>
          <div className="bg-[rgba(255,255,255,0.05)] rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">Conversions ce mois</div>
            <div className="text-3xl font-bold text-[#3B82F6]">{stats.converted}</div>
          </div>
        </div>
      </Card>

      {/* SECTION 2: CONFIGURATION */}
      <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-[#FF5C00]" />
          <h3 className="text-xl font-bold text-white">Configuration</h3>
        </div>

        <div className="space-y-6">
          {/* Score minimum */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Score minimum pour Auto-DM
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>1</span>
              <span className="text-[#FF5C00] font-bold text-base">{minScore}/10</span>
              <span>10</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              → Seuls les leads avec un score ≥ {minScore} recevront un DM
            </p>
          </div>

          {/* Limite quotidienne */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Limite quotidienne
            </label>
            <input 
              type="number" 
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white"
            />
            <p className="text-xs text-gray-500 mt-2">
              → Recommandé : 50-100/jour pour éviter les restrictions Instagram
            </p>
          </div>

          {/* Message par défaut */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Message par défaut
            </label>
            <textarea 
              rows={4}
              defaultValue="Salut ! J'ai vu ton commentaire 💪 Tu cherches à transformer ton physique ? J'ai créé un programme sur-mesure qui pourrait t'intéresser. Discutons-en !"
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              → Ce message sera personnalisé par l'IA selon le commentaire du lead
            </p>
          </div>

          <Button className="w-full bg-gradient-to-r from-[#FF5C00] to-[#FF8A00] hover:opacity-90 text-white font-bold py-3">
            💾 Sauvegarder la configuration
          </Button>
        </div>
      </Card>

      {/* SECTION 3: HISTORIQUE DMS */}
      <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-[#FF5C00]" />
          <h3 className="text-xl font-bold text-white">Historique des DMs</h3>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Aucun DM envoyé pour l'instant
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.1)]">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-3">Lead</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-3">Score</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-3">Message</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-3">Statut</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-3">Heure</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-[rgba(255,255,255,0.05)]">
                    <td className="py-3 text-white font-semibold">@{lead.username}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full bg-[rgba(255,92,0,0.2)] text-[#FF5C00] text-xs font-bold">
                        {lead.ai_score}/10
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-400 max-w-xs truncate">
                      {lead.dm_content || "Salut ! J'ai vu ton com..."}
                    </td>
                    <td className="py-3">
                      {lead.status === 'converted' && <span className="text-[#00D26A]">✅ Converti</span>}
                      {lead.status === 'replied' && <span className="text-[#3B82F6]">💬 Répondu</span>}
                      {lead.status === 'dm_sent' && <span className="text-gray-400">⏳ En attente</span>}
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* SECTION 4: TEMPLATES */}
      <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-[#FF5C00]" />
          <h3 className="text-xl font-bold text-white">Templates de messages</h3>
        </div>

        <div className="space-y-4">
          {/* Template VIP */}
          <div className="p-4 bg-[rgba(255,92,0,0.1)] border border-[rgba(255,92,0,0.2)] rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-[#FF5C00] uppercase">Template VIP (Score 9-10)</span>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                ✏️ Modifier
              </Button>
            </div>
            <p className="text-white text-sm">
              "Salut <strong>{'{username}'}</strong> ! 🔥 J'ai lu ton commentaire et je sens que tu es vraiment motivé(e). 
              J'ai un programme qui pourrait te correspondre parfaitement. On en discute ?"
            </p>
          </div>

          {/* Template Standard */}
          <div className="p-4 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-[#3B82F6] uppercase">Template Standard (Score 7-8)</span>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                ✏️ Modifier
              </Button>
            </div>
            <p className="text-white text-sm">
              "Hey <strong>{'{username}'}</strong> ! 👋 Merci pour ton commentaire. 
              Si tu cherches à progresser, j'ai peut-être quelque chose pour toi. Ça t'intéresse ?"
            </p>
          </div>

          <p className="text-xs text-gray-500">
            💡 Les templates sont personnalisés automatiquement selon le score et le commentaire du lead.
          </p>
        </div>
      </Card>
    </div>
  )
}
