import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const userId = request.nextUrl.searchParams.get('state');

  if (!code || !userId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=auth_failed`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${process.env.INSTAGRAM_APP_ID}&` +
      `client_secret=${process.env.INSTAGRAM_APP_SECRET}&` +
      `redirect_uri=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`)}&` +
      `code=${code}`
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error.message);
    }

    // Get long-lived token (60 days)
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `grant_type=fb_exchange_token&` +
      `client_id=${process.env.INSTAGRAM_APP_ID}&` +
      `client_secret=${process.env.INSTAGRAM_APP_SECRET}&` +
      `fb_exchange_token=${tokenData.access_token}`
    );

    const longLivedData = await longLivedResponse.json();

    // Get Instagram Business Account ID
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedData.access_token}`
    );
    const pagesData = await pagesResponse.json();

    if (pagesData.data && pagesData.data.length > 0) {
      const pageId = pagesData.data[0].id;
      const pageAccessToken = pagesData.data[0].access_token;

      // Get Instagram Business Account
      const igResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
      );
      const igData = await igResponse.json();

      // Save to database
      await supabase
        .from('profiles')
        .update({
          instagram_access_token: longLivedData.access_token,
          instagram_business_id: igData.instagram_business_account?.id,
          instagram_connected: true,
          instagram_token_expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
        })
        .eq('id', userId);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?success=instagram_connected`);
  } catch (error) {
    console.error('Instagram OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=auth_failed`);
  }
}
