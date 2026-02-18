import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
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
    <Card className="p-6 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#888]">{label}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-2 text-sm font-semibold">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                isPositive ? 'bg-[rgba(0,210,106,0.1)] text-[#00D26A]' : 
                isNegative ? 'bg-[rgba(255,77,77,0.1)] text-[#FF4D4D]' : 
                'bg-[rgba(136,136,136,0.1)] text-[#888]'
              }`}>
                {isPositive && <TrendingUp className="w-3 h-3" />}
                {isNegative && <TrendingDown className="w-3 h-3" />}
                <span>{change > 0 && '+'}{change}%</span>
              </div>
              {changeLabel && <span className="text-[#666]">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-[rgba(255,92,0,0.15)] to-[rgba(255,138,61,0.15)] shadow-lg">
          <Icon className="w-6 h-6 text-[#FF5C00]" />
        </div>
      </div>
    </Card>
  )
}
