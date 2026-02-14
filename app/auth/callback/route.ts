import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if coach profile exists
      const { data: coach } = await supabase
        .from('coaches')
        .select('*')
        .eq('user_id', data.user.id)
        .single()

      // If no coach profile, this might be first login
      // Check if they came from Facebook OAuth
      const provider = data.user.app_metadata.provider
      
      if (!coach && provider === 'facebook') {
        // Get Instagram data from user metadata
        const instagramUsername = data.user.user_metadata.instagram_username
        const instagramId = data.user.user_metadata.instagram_id
        const accessToken = data.session?.provider_token
        
        // Create coach profile
        await supabase.from('coaches').insert({
          user_id: data.user.id,
          email: data.user.email,
          instagram_username: instagramUsername || null,
          instagram_id: instagramId || null,
          access_token: accessToken || null,
          subscription_tier: 'free',
          subscription_status: 'trial',
        })

        // Redirect to onboarding instead of dashboard
        return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
