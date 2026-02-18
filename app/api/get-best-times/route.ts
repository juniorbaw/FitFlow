import { NextResponse } from 'next/server'

export async function GET() {
  // Dans une vraie implémentation, on analyserait:
  // 1. Les posts passés du coach (via Instagram Graph API)
  // 2. L'engagement par heure de publication
  // 3. Les pics d'activité de l'audience
  
  // Pour le MVP, on retourne des horaires optimaux basés sur les stats Instagram 2024
  const bestTimes = [
    '08h-09h',
    '12h-13h', 
    '18h-20h',
    '21h-22h'
  ]

  return NextResponse.json({ times: bestTimes })
}
