'use client'

import { useState } from 'react'
import { Bot, Zap, MessageSquare, Settings, TrendingUp, CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ORANGE = '#FF5C00'
const GREEN = '#00D26A'
const BLUE = '#3B82F6'

export function AutoDMTab() {
  const [dmEnabled, setDmEnabled] = useState(true)
  const [dailyLimit, setDailyLimit] = useState(50)

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="p-8 bg-gradient-to-br from-[rgba(255,92,0,0.1)] to-[rgba(255,138,61,0.05)] border-[rgba(255,92,0,0.2)]">
        <div className="flex items-start gap-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] shadow-lg">
            <Bot className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-3">Auto-DM avec ManyChat IA</h2>
            <p className="text-[#aaa] text-lg mb-4">
              Automatisez vos messages privés Instagram avec l'intelligence artificielle de ManyChat. 
              Répondez instantanément aux leads qualifiés (score ≥ 7/10) et convertissez-les en clients.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(0,210,106,0.15)]">
                <CheckCircle2 className="w-5 h-5 text-[#00D26A]" />
                <span className="text-[#00D26A] font-semibold">Système d'automatisation inclus</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#888]">DMs envoyés aujourd'hui</h3>
            <MessageSquare className="w-5 h-5 text-[#FF5C00]" />
          </div>
          <p className="text-4xl font-bold text-white mb-2">0</p>
          <p className="text-sm text-[#666]">sur {dailyLimit} limite quotidienne</p>
        </Card>

        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#888]">Taux de réponse</h3>
            <TrendingUp className="w-5 h-5 text-[#00D26A]" />
          </div>
          <p className="text-4xl font-bold text-white mb-2">—</p>
          <p className="text-sm text-[#666]">Pas encore de données</p>
        </Card>

        <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#888]">Conversions via Auto-DM</h3>
            <Zap className="w-5 h-5 text-[#FFB800]" />
          </div>
          <p className="text-4xl font-bold text-white mb-2">0</p>
          <p className="text-sm text-[#666]">0% du total</p>
        </Card>
      </div>

      {/* Configuration Section */}
      <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-[#FF5C00]" />
          <h3 className="text-xl font-bold text-white">Configuration Auto-DM</h3>
        </div>

        <div className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
            <div>
              <p className="font-semibold text-white mb-1">Activer les Auto-DMs</p>
              <p className="text-sm text-[#888]">Envoyer automatiquement des DMs aux leads qualifiés</p>
            </div>
            <button
              onClick={() => setDmEnabled(!dmEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                dmEnabled ? 'bg-[#00D26A]' : 'bg-[#333]'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  dmEnabled ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Daily Limit */}
          <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
            <label className="block font-semibold text-white mb-2">Limite quotidienne de DMs</label>
            <p className="text-sm text-[#888] mb-3">
              Pour éviter d'être bloqué par Instagram (recommandé : 50-100/jour)
            </p>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white"
              min="1"
              max="200"
            />
          </div>

          {/* Score Minimum */}
          <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
            <label className="block font-semibold text-white mb-2">Score minimum pour DM automatique</label>
            <p className="text-sm text-[#888] mb-3">
              Seuls les leads avec un score ≥ à cette valeur recevront un DM
            </p>
            <select className="w-full px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white">
              <option value="7">7/10 - Standard et VIP</option>
              <option value="9">9/10 - VIP uniquement</option>
              <option value="5">5/10 - Tous les leads</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Setup Guide */}
      <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
        <h3 className="text-xl font-bold text-white mb-4">🚀 Activation en 3 étapes</h3>
        
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF5C00] flex items-center justify-center text-white font-bold">1</div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-2">Connecter ManyChat à votre Instagram</h4>
              <p className="text-sm text-[#aaa] mb-3">
                Allez sur ManyChat.com → Connectez votre compte Instagram Business
              </p>
              <Button
                onClick={() => window.open('https://manychat.com', '_blank')}
                className="bg-[rgba(59,130,246,0.15)] hover:bg-[rgba(59,130,246,0.25)] text-[#3B82F6] border border-[rgba(59,130,246,0.3)]"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ouvrir ManyChat
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF5C00] flex items-center justify-center text-white font-bold">2</div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-2">Créer un Flow d'Auto-DM</h4>
              <p className="text-sm text-[#aaa] mb-3">
                Dans ManyChat → Automation → Créer un flow "Nouveau Lead FitFlow"
              </p>
              <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
                <p className="text-sm text-white font-mono mb-2">Exemple de message :</p>
                <p className="text-sm text-[#aaa]">
                  "Salut ! J'ai vu ton commentaire 💪 Tu cherches à transformer ton physique ? 
                  J'ai créé un programme sur-mesure qui pourrait t'intéresser. Réserve un appel gratuit ici : [LIEN_CALENDLY]"
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF5C00] flex items-center justify-center text-white font-bold">3</div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-2">Connecter le Webhook FitFlow</h4>
              <p className="text-sm text-[#aaa] mb-3">
                Copiez cette URL webhook dans ManyChat → Settings → Integrations → Webhooks
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="https://fit-flow-gamma.vercel.app/api/webhooks/manychat"
                  readOnly
                  className="flex-1 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white font-mono text-sm"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText('https://fit-flow-gamma.vercel.app/api/webhooks/manychat')
                    alert('URL copiée !')
                  }}
                  className="bg-[rgba(255,92,0,0.15)] hover:bg-[rgba(255,92,0,0.25)] text-[#FF5C00] border border-[rgba(255,92,0,0.3)]"
                >
                  Copier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Info Box */}
      <Card className="p-6 bg-[rgba(59,130,246,0.05)] border-[rgba(59,130,246,0.2)]">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[rgba(59,130,246,0.2)]">
            <Zap className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">💡 Comment ça fonctionne ?</h4>
            <ul className="space-y-2 text-sm text-[#aaa]">
              <li>✅ Pas de limite d'envoi (contrairement à l'API Instagram directe)</li>
              <li>✅ Intelligence artificielle pour personnaliser les messages</li>
              <li>✅ Gestion automatique des réponses et du suivi</li>
              <li>✅ Analytics détaillés (taux d'ouverture, réponses, conversions)</li>
              <li>✅ Intégration Calendly pour booking automatique</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
