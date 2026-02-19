import { NextResponse } from 'next/server'

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || process.env.INSTAGRAM_APP_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
  
  if (!appId) {
    return NextResponse.json({ error: 'Instagram App ID not configured' }, { status: 500 })
  }

  // Facebook OAuth URL for Instagram
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement` +
    `&response_type=code` +
    `&state=instagram_connect`

  return NextResponse.redirect(authUrl)
}
