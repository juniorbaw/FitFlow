import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface AnalysisResult {
  score: number;
  intent: string;
  reasoning: string;
  dm_suggested: string;
}

export async function POST(request: NextRequest) {
  try {
    const { comment_text, post_caption, instagram_username } = await request.json();

    if (!comment_text) {
      return NextResponse.json({ error: 'comment_text required' }, { status: 400 });
    }

    const prompt = `Tu es un expert en qualification de leads pour coachs fitness français.

Analyse ce commentaire Instagram et détermine si c'est un prospect potentiel.

Commentaire: "${comment_text}"
${post_caption ? `Contexte du post: "${post_caption}"` : ''}
${instagram_username ? `Username: @${instagram_username}` : ''}

Réponds UNIQUEMENT en JSON valide (pas de markdown, pas de \`\`\`):
{
  "score": [nombre entre 1 et 10],
  "intent": "[achat_imminent|interesse|curieux|spam|hors_sujet]",
  "reasoning": "[explication courte en français, max 100 caractères]",
  "dm_suggested": "[DM personnalisé en français, friendly et naturel, max 280 caractères]"
}

Critères de scoring:
- 9-10: Demande explicite de prix, programme, coaching, "combien ça coûte"
- 7-8: Questions sur les résultats, méthode, disponibilité
- 5-6: Compliments engagés, émojis enthousiastes multiples, questions générales
- 3-4: Compliments simples ("top!", "bravo"), émojis basiques
- 1-2: Spam, hors sujet, trolls, juste des émojis

Le DM suggéré doit:
- Commencer par saluer naturellement
- Remercier pour le commentaire
- Poser une question ouverte sur leurs objectifs
- Ne PAS être commercial directement
- Être chaleureux et authentique`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean and parse JSON
    const cleanJson = textResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const analysis: AnalysisResult = JSON.parse(cleanJson);

    return NextResponse.json({
      success: true,
      analysis: {
        score: Math.min(10, Math.max(1, analysis.score)),
        intent: analysis.intent,
        reasoning: analysis.reasoning,
        dm_suggested: analysis.dm_suggested,
      },
    });
  } catch (error: any) {
    console.error('Gemini analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    );
  }
}
