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

      // If no coach profile, create one (first login)
      const provider = data.user.app_metadata.provider
      
      if (!coach) {
        // Get Instagram data from user metadata (if OAuth)
        const instagramUsername = data.user.user_metadata.instagram_username
        const instagramId = data.user.user_metadata.instagram_id
        const accessToken = data.session?.provider_token
        const name = data.user.user_metadata.name || data.user.email?.split('@')[0]
        
        // Create coach profile for ANY auth method (email or OAuth)
        await supabase.from('coaches').insert({
          user_id: data.user.id,
          email: data.user.email,
          name: name,
          instagram_username: instagramUsername || null,
          instagram_id: instagramId || null,
          access_token: accessToken || null,
          plan: 'free',
          subscription_status: 'trial',
        })

        // Redirect to dashboard for first login
        return NextResponse.redirect(new URL('/dashboard?welcome=true', requestUrl.origin))
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
