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
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    console.log(`\n📱 Instagram OAuth Callback:`, {
      hasCode: !!code,
      hasState: !!state,
      error,
      errorDescription
    })

    // Check for Instagram errors
    if (error) {
      console.error('❌ Instagram error:', error, errorDescription)
      const errorMsg = errorDescription || error
      return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(errorMsg)}`, APP_URL))
    }

    if (!code) {
      console.error('❌ No authorization code received')
      return NextResponse.redirect(new URL('/settings?error=no_code', APP_URL))
    }

    // Verify state and get userId
    console.log(`🔐 Verifying state...`)
    const userId = verifyState(state || '')
    if (!userId) {
      console.error('❌ Invalid or missing state')
      return NextResponse.redirect(new URL('/settings?error=invalid_state', APP_URL))
    }

    const userId2 = userId
    console.log(`✅ State verified. User ID: ${userId2}`)

    // Verify credentials
    if (!process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID) {
      console.error('❌ NEXT_PUBLIC_INSTAGRAM_APP_ID not set')
      return NextResponse.redirect(new URL('/settings?error=app_not_configured', APP_URL))
    }
    if (!INSTAGRAM_APP_SECRET) {
      console.error('❌ INSTAGRAM_APP_SECRET not set')
      return NextResponse.redirect(new URL('/settings?error=secret_not_configured', APP_URL))
    }

    // Exchange code for access token
    console.log(`🔄 Exchanging code for access token...`)
    const redirectUri = `${APP_URL}/api/auth/instagram/callback`
    console.log(`  ├─ Redirect URI: ${redirectUri}`)
    console.log(`  ├─ App ID: ${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}`)
    
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code
      }).toString()
    })

    const tokenData = await tokenResponse.json()
    console.log(`  └─ Token Response Status: ${tokenResponse.status}`)

    if (tokenData.error) {
      console.error('❌ Token exchange error:', JSON.stringify(tokenData.error, null, 2))
      const errorMsg = tokenData.error.message || JSON.stringify(tokenData.error)
      return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(errorMsg)}`, APP_URL))
    }

    const { access_token, user_id: instagram_user_id } = tokenData
    console.log(`✅ Access Token received for Instagram ID: ${instagram_user_id}`)

    // Create Supabase client with service role
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Supabase credentials not configured')
      return NextResponse.redirect(new URL('/settings?error=supabase_not_configured', APP_URL))
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Get Instagram account info
    console.log(`📱 Fetching Instagram account info...`)
    const accountUrl = `https://graph.instagram.com/v18.0/me?fields=id,username,name,biography,profile_picture_url,followers_count,media_count&access_token=${access_token}`
    const accountResponse = await fetch(accountUrl)

    const accountData = await accountResponse.json()
    console.log(`  └─ Response Status: ${accountResponse.status}`)

    if (accountData.error) {
      console.error('❌ Instagram account info error:', JSON.stringify(accountData.error, null, 2))
      const errorMsg = accountData.error.message || JSON.stringify(accountData.error)
      return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(errorMsg)}`, APP_URL))
    }

    console.log(`✅ Instagram account retrieved:`, {
      username: accountData.username,
      id: accountData.id,
      followers: accountData.followers_count
    })

    // Save to Supabase
    console.log(`💾 Saving to database...`)
    const accountRecord = {
      user_id: userId2,
      instagram_user_id: accountData.id,
      username: accountData.username,
      access_token,
      token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
      followers_count: accountData.followers_count || 0,
      media_count: accountData.media_count || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { error: saveError, data } = await supabase
      .from('instagram_accounts')
      .upsert(accountRecord, {
        onConflict: 'user_id'
      })
      .select()

    if (saveError) {
      console.error('❌ Database save error:', JSON.stringify(saveError, null, 2))
      return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(saveError.message)}`, APP_URL))
    }

    console.log(`✅ Instagram account saved successfully!`, data)
    console.log(`\n✅ OAuth flow completed successfully!\n`)
    return NextResponse.redirect(new URL('/settings?success=instagram_connected', APP_URL))

  } catch (error: any) {
    console.error('❌ OAuth callback error:', error)
    return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(error.message)}`, APP_URL))
  }
}
