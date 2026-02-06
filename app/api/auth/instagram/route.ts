import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app'
const SECRET_KEY = 'fitflow-instagram-oauth-secret'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')

    if (!userId) {
      console.error('❌ No user_id param')
      return NextResponse.redirect(new URL('/login', APP_URL))
    }

    if (!INSTAGRAM_APP_ID) {
      console.error('❌ INSTAGRAM_APP_ID not configured')
      return NextResponse.redirect(new URL('/settings?error=app_not_configured', APP_URL))
    }

    // Create state with user_id encoded (CSRF protection)
    // Format: userId.timestamp.hash
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${userId}${timestamp}`)
      .digest('hex')
      .substring(0, 16)

    const state = `${userId}.${timestamp}.${signature}`
    const redirectUri = `${APP_URL}/api/auth/callback`

    // Build Facebook OAuth URL (Meta Business)
    // IMPORTANT: Use facebook.com/v18.0/dialog/oauth (NOT instagram.com/oauth/authorize)
    const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_basic,instagram_manage_comments,pages_show_list,pages_read_engagement&response_type=code`

    console.log(`📱 Instagram OAuth Request:`)
    console.log(`  ├─ App ID: ${appId}`)
    console.log(`  ├─ Redirect URI: ${redirectUri}`)
    console.log(`  ├─ Auth URL: ${authUrl.substring(0, 100)}...`)

    // Redirect to Instagram OAuth
    return NextResponse.redirect(authUrl)

  } catch (error: any) {
    console.error('❌ Instagram auth route error:', error)
    return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(error.message)}`, APP_URL))
  }
}

export function verifyState(state: string): string | null {
  try {
    const [userId, timestamp, signature] = state.split('.')
    
    if (!userId || !timestamp || !signature) {
      console.error('❌ Invalid state format')
      return null
    }

    // Verify signature
    const ts = parseInt(timestamp)
    const now = Math.floor(Date.now() / 1000)
    
    // Allow 10 minute window
    if (now - ts > 600) {
      console.error('❌ State expired')
      return null
    }

    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${userId}${timestamp}`)
      .digest('hex')
      .substring(0, 16)

    if (signature !== expectedSignature) {
      console.error('❌ Invalid signature')
      return null
    }

    console.log(`✅ State verified for user: ${userId}`)
    return userId
  } catch (error: any) {
    console.error('❌ State verification error:', error)
    return null
  }
}
