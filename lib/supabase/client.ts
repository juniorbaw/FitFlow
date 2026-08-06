import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export singleton pour usage dans les composants client
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types pour TypeScript
export type Coach = {
  id: string
  auth_user_id: string
  name: string | null
  email: string | null
  instagram_username?: string | null
  plan?: 'free' | 'starter' | 'pro' | 'elite'
  created_at: string
  updated_at: string
}

export type Lead = {
  id: string
  coach_id: string
  name: string | null
  email: string | null
  status: string
  ai_score?: number | null
  metadata?: any
  created_at: string
}

export type Feedback = {
  id: string
  coach_id: string
  rating: number
  comments: string | null
  created_at: string
  coach?: Coach
}
