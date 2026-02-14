import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Meta appelle cette route quand un utilisateur demande la suppression de ses données
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Meta envoie le user_id
    const userId = body.user_id
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    const supabase = await createClient()

    // Supprimer toutes les données du coach
    // 1. Supprimer les leads
    await supabase
      .from('leads')
      .delete()
      .eq('instagram_user_id', userId)

    // 2. Supprimer les stats
    const { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .eq('instagram_id', userId)
      .single()

    if (coach) {
      await supabase
        .from('daily_stats')
        .delete()
        .eq('coach_id', coach.id)

      await supabase
        .from('posts')
        .delete()
        .eq('coach_id', coach.id)

      // 3. Supprimer le profil coach
      await supabase
        .from('coaches')
        .delete()
        .eq('id', coach.id)
    }

    console.log(`✅ Data deleted for user ${userId}`)

    // Générer un code de confirmation unique
    const confirmationCode = `${userId}_${Date.now()}_deleted`

    return NextResponse.json({
      url: `https://fit-flow-gamma.vercel.app/api/auth/deletion?id=${confirmationCode}`,
      confirmation_code: confirmationCode,
    })

  } catch (error: any) {
    console.error('Data deletion error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// GET pour afficher la confirmation de suppression
export async function GET(req: NextRequest) {
  const confirmationCode = req.nextUrl.searchParams.get('id')

  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Données supprimées - FitFlow</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'DM Sans', sans-serif;
            background: #0a0a0a;
            color: #fafafa;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            text-align: center;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 40px;
          }
          h1 {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 16px;
            color: #FF5C00;
          }
          p {
            color: #999;
            line-height: 1.6;
            margin-bottom: 16px;
          }
          .code {
            background: rgba(255,255,255,0.05);
            padding: 12px 16px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            color: #666;
            margin: 24px 0;
            word-break: break-all;
          }
          .info {
            background: rgba(0,210,106,0.1);
            border: 1px solid rgba(0,210,106,0.3);
            border-radius: 12px;
            padding: 16px;
            margin: 24px 0;
            text-align: left;
            color: #00D26A;
            font-size: 14px;
          }
          a {
            display: inline-block;
            padding: 12px 24px;
            background: #FF5C00;
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Données supprimées</h1>
          <p>
            Vos données ont été supprimées de FitFlow conformément au RGPD et aux 
            politiques de confidentialité de Meta.
          </p>
          
          <div class="info">
            <strong>📋 Données supprimées :</strong><br>
            • Profil coach<br>
            • Tous les leads détectés<br>
            • Statistiques et analytics<br>
            • Token d'accès Instagram<br>
            • Informations de compte
          </div>

          ${confirmationCode ? `
            <p style="font-size: 14px; color: #666;">
              Code de confirmation :
            </p>
            <div class="code">${confirmationCode}</div>
            <p style="font-size: 12px; color: #555;">
              Conservez ce code comme preuve de suppression de vos données.
            </p>
          ` : ''}

          <p style="margin-top: 32px;">
            Merci d'avoir utilisé FitFlow. Vous pouvez vous réinscrire à tout moment.
          </p>
          
          <a href="https://fit-flow-gamma.vercel.app">Retour à l'accueil</a>
        </div>
      </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    }
  )
}
