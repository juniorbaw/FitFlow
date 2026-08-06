'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] dark:bg-[rgba(255,255,255,0.1)] dark:hover:bg-[rgba(255,255,255,0.15)] transition-all flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </Button>
  )
}
