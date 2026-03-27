import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?error=no_code', request.url)
      )
    }

    // Step 1: Exchange code for access token
    const tokenResponse = await fetch(
      'https://graph.facebook.com/v19.0/oauth/access_token',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    // Build the token URL with params
    const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token')
    tokenUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || process.env.INSTAGRAM_APP_ID || '')
    tokenUrl.searchParams.set('client_secret', process.env.FACEBOOK_APP_SECRET || process.env.INSTAGRAM_APP_SECRET || '')
    tokenUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app'}/api/auth/instagram/callback`)
    tokenUrl.searchParams.set('code', code)

    const tokenRes = await fetch(tokenUrl.toString())
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      console.error('Token exchange error:', tokenData.error)
      return NextResponse.redirect(
        new URL('/dashboard?error=token_exchange_failed', request.url)
      )
    }

    const accessToken = tokenData.access_token

    // Step 2: Get Facebook user info
    const fbUserRes = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${accessToken}`
    )
    const fbUser = await fbUserRes.json()

    // Step 3: Get Instagram Business Account
    // First get Facebook Pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`
    )
    const pagesData = await pagesRes.json()

    let instagramUserId = null
    let instagramUsername = null

    if (pagesData.data && pagesData.data.length > 0) {
      // Get Instagram account linked to the first page
      const pageId = pagesData.data[0].id
      const igRes = await fetch(
        `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
      )
      const igData = await igRes.json()

      if (igData.instagram_business_account) {
        instagramUserId = igData.instagram_business_account.id

        // Get Instagram username
        const igProfileRes = await fetch(
          `https://graph.facebook.com/v19.0/${instagramUserId}?fields=username,name,profile_picture_url&access_token=${accessToken}`
        )
        const igProfile = await igProfileRes.json()
        instagramUsername = igProfile.username
      }
    }

    // Step 4: Store in Supabase coaches table
    const { error: upsertError } = await supabase
      .from('coaches')
      .upsert(
        {
          facebook_id: fbUser.id,
          email: fbUser.email || null,
          name: fbUser.name || null,
          instagram_user_id: instagramUserId,
          instagram_username: instagramUsername,
          instagram_access_token: accessToken,
          instagram_connected: !!instagramUserId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'facebook_id' }
      )

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError)
      // Try insert if upsert fails (table might not have facebook_id as unique)
      await supabase.from('coaches').insert({
        facebook_id: fbUser.id,
        email: fbUser.email || null,
        name: fbUser.name || null,
        instagram_user_id: instagramUserId,
        instagram_username: instagramUsername,
        instagram_access_token: accessToken,
        instagram_connected: !!instagramUserId,
      })
    }

    // Step 5: Redirect to dashboard with success
    const redirectUrl = new URL('/dashboard', request.url)
    redirectUrl.searchParams.set('instagram', 'connected')
    if (instagramUsername) {
      redirectUrl.searchParams.set('ig_user', instagramUsername)
    }

    return NextResponse.redirect(redirectUrl)

  } catch (error: any) {
    console.error('Instagram OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/dashboard?error=callback_failed', request.url)
    )
  }
}
