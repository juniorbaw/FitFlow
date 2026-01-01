'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // ═══════════════════════════════════════
    // CONNEXION AVEC SUPABASE
    // ═══════════════════════════════════════
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    setLoading(false)

    if (signInError) {
      console.error('Erreur connexion:', signInError)
      setError('Email ou mot de passe incorrect')
      return
    }

    // ═══════════════════════════════════════
    // SUCCÈS !
    // ═══════════════════════════════════════
    console.log('Connecté !', data)
    
    // Redirige vers dashboard (qu'on va créer)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <span className="font-bold text-2xl">ClientWin</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Bon retour !</h1>
        <p className="text-gray-600 text-center mb-8">
          Connectez-vous pour accéder à votre dashboard
        </p>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="password">Mot de passe</Label>
              <Link 
                href="#" 
                className="text-sm text-blue-600 hover:underline"
              >
                Oublié ?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Bouton */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-semibold">
            Créer un compte
          </Link>
        </p>
      </Card>
    </div>
  )
}