import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Meta appelle cette route quand un utilisateur révoque l'accès à l'app
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Meta envoie le user_id qui a révoqué l'accès
    const userId = body.user_id
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    const supabase = await createClient()

    // Supprimer le token d'accès Instagram du coach
    const { error } = await supabase
      .from('coaches')
      .update({
        access_token: null,
        instagram_id: null,
        instagram_username: null,
      })
      .eq('instagram_id', userId)

    if (error) {
      console.error('Error deauthorizing user:', error)
    }

    console.log(`✅ User ${userId} deauthorized successfully`)

    return NextResponse.json({ 
      success: true,
      message: 'User deauthorized successfully' 
    })

  } catch (error: any) {
    console.error('Deauthorize error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// GET pour afficher une confirmation à l'utilisateur (optionnel)
export async function GET() {
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Autorisation révoquée - FitFlow</title>
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
            max-width: 500px;
            text-align: center;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 40px;
          }
          h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 16px;
          }
          p {
            color: #999;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          a {
            display: inline-block;
            padding: 12px 24px;
            background: #FF5C00;
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Autorisation révoquée</h1>
          <p>
            Vous avez révoqué l'accès de FitFlow à votre compte Instagram. 
            Vos données ont été supprimées de nos serveurs.
          </p>
          <p>
            Vous pouvez vous reconnecter à tout moment.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app'}">Retour à l'accueil</a>
        </div>
      </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  )
}
