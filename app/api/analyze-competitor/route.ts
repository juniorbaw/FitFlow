import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()
    
    if (!username || username.trim().length === 0) {
      return NextResponse.json({ error: 'Username requis' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Note: Pour une vraie implémentation, il faudrait:
    // 1. Utiliser Instagram Graph API pour récupérer les données publiques
    // 2. Scraper le profil (attention aux limites légales)
    // 3. Analyser les derniers posts (likes, comments, hashtags)
    // Pour ce MVP, on demande à Gemini de faire une analyse théorique

    const prompt = `Tu es un expert en stratégie Instagram et analyse concurrentielle dans la niche fitness/coaching.

Analyse le compte Instagram @${username}

Retourne un JSON valide (UNIQUEMENT du JSON) avec cette structure exacte :

{
  "username": "${username}",
  "followers": <nombre estimé>,
  "engagement_rate": <pourcentage 0-20>,
  "avg_likes": <nombre>,
  "avg_comments": <nombre>,
  "posting_frequency": "<ex: 5-7 posts/semaine>",
  "best_posting_times": ["<ex: 18h-20h>", "<ex: 12h-14h>"],
  "top_hashtags": ["<hashtag 1>", "<hashtag 2>", ...],
  "content_themes": ["<thème 1>", "<thème 2>", ...],
  "strengths": ["<force 1>", "<force 2>", ...],
  "opportunities": ["<opportunité 1>", "<opportunité 2>", ...],
  "threat_level": "<high|medium|low>",
  "recommended_actions": ["<action 1>", "<action 2>", ...]
}

Règles :
- engagement_rate = ((avg_likes + avg_comments) / followers) * 100
- threat_level high si > 10k followers ET engagement > 5%
- threat_level medium si > 5k followers OU engagement > 3%
- threat_level low sinon
- strengths = ce qu'ils font bien (format, fréquence, engagement, etc.)
- opportunities = failles dans leur stratégie que tu peux exploiter
- recommended_actions = 3-5 actions concrètes pour les surpasser

Sois STRATÉGIQUE et ACTIONNABLE. Base-toi sur les meilleures pratiques Instagram 2024.

Retourne UNIQUEMENT le JSON.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const analysis = JSON.parse(cleanText)

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Competitor analysis error:', error)
    return NextResponse.json(
      { error: `Erreur: ${error.message || 'Erreur inconnue'}` },
      { status: 500 }
    )
  }
}
