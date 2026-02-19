import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const prompt = `Tu es un expert marketing Instagram fitness.
Analyse ce post et retourne UNIQUEMENT un JSON valide (pas de markdown) :
{
  "score": <0-100>,
  "verdict": "<excellent|good|average|poor>",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."],
  "bestTimeToPost": "<créneau>",
  "estimatedReach": "<estimation>",
  "engagementPotential": "<high|medium|low>"
}
Sois HONNÊTE. Un post court/vide/SMS = score bas.
Post à analyser : """${content}"""`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      return NextResponse.json({ error: 'Erreur API Gemini' }, { status: 500 })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    return NextResponse.json(JSON.parse(cleanedText))
  } catch (error: any) {
    console.error('Analyze content error:', error)
    return NextResponse.json({ error: 'Erreur analyse' }, { status: 500 })
  }
}
