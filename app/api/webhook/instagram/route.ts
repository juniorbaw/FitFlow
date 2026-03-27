import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const VERIFY_TOKEN = 'fitflow_webhook_verify_token_2026_secure'

// GET - Vérification du webhook par Meta
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook vérifié avec succès')
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

// POST - Recevoir les événements Instagram
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    console.log('📥 Webhook Instagram reçu:', JSON.stringify(body, null, 2))

    // Vérifier que c'est bien un événement Instagram
    if (body.object !== 'instagram') {
      return NextResponse.json({ error: 'Not an Instagram event' }, { status: 400 })
    }

    const supabase = await createClient()

    // Traiter chaque entrée
    for (const entry of body.entry) {
      // Commentaires
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.field === 'comments') {
            await handleComment(change.value, supabase)
          }
          if (change.field === 'mentions') {
            await handleMention(change.value, supabase)
          }
        }
      }

      // Messages directs
      if (entry.messaging) {
        for (const message of entry.messaging) {
          await handleMessage(message, supabase)
        }
      }
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('❌ Erreur webhook Instagram:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Gérer un nouveau commentaire
async function handleComment(data: any, supabase: any) {
  console.log('💬 Nouveau commentaire détecté')
  
  // Trouver le coach via l'instagram_id
  const { data: coach } = await supabase
    .from('coaches')
    .select('id, instagram_id')
    .eq('instagram_id', data.media_id)
    .single()

  if (!coach) {
    console.log('⚠️ Coach non trouvé pour ce post')
    return
  }

  // Validation: skip leads with empty username
  const instagramUsername = data.from?.username || ''
  if (!instagramUsername.trim()) {
    console.log('⚠️ Lead ignoré: username vide')
    return
  }

  // Créer un lead
  const { error } = await supabase
    .from('leads')
    .insert({
      coach_id: coach.id,
      instagram_username: instagramUsername,
      instagram_user_id: data.from?.id || '',
      comment_text: data.text || '',
      post_url: `https://instagram.com/p/${data.media?.id}`,
      source: 'instagram_comment',
      status: 'new',
      metadata: {
        comment_id: data.id,
        media_id: data.media_id,
        timestamp: data.timestamp,
      },
    })

  if (error) {
    console.error('Erreur création lead:', error)
  } else {
    console.log('✅ Lead créé avec succès')
    
    // TODO: Envoyer au webhook Make.com pour scoring IA
    // await fetch('VOTRE_WEBHOOK_MAKE_COM', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     username: data.from?.username,
    //     comment: data.text,
    //     coach_id: coach.id,
    //   })
    // })
  }
}

// Gérer une mention
async function handleMention(data: any, supabase: any) {
  console.log('📢 Nouvelle mention détectée')
  // TODO: Implémenter la logique des mentions
}

// Gérer un message direct
async function handleMessage(data: any, supabase: any) {
  console.log('💌 Nouveau message direct')
  // TODO: Implémenter la logique des DMs
}
