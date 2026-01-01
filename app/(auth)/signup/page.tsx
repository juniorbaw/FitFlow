'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (password.length < 8) {
      setError('Le mot de passe doit faire minimum 8 caractères')
      setLoading(false)
      return
    }

    // INSCRIPTION AVEC SUPABASE
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
        }
      }
    })

    setLoading(false)

    if (signUpError) {
      console.error('Erreur inscription:', signUpError)
      setError(signUpError.message)
      return
    }

    // SUCCÈS
    console.log('Compte créé !', data)
    alert('Compte créé avec succès ! Vérifie ton email pour confirmer.')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <span className="font-bold text-2xl">ClientWin</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          Créez votre compte
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Commencez votre essai gratuit de 14 jours
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

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

          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 caractères
            </p>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              J'accepte les conditions d'utilisation
            </label>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  )
}