import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Tu es un expert en marketing Instagram spécialisé dans le fitness coaching.

Analyse le post Instagram suivant et retourne un JSON valide (UNIQUEMENT du JSON, pas de markdown, pas de backticks) avec cette structure exacte :

{
  "score": <nombre entre 0 et 100>,
  "verdict": "<excellent|good|average|poor>",
  "strengths": ["<point fort 1>", "<point fort 2>"],
  "weaknesses": ["<point faible 1>", "<point faible 2>"],
  "suggestions": ["<suggestion concrète 1>", "<suggestion concrète 2>", "<suggestion concrète 3>"],
  "bestTimeToPost": "<créneau horaire recommandé>",
  "estimatedReach": "<estimation de portée>",
  "engagementPotential": "<high|medium|low>"
}

Règles de scoring STRICTES :
- 90-100 : Post exceptionnel avec hook puissant, storytelling, CTA clair, hashtags stratégiques, question ouverte
- 70-89 : Bon post avec la plupart des éléments clés présents
- 50-69 : Post moyen, manque plusieurs éléments importants (CTA, hashtags, hook)
- 30-49 : Post faible, contenu trop court ou générique
- 0-29 : Post très faible, quelques mots sans valeur, spam, ou incompréhensible

IMPORTANT :
- Un post de moins de 20 caractères = score maximum 25
- Un post sans CTA = -15 points
- Un post sans hashtags = -10 points
- Un post sans question/interaction = -10 points
- Un simple "salut" ou "bonjour" = score entre 5 et 15
- Sois HONNÊTE, ne donne PAS de score élevé par complaisance

Voici le post à analyser :
"""
${content}
"""

Retourne UNIQUEMENT le JSON, rien d'autre.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Nettoyer le JSON (enlever les backticks si Gemini en ajoute)
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const analysis = JSON.parse(cleanText)

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse. Vérifiez votre clé Gemini et réessayez.' },
      { status: 500 }
    )
  }
}
