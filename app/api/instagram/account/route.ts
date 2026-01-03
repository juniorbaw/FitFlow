import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { InstagramService } from '@/lib/instagram'

/**
 * Récupère les informations et statistiques du compte Instagram
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

    // 2. Récupère le token Instagram
    const { data: igAccount, error: igError } = await supabase
      .from('instagram_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (igError || !igAccount) {
      return NextResponse.json(
        { error: 'Instagram not connected' },
        { status: 404 }
      )
    }

    // 3. Vérifie le token
    if (new Date(igAccount.token_expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Instagram token expired' },
        { status: 401 }
      )
    }

    // 4. Récupère les infos du compte
    const instagram = new InstagramService(igAccount.access_token)
    const accountInfo = await instagram.getAccountInfo()

    // 5. Récupère les statistiques (optionnel, peut échouer selon les permissions)
    let insights = null
    try {
      insights = await instagram.getAccountInsights()
    } catch (error) {
      console.warn('Could not fetch insights:', error)
    }

    return NextResponse.json({
      account: accountInfo,
      insights,
      tokenExpiresAt: igAccount.token_expires_at
    })

  } catch (error) {
    console.error('Error fetching Instagram account:', error)
    return NextResponse.json(
      { error: 'Failed to fetch account info' },
      { status: 500 }
    )
  }
}
