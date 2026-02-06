import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const error = request.nextUrl.searchParams.get('error');
  const errorReason = request.nextUrl.searchParams.get('error_reason');
  const errorDescription = request.nextUrl.searchParams.get('error_description');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app';

  // Handle errors from Instagram
  if (error) {
    console.error('Instagram OAuth error:', { error, errorReason, errorDescription });
    return NextResponse.redirect(`${baseUrl}/settings?error=${encodeURIComponent(errorDescription || error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/settings?error=no_code_received`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID!,
        client_secret: process.env.INSTAGRAM_APP_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: `${baseUrl}/api/auth/instagram/callback`,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error_message) {
      console.error('Token exchange error:', tokenData);
      return NextResponse.redirect(`${baseUrl}/settings?error=${encodeURIComponent(tokenData.error_message)}`);
    }

    // Success! We have the token
    console.log('Instagram token received:', {
      user_id: tokenData.user_id,
      permissions: tokenData.permissions,
    });

    // Get long-lived token (optional but recommended)
    const longLivedResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${tokenData.access_token}`
    );
    const longLivedData = await longLivedResponse.json();

    const finalToken = longLivedData.access_token || tokenData.access_token;
    const instagramUserId = tokenData.user_id;

    // TODO: Save to Supabase if user is logged in (state contains user_id)
    if (state && state !== 'default') {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        await supabase
          .from('instagram_accounts')
          .upsert({
            user_id: state,
            instagram_user_id: instagramUserId,
            access_token: finalToken,
            connected_at: new Date().toISOString(),
          });

        console.log('Instagram account saved for user:', state);
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue anyway - we can save later
      }
    }

    // Redirect with success
    return NextResponse.redirect(`${baseUrl}/settings?instagram_connected=true&ig_user_id=${instagramUserId}`);

  } catch (error) {
    console.error('Instagram OAuth error:', error);
    return NextResponse.redirect(`${baseUrl}/settings?error=oauth_failed`);
  }
}
