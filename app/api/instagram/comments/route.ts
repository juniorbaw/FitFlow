import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { InstagramService } from '@/lib/instagram'

/**
 * Récupère les commentaires récents des posts Instagram
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Vérifie l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // 2. Récupère le token Instagram de l'utilisateur
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

    // 3. Vérifie si le token est expiré
    if (new Date(igAccount.token_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Instagram token expired' },
        { status: 401 }
      )
    }

    // 4. Récupère les commentaires
    const instagram = new InstagramService(igAccount.access_token)
    const comments = await instagram.getAllRecentComments(10)

    return NextResponse.json({ comments })

  } catch (error) {
    console.error('Error fetching Instagram comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
