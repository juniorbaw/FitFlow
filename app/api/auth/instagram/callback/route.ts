import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyState } from '../route'

const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      console.error('No authorization code received')
      return NextResponse.redirect(new URL('/settings?error=no_code', APP_URL))
    }

    // Verify state and get userId
    const userId = verifyState(state || '')
    if (!userId) {
      console.error('Invalid or missing state')
      return NextResponse.redirect(new URL('/settings?error=invalid_state', APP_URL))
    }

    const userId2 = userId

    // Exchange code for access token
    console.log(`🔄 Exchanging code for access token...`)
    const tokenResponse = await fetch('https://graph.instagram.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID!,
        client_secret: INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${APP_URL}/api/auth/instagram/callback`,
        code
      }).toString()
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error('❌ Token exchange error:', tokenData.error)
      return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(tokenData.error.message)}`, APP_URL))
    }

    const { access_token, user_id: instagram_user_id } = tokenData
    console.log(`✅ Token received for Instagram ID: ${instagram_user_id}`)

    // Create Supabase client with service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get Instagram account info
    console.log(`📱 Fetching Instagram account info...`)
    const accountResponse = await fetch(
      `https://graph.instagram.com/v18.0/me?fields=id,username,name,biography,profile_picture_url,followers_count,media_count&access_token=${access_token}`
    )

    const accountData = await accountResponse.json()

    if (accountData.error) {
      console.error('❌ Instagram account info error:', accountData.error)
      return NextResponse.redirect(new URL('/settings?error=instagram_error', APP_URL))
    }

    console.log(`✅ Instagram account retrieved: @${accountData.username}`)

    // Save to Supabase
    console.log(`💾 Saving to database...`)
    const { error: saveError, data } = await supabase
      .from('instagram_accounts')
      .upsert(
        {
          user_id: userId2,
          instagram_user_id: accountData.id,
          username: accountData.username,
          access_token,
          token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
          followers_count: accountData.followers_count,
          media_count: accountData.media_count,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'user_id'
        }
      )
      .select()

    if (saveError) {
      console.error('❌ Database save error:', saveError)
      return NextResponse.redirect(new URL('/settings?error=save_failed', APP_URL))
    }

    console.log(`✅ Instagram account saved successfully!`)
    return NextResponse.redirect(new URL('/settings?success=instagram_connected', APP_URL))

  } catch (error: any) {
    console.error('❌ OAuth callback error:', error)
    return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(error.message)}`, APP_URL))
  }
}
