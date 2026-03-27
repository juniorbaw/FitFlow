import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protection des routes /dashboard, /settings, etc.
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/settings') ||
      request.nextUrl.pathname.startsWith('/leads') ||
      request.nextUrl.pathname.startsWith('/clients') ||
      request.nextUrl.pathname.startsWith('/team') ||
      request.nextUrl.pathname.startsWith('/schedule') ||
      request.nextUrl.pathname.startsWith('/campaigns') ||
      request.nextUrl.pathname.startsWith('/templates')) {
    
    // Si pas authentifié, rediriger vers login
    if (!user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Vérifier le profil coach et l'abonnement
    const { data: coach } = await supabase
      .from('coaches')
      .select('id, subscription_status, onboarding_complete, plan')
      .eq('user_id', user.id)
      .single()

    // Si pas de profil coach, créer un (première connexion)
    if (!coach) {
      const { error } = await supabase
        .from('coaches')
        .insert({
          user_id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
        })
      
      if (!error) {
        // Rediriger vers signup pour finir l'onboarding
        return NextResponse.redirect(new URL('/signup?step=2', request.url))
      }
    }

    // Si onboarding incomplet, rediriger vers signup
    if (coach && !coach.onboarding_complete) {
      if (!request.nextUrl.pathname.startsWith('/signup')) {
        return NextResponse.redirect(new URL('/signup?step=2', request.url))
      }
    }

    // Vérifier l'abonnement pour certaines routes
    if (request.nextUrl.pathname.startsWith('/dashboard') && 
        coach?.subscription_status !== 'active') {
      // Permettre l'accès au dashboard même sans abonnement actif
      // mais afficher un banner pour upgrader
      // Pour l'instant on laisse passer
    }
  }

  // Protection des webhooks
  if (request.nextUrl.pathname.startsWith('/api/webhook/')) {
    // Les webhooks sont protégés par token dans la route elle-même
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
