'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Facebook } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const supabase = createClient()

  const handleFacebookLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?redirectTo=${redirectTo}`,
          scopes: 'instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement',
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Erreur lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="p-8 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Bienvenue sur <span className="text-[#FF5C00]">FitFlow</span>
            </h1>
            <p className="text-gray-400">Connectez-vous pour accéder à votre dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleFacebookLogin}
            disabled={loading}
            className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold rounded-full flex items-center justify-center gap-3 transition-all"
          >
            <Facebook className="w-5 h-5" />
            {loading ? 'Connexion en cours...' : 'Se connecter avec Facebook'}
          </Button>

          <p className="text-center text-sm text-gray-500 mt-6">
            En vous connectant, vous acceptez nos{' '}
            <Link href="/terms" className="text-[#FF5C00] hover:underline">
              Conditions d&apos;utilisation
            </Link>
          </p>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Pas encore de compte ?{' '}
              <Link href="/signup" className="text-[#FF5C00] hover:underline font-semibold">
                Créer un compte
              </Link>
            </p>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <LoginContent />
    </Suspense>
  )
}
