'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const formData = await req.formData()
    const mode = formData.get('mode') as string // 'script' | 'url' | 'upload'
    const content = formData.get('content') as string // script text or url
    const file = formData.get('file') as File | null

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Clé API Gemini manquante' }, { status: 500 })
    }

    let prompt = ''

    if (mode === 'script' || mode === 'url') {
      prompt = `Tu es un expert en marketing Instagram et en création de contenu fitness viral.
      
Analyse ce contenu Instagram/Reel pour un coach fitness :

${mode === 'url' ? `URL du Reel : ${content}` : `Idée/Script du Reel : ${content}`}

Donne une analyse COMPLÈTE et PRÉCISE au format JSON exact suivant (sans markdown, juste le JSON) :

{
  "viralScore": <score de 0 à 100>,
  "verdict": "<excellent|good|average|poor>",
  "duration": "<durée estimée>",
  "estimatedViews": "<fourchette de vues ex: 10K - 30K>",
  "estimatedLikes": "<fourchette de likes>",
  "bestPostTime": "<meilleur créneau de publication>",
  "hookAnalysis": {
    "score": <score 0-100>,
    "firstThreeSeconds": "<description du hook>",
    "retention": "<analyse de la rétention>",
    "suggestions": ["<conseil 1>", "<conseil 2>", "<conseil 3>"]
  },
  "contentAnalysis": {
    "score": <score 0-100>,
    "pacing": "<analyse du rythme>",
    "storytelling": "<analyse de la structure narrative>",
    "suggestions": ["<conseil 1>", "<conseil 2>", "<conseil 3>"]
  },
  "audioAnalysis": {
    "score": <score 0-100>,
    "hasMusic": <true|false>,
    "hasVoiceover": <true|false>,
    "musicEnergy": "<analyse de l'énergie musicale>",
    "suggestion": "<conseil audio>"
  },
  "captionSuggestions": [
    {
      "style": "Storytelling",
      "caption": "<caption complète avec emojis et hashtags>",
      "score": <score 0-100>
    },
    {
      "style": "Éducatif",
      "caption": "<caption complète avec emojis et hashtags>",
      "score": <score 0-100>
    },
    {
      "style": "Provocateur",
      "caption": "<caption complète avec emojis et hashtags>",
      "score": <score 0-100>
    }
  ],
  "hashtags": {
    "highReach": ["<10 hashtags high reach>"],
    "mediumReach": ["<10 hashtags medium reach>"],
    "niche": ["<10 hashtags niche>"],
    "recommended": "<conseil sur la combinaison de hashtags>"
  },
  "competitorBenchmark": {
    "avgViralScore": <score moyen dans la niche fitness>,
    "yourPosition": "<Top X%>",
    "topPerformers": "<description de ce qui marche dans la niche>"
  }
}

Sois précis, concret et orienté résultats. Adapte les conseils à la niche FITNESS/COACHING spécifiquement.`
    }

    // Appel à l'API Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          }
        })
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini error:', err)
      return NextResponse.json({ error: 'Erreur API Gemini' }, { status: 500 })
    }

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Nettoyer le JSON (enlever les backticks markdown si présents)
    const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let result
    try {
      result = JSON.parse(cleanJson)
    } catch (e) {
      console.error('JSON parse error:', e, 'Raw:', cleanJson.substring(0, 500))
      return NextResponse.json({ error: 'Erreur parsing réponse IA' }, { status: 500 })
    }

    return NextResponse.json({ success: true, result })

  } catch (error) {
    console.error('Analyze video error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
