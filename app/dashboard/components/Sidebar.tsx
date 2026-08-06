'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, DollarSign, Settings, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const navigation = [
  { name: 'Vue d\'ensemble', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'Posts', href: '/dashboard/posts', icon: FileText },
  { name: 'Revenue', href: '/dashboard/revenue', icon: DollarSign },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-[rgba(255,255,255,0.02)] border-r border-[rgba(255,255,255,0.07)] h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[rgba(255,255,255,0.07)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-white font-bold text-xl">FitFlow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                isActive
                  ? 'bg-[rgba(255,92,0,0.15)] text-[#FF5C00]'
                  : 'text-[#888] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Status Badge */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.07)] space-y-4">
        <div className="p-4 rounded-xl bg-[rgba(0,210,106,0.1)] border border-[rgba(0,210,106,0.2)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00D26A] animate-pulse" />
            <span className="text-sm font-semibold text-[#00D26A]">Système actif</span>
          </div>
          <p className="text-xs text-[#888]">Monitoring des commentaires Instagram</p>
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#888] hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Paramètres</span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm text-[#888] hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au site</span>
        </Link>
      </div>
    </div>
  )
}
