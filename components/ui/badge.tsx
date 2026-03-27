import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'orange' | 'green' | 'blue' | 'red' | 'yellow' | 'gray'
  className?: string
}

const variants = {
  orange: 'bg-[rgba(255,92,0,0.15)] text-[#FF5C00]',
  green: 'bg-[rgba(0,210,106,0.15)] text-[#00D26A]',
  blue: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]',
  red: 'bg-[rgba(255,77,77,0.15)] text-[#FF4D4D]',
  yellow: 'bg-[rgba(255,184,0,0.15)] text-[#FFB800]',
  gray: 'bg-[rgba(255,255,255,0.05)] text-[#888]',
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
