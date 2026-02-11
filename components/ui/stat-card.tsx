import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  change?: number
  changeLabel?: string
}

export function StatCard({ label, value, icon: Icon, change, changeLabel }: StatCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)]">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-[#888]">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <span className={isPositive ? 'text-[#00D26A]' : isNegative ? 'text-[#FF4D4D]' : 'text-[#888]'}>
                {isPositive && '↗'} {isNegative && '↘'} {change > 0 && '+'}{change}%
              </span>
              {changeLabel && <span className="text-[#555]">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-[rgba(255,92,0,0.15)]">
          <Icon className="w-6 h-6 text-[#FF5C00]" />
        </div>
      </div>
    </Card>
  )
}
