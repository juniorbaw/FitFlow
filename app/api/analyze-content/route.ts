import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Vérifier que la clé API existe
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set')
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Tu es un expert en marketing Instagram spécialisé dans le fitness coaching.

Analyse le post Instagram suivant et retourne un JSON valide (UNIQUEMENT du JSON, pas de markdown, pas de backticks) avec cette structure exacte :

{
  "score": <nombre entre 0 et 100>,
  "verdict": "<excellent|good|average|poor>",
  "strengths": ["<point fort 1>", "<point fort 2>", ...],
  "weaknesses": ["<point faible 1>", "<point faible 2>", ...],
  "suggestions": ["<suggestion concrète 1>", "<suggestion concrète 2>", ...],
  "bestTimeToPost": "<créneau horaire recommandé>",
  "estimatedReach": "<estimation de portée>",
  "engagementPotential": "<high|medium|low>"
}

Règles de scoring :
- 90-100 : Post exceptionnel, viral potential, CTA parfait, hashtags stratégiques
- 70-89 : Bon post avec quelques optimisations possibles
- 50-69 : Post moyen, manque d'éléments clés (CTA, hashtags, hook)
- 0-49 : Post faible, besoin d'une refonte complète

Sois HONNÊTE et PRÉCIS. Un post vide ou très court (< 20 caractères) doit avoir un score bas.
Un post sans CTA, sans question, sans hashtags doit être pénalisé.
Un post en langage SMS ou incompréhensible doit avoir un score très bas.

Voici le post à analyser :
"""
${content}
"""

Retourne UNIQUEMENT le JSON, rien d'autre.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    // Parse le JSON (enlever les backticks si Gemini en ajoute)
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const analysis = JSON.parse(cleanText)

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Gemini API error:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json(
      { error: `Erreur: ${error.message || 'Erreur inconnue'}` },
      { status: 500 }
    )
  }
}
