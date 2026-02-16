import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyse ce post Instagram pour un coach fitness et donne un feedback structuré en JSON avec exactement ces champs:
{
  "score": <nombre entre 0-100 basé sur la qualité>,
  "category": "<catégorie du post: Motivation, Transformation, Conseils, Workout, ou Lifestyle>",
  "suggestions": [<3 suggestions concrètes pour améliorer le post>],
  "bestTime": "<meilleur moment pour poster basé sur le contenu (format: HHh-HHh)>",
  "hashtags": "<5-10 hashtags pertinents séparés par des espaces>"
}

Post à analyser:
"${text}"

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`
            }]
          }]
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error')
    }

    // Extract JSON from Gemini response
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!textResponse) {
      throw new Error('No response from Gemini')
    }

    // Parse JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    if (!analysis) {
      throw new Error('Invalid response format from Gemini')
    }

    return NextResponse.json({ analysis })

  } catch (error: any) {
    console.error('Content analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}
