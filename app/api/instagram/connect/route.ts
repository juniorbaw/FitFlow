import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id');
  
  // ✅ FIX: Utiliser NEXT_PUBLIC_INSTAGRAM_APP_ID (cohérent avec autres fichiers)
  const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
  
  if (!INSTAGRAM_APP_ID) {
    console.error('❌ NEXT_PUBLIC_INSTAGRAM_APP_ID not configured');
    return NextResponse.json({ error: 'Instagram App ID not configured' }, { status: 500 });
  }

  // Scopes nécessaires pour lire les commentaires et envoyer des DMs
  // Note: instagram_manage_messages nécessite un compte Instagram Business
  const scope = [
    'instagram_basic',
    'instagram_manage_comments',
    'instagram_manage_messages',
    'pages_show_list',
    'pages_read_engagement',
  ].join(',');

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}&state=${userId}&response_type=code`;

  console.log('📱 Instagram OAuth redirect:', {
    appId: INSTAGRAM_APP_ID,
    redirectUri: REDIRECT_URI,
    scopes: scope,
  });

  return NextResponse.redirect(authUrl);
}
