import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data: coach, error: coachError } = await supabase
      .from('coaches')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (coachError || !coach) {
      return NextResponse.json({ error: 'Profil coach non trouvé' }, { status: 404 })
    }

    const coachId = coach.id
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'

    const now = new Date()
    let startDate = new Date()
    
    if (period === '7d') {
      startDate.setDate(now.getDate() - 7)
    } else if (period === '30d') {
      startDate.setDate(now.getDate() - 30)
    } else if (period === '6w') {
      startDate.setDate(now.getDate() - 42)
    }

    const { data: stats, error } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('coach_id', coachId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching stats:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des stats' }, { status: 500 })
    }

    return NextResponse.json({ stats: stats || [] })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
