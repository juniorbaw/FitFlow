'use client'

import { Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  return (
    <div className="h-16 border-b border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Date range selector */}
        <Button
          variant="outline"
          className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.05)]"
        >
          <Calendar className="w-4 h-4 mr-2" />
          7 derniers jours
        </Button>

        {/* User avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#FF8A3D] flex items-center justify-center cursor-pointer">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  )
}
