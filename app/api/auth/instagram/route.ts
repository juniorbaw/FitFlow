import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app'

// Store for temporary state (in production, use Redis)
const stateStore = new Map<string, { userId: string; timestamp: number }>()

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Auth error:', userError)
      return NextResponse.redirect(new URL('/login', APP_URL))
    }

    // Generate state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    stateStore.set(state, { userId: user.id, timestamp: Date.now() })

    // Clean up old states after 15 minutes
    setTimeout(() => {
      const now = Date.now()
      for (const [key, value] of stateStore.entries()) {
        if (now - value.timestamp > 15 * 60 * 1000) {
          stateStore.delete(key)
        }
      }
    }, 0)

    // Build Instagram OAuth URL
    const params = new URLSearchParams({
      client_id: INSTAGRAM_APP_ID!,
      redirect_uri: `${APP_URL}/api/auth/instagram/callback`,
      scope: 'user_profile,instagram_business_basic,instagram_business_content_publish',
      response_type: 'code',
      state
    })

    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?${params.toString()}`

    console.log(`📱 Redirecting user ${user.id} to Instagram OAuth`)

    // Redirect to Instagram OAuth
    return NextResponse.redirect(instagramAuthUrl)

  } catch (error: any) {
    console.error('Instagram auth route error:', error)
    return NextResponse.redirect(new URL(`/settings?error=instagram_error`, APP_URL))
  }
}

export function getState(state: string): { userId: string; timestamp: number } | null {
  const stateData = stateStore.get(state)
  if (stateData) {
    stateStore.delete(state) // One-time use
  }
  return stateData || null
}
