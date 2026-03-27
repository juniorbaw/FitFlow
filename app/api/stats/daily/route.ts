import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { data: coach } = await supabase
      .from('coaches')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!coach) {
      return NextResponse.json(
        { error: 'Coach non trouvé' },
        { status: 404 }
      )
    }

    // Get daily stats for last 30 days
    const { data: dailyStats, error: statsError } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('coach_id', coach.id)
      .order('date', { ascending: false })
      .limit(30)

    if (statsError) {
      console.error('Error fetching daily stats:', statsError)
      return NextResponse.json(
        { error: statsError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      stats: dailyStats || [],
    })

  } catch (error: any) {
    console.error('Daily stats error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
