'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { ig_user, ig_user_id } = await request.json()
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Chercher si le coach existe
    const { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (coach) {
      await supabase
        .from('coaches')
        .update({
          instagram_username: ig_user,
          instagram_id: ig_user_id || ig_user,
        })
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('coaches')
        .insert({
          user_id: user.id,
          instagram_username: ig_user,
          instagram_id: ig_user_id || ig_user,
          email: user.email,
        })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
