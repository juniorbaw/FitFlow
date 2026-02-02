import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id');
  
  const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
  
  if (!INSTAGRAM_APP_ID) {
    return NextResponse.json({ error: 'Instagram App ID not configured' }, { status: 500 });
  }

  // Scopes nécessaires pour lire les commentaires et envoyer des DMs
  const scope = [
    'instagram_basic',
    'instagram_manage_comments',
    'instagram_manage_messages',
    'pages_show_list',
    'pages_read_engagement',
  ].join(',');

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}&state=${userId}&response_type=code`;

  return NextResponse.redirect(authUrl);
}
