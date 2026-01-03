import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { InstagramService } from '@/lib/instagram'

/**
 * Envoie un message direct Instagram
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse le body
    const body = await request.json()
    const { recipientId, message } = body

    if (!recipientId || !message) {
      return NextResponse.json(
        { error: 'Missing recipientId or message' },
        { status: 400 }
      )
    }

    // 2. Vérifie l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // 3. Récupère le token Instagram
    const { data: igAccount, error: igError } = await supabase
      .from('instagram_accounts')
      .select('access_token, token_expires_at')
      .eq('user_id', user.id)
      .single()

    if (igError || !igAccount) {
      return NextResponse.json(
        { error: 'Instagram not connected' },
        { status: 404 }
      )
    }

    // 4. Vérifie le token
    if (new Date(igAccount.token_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Instagram token expired' },
        { status: 401 }
      )
    }

    // 5. Envoie le DM
    const instagram = new InstagramService(igAccount.access_token)
    const result = await instagram.sendDirectMessage(recipientId, message)

    // 6. Log le message envoyé dans Supabase (optionnel, pour tracking)
    await supabase
      .from('instagram_messages')
      .insert({
        user_id: user.id,
        recipient_id: recipientId,
        message,
        sent_at: new Date().toISOString()
      })

    return NextResponse.json({ success: true, result })

  } catch (error) {
    console.error('Error sending Instagram DM:', error)
    return NextResponse.json(
      { error: 'Failed to send DM' },
      { status: 500 }
    )
  }
}
