'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  change?: number
  changeLabel?: string
  delay?: number
  emptyText?: string
}

export function StatCard({ label, value, icon: Icon, change, changeLabel, delay = 0, emptyText }: StatCardProps) {
  const isPositive = change !== undefined && change > 0
  const isEmpty = value === 0 || value === '0' || value === '0/10' || value === '0€'
  const displayValue = isEmpty && emptyText ? emptyText : (isEmpty ? '—' : value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className="relative group"
    >
      {/* Glow effect on hover - WORLD CLASS */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF5C00] via-[#FF8A3D] to-[#FF5C00] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 animate-pulse"></div>
      
      {/* Main Card - Glassmorphism */}
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,92,0,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            <motion.div
              whileHover={{ rotate: [0, -15, 15, -15, 0], scale: 1.15 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#FF5C00] rounded-xl opacity-20 blur-md"></div>
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-[rgba(255,92,0,0.2)] to-[rgba(255,138,61,0.1)] border border-[rgba(255,92,0,0.3)]">
                <Icon className="w-5 h-5 text-[#FF5C00]" />
              </div>
            </motion.div>
          </div>
          
          {/* Value - Animated */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.15, ease: "easeOut" }}
            className="mb-3"
          >
            <div className={`text-4xl font-black ${isEmpty ? 'text-gray-600' : 'bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'}`}>
              {displayValue}
            </div>
            {isEmpty && emptyText && (
              <p className="text-xs text-gray-500 mt-1 font-normal">Connectez Instagram pour voir vos stats</p>
            )}
          </motion.div>
          
          {/* Change indicator */}
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: delay + 0.25 }}
              className="flex items-center gap-2"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                  isPositive
                    ? 'bg-[rgba(0,210,106,0.15)] border border-[rgba(0,210,106,0.3)]'
                    : 'bg-[rgba(255,61,61,0.15)] border border-[rgba(255,61,61,0.3)]'
                }`}
              >
                {isPositive ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-[#00D26A]" />
                    <span className="text-xs font-bold text-[#00D26A]">+{change}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-[#FF3D3D]" />
                    <span className="text-xs font-bold text-[#FF3D3D]">{change}%</span>
                  </>
                )}
              </motion.div>
              {changeLabel && (
                <span className="text-xs text-gray-500 font-medium">{changeLabel}</span>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
