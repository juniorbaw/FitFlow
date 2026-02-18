import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json()
    
    if (!videoUrl || !videoUrl.includes('instagram.com')) {
      return NextResponse.json({ error: 'URL Instagram valide requise' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Note: Pour une vraie implémentation, il faudrait:
    // 1. Télécharger la vidéo depuis Instagram (API Graph ou scraping)
    // 2. Extraire la caption + métadonnées
    // 3. Analyser les premières secondes (hook)
    // Pour ce MVP, on analyse juste l'URL et demande à Gemini de faire une analyse théorique

    const prompt = `Tu es un expert Instagram spécialisé dans l'analyse de Reels fitness/coaching.

Analyse cette URL de Reel : ${videoUrl}

Retourne un JSON valide (UNIQUEMENT du JSON, pas de markdown) avec cette structure exacte :

{
  "score": <nombre 0-100>,
  "verdict": "<excellent|good|average|poor>",
  "hook_quality": <nombre 0-100>,
  "storytelling": <nombre 0-100>,
  "cta_strength": <nombre 0-100>,
  "duration_optimal": <true|false>,
  "duration_current": "<durée ex: 45s>",
  "duration_recommended": "<durée ex: 30-60s>",
  "strengths": ["<point 1>", "<point 2>", ...],
  "weaknesses": ["<point 1>", "<point 2>", ...],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", ...],
  "viral_potential": "<high|medium|low>",
  "best_posting_time": "<créneau horaire>"
}

Règles d'analyse :
- Hook = 3 premières secondes (accroche visuelle/texte)
- Storytelling = narration, émotion, structure
- CTA = appel à l'action clair (commenter, partager, etc.)
- Durée optimale Reel = 30-60s (retention maximale)
- Score global = moyenne pondérée (hook 40%, storytelling 30%, CTA 30%)

Sois HONNÊTE et PRÉCIS. Base-toi sur les meilleures pratiques Instagram 2024.

Retourne UNIQUEMENT le JSON.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const analysis = JSON.parse(cleanText)

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Video analysis error:', error)
    return NextResponse.json(
      { error: `Erreur: ${error.message || 'Erreur inconnue'}` },
      { status: 500 }
    )
  }
}
