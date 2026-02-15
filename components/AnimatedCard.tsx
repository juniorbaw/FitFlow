'use client'

import { ReactNode, CSSProperties } from 'react'

type CardVariant = 'glass' | 'neuro' | 'minimal' | 'default'

interface AnimatedCardProps {
  children: ReactNode
  variant?: CardVariant
  className?: string
  style?: CSSProperties
  hover?: boolean
  onClick?: () => void
}

export default function AnimatedCard({
  children,
  variant = 'default',
  className = '',
  style = {},
  hover = true,
  onClick
}: AnimatedCardProps) {
  
  const variantClasses = {
    glass: 'glass',
    neuro: 'neuro',
    minimal: 'border border-[var(--border)] bg-[var(--bg-card)]',
    default: 'bg-[var(--bg-card)] border border-[var(--border)]'
  }

  const hoverClasses = hover 
    ? 'hover:scale-[1.02] hover:shadow-2xl hover:border-[var(--orange)]/20 transition-all duration-300' 
    : ''

  const clickableClasses = onClick ? 'cursor-pointer' : ''

  return (
    <div
      className={`
        rounded-2xl p-6
        ${variantClasses[variant]}
        ${hoverClasses}
        ${clickableClasses}
        ${className}
      `}
      style={{
        transform: 'translateZ(0)', // Force GPU acceleration
        willChange: hover ? 'transform' : 'auto',
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
