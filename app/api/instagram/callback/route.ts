'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { APP_CONFIG, INSTAGRAM_CONFIG } from '@/lib/config'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state') // user_id
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const baseUrl = APP_CONFIG.APP_URL

  // Erreur côté Facebook
  if (error) {
    console.error('❌ Facebook OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${baseUrl}/settings?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/settings?error=missing_code`)
  }

  try {
    const redirectUri = APP_CONFIG.callbacks.instagram()

    // 1. Échanger le code contre un access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
      `client_id=${INSTAGRAM_CONFIG.APP_ID}` +
      `&client_secret=${INSTAGRAM_CONFIG.APP_SECRET}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code=${code}`
    )

    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      console.error('❌ Token exchange error:', tokenData.error)
      return NextResponse.redirect(
        `${baseUrl}/settings?error=${encodeURIComponent(tokenData.error.message)}`
      )
    }

    const accessToken = tokenData.access_token

    // 2. Récupérer les pages Facebook de l'utilisateur
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`
    )
    const pagesData = await pagesRes.json()

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(
        `${baseUrl}/settings?error=no_facebook_page`
      )
    }

    // Prendre la première page
    const page = pagesData.data[0]
    const pageAccessToken = page.access_token
    const pageId = page.id

    // 3. Récupérer le compte Instagram Business lié à la page
    const igRes = await fetch(
      `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    )
    const igData = await igRes.json()

    const instagramAccountId = igData.instagram_business_account?.id

    if (!instagramAccountId) {
      return NextResponse.redirect(
        `${baseUrl}/settings?error=no_instagram_business`
      )
    }

    // 4. Récupérer le username Instagram
    const igProfileRes = await fetch(
      `https://graph.facebook.com/v21.0/${instagramAccountId}?fields=username,profile_picture_url,followers_count&access_token=${pageAccessToken}`
    )
    const igProfile = await igProfileRes.json()

    const instagramUsername = igProfile.username || ''

    // 5. Sauvegarder dans Supabase coaches
    const supabase = await createClient()

    // Vérifier si le coach existe
    const { data: existingCoach } = await supabase
      .from('coaches')
      .select('id')
      .eq('user_id', state)
      .single()

    let dbError = null

    if (existingCoach) {
      const { error } = await supabase
        .from('coaches')
        .update({
          instagram_id: instagramAccountId,
          instagram_username: instagramUsername,
          facebook_page_id: pageId,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', state)
      dbError = error
    } else {
      // Récupérer l'email de l'utilisateur
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('coaches')
        .insert({
          user_id: state,
          email: user?.email || '',
          instagram_id: instagramAccountId,
          instagram_username: instagramUsername,
          facebook_page_id: pageId,
        })
      dbError = error
    }

    if (dbError) {
      console.error('❌ Supabase error:', dbError)
      return NextResponse.redirect(
        `${baseUrl}/settings?error=${encodeURIComponent(dbError.message)}`
      )
    }

    console.log(`✅ Instagram connecté : @${instagramUsername} (${instagramAccountId}) pour user ${state}`)

    // 6. Redirection vers settings avec succès
    return NextResponse.redirect(
      `${baseUrl}/settings?instagram=connected&username=${encodeURIComponent(instagramUsername)}`
    )

  } catch (err: any) {
    console.error('❌ Instagram callback error:', err)
    return NextResponse.redirect(
      `${baseUrl}/settings?error=${encodeURIComponent(err.message)}`
    )
  }
}
