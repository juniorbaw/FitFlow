import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { content, scheduledTime } = await request.json()
    
    if (!content || !scheduledTime) {
      return NextResponse.json({ error: 'Content et heure requis' }, { status: 400 })
    }

    // Analyser le contenu avec Gemini pour le score prédictif
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Analyse ce post Instagram et retourne un JSON avec ces champs uniquement:
{
  "score": <0-100>,
  "estimated_reach": "<ex: 2.5k-4k>"
}

Post:
"""
${content}
"""

Critères:
- Hashtags pertinents: +20 points
- CTA clair: +20 points
- Emojis (pas trop): +10 points
- Longueur optimale (100-200 car): +20 points
- Hook accrocheur: +30 points

Retourne UNIQUEMENT le JSON.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const analysis = JSON.parse(cleanText)

    const optimalTimes = ['18h-20h', '12h-13h', '08h-09h']
    const isOptimal = optimalTimes.some(t => scheduledTime.includes(t.split('-')[0].replace('h', '')))

    const scheduledPost = {
      id: Date.now().toString(),
      content,
      scheduled_time: scheduledTime,
      ai_score: analysis.score,
      optimal_time: isOptimal,
      estimated_reach: analysis.estimated_reach
    }

    // Dans une vraie implémentation, sauvegarder dans Supabase table "scheduled_posts"

    return NextResponse.json(scheduledPost)
  } catch (error: any) {
    console.error('Schedule error:', error)
    return NextResponse.json(
      { error: `Erreur: ${error.message}` },
      { status: 500 }
    )
  }
}
