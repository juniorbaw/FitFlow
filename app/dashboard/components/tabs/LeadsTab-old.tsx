'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockLeads } from '@/lib/mock-data'
import { CheckCircle2 } from 'lucide-react'

type FilterType = 'all' | 'vip' | 'standard' | 'low'

export function LeadsTab() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredLeads = filter === 'all' 
    ? mockLeads 
    : mockLeads.filter(lead => lead.category === filter)

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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}
        >
          Tous ({mockLeads.length})
        </Button>
        <Button
          onClick={() => setFilter('vip')}
          variant={filter === 'vip' ? 'default' : 'outline'}
          className={filter === 'vip' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}
        >
          VIP ({mockLeads.filter(l => l.category === 'vip').length})
        </Button>
        <Button
          onClick={() => setFilter('standard')}
          variant={filter === 'standard' ? 'default' : 'outline'}
          className={filter === 'standard' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}
        >
          Standard ({mockLeads.filter(l => l.category === 'standard').length})
        </Button>
        <Button
          onClick={() => setFilter('low')}
          variant={filter === 'low' ? 'default' : 'outline'}
          className={filter === 'low' ? 'bg-[#FF5C00] hover:bg-[#FF7A2D]' : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]'}
        >
          Low ({mockLeads.filter(l => l.category === 'low').length})
        </Button>
      </div>

      {/* Leads Table */}
      <Card className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                <th className="text-left p-4 text-sm font-semibold text-[#888]">Username</th>
                <th className="text-left p-4 text-sm font-semibold text-[#888]">Commentaire</th>
                <th className="text-left p-4 text-sm font-semibold text-[#888]">Score</th>
                <th className="text-left p-4 text-sm font-semibold text-[#888]">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-[#888]">Temps</th>
                <th className="text-left p-4 text-sm font-semibold text-[#888]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,92,0,0.05)] transition-colors cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {lead.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white font-medium">@{lead.username}</span>
                    </div>
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="text-sm text-[#888] line-clamp-2">{lead.comment}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant={getCategoryBadgeVariant(lead.category)}>
                      {lead.ai_score}/10
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={getStatusBadgeVariant(lead.status)}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-[#555]">
                    {new Date(lead.created_at).toLocaleString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="p-4">
                    {lead.status !== 'converted' && (
                      <Button
                        size="sm"
                        className="bg-[#00D26A] hover:bg-[#00B85C] text-white"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Converti
                      </Button>
                    )}
                    {lead.status === 'converted' && lead.revenue && (
                      <span className="text-sm font-semibold text-[#00D26A]">
                        {lead.revenue}€
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
