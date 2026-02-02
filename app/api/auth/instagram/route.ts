import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app'
const SECRET_KEY = 'fitflow-instagram-oauth-secret'

export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('❌ Auth error:', userError)
      return NextResponse.redirect(new URL('/login', APP_URL))
    }

    console.log(`✅ User authenticated: ${user.id}`)

    // Create state with user_id encoded (simple CSRF protection)
    // Format: userId.timestamp.hash
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${user.id}${timestamp}`)
      .digest('hex')
      .substring(0, 16)
    
    const state = `${user.id}.${timestamp}.${signature}`

    // Build Instagram OAuth URL
    const params = new URLSearchParams({
      client_id: INSTAGRAM_APP_ID!,
      redirect_uri: `${APP_URL}/api/auth/instagram/callback`,
      scope: 'user_profile,instagram_business_basic,instagram_business_content_publish',
      response_type: 'code',
      state
    })

    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?${params.toString()}`

    console.log(`📱 Redirecting to Instagram OAuth...`)
    console.log(`🔐 State: ${state}`)

    // Redirect to Instagram OAuth
    return NextResponse.redirect(instagramAuthUrl)

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
