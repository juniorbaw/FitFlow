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
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: weekStats } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('coach_id', coachId)
      .gte('date', sevenDaysAgo.toISOString().split('T')[0])

    const totalLeads = weekStats?.reduce((sum, stat) => sum + (stat.total_leads || 0), 0) || 0
    const totalDmsSent = weekStats?.reduce((sum, stat) => sum + (stat.dms_sent || 0), 0) || 0
    const totalConversions = weekStats?.reduce((sum, stat) => sum + (stat.conversions || 0), 0) || 0
    const totalRevenue = weekStats?.reduce((sum, stat) => sum + (parseFloat(String(stat.revenue)) || 0), 0) || 0
    
    const scoresSum = weekStats?.reduce((sum, stat) => sum + (parseFloat(String(stat.avg_score)) || 0), 0) || 0
    const scoresCount = weekStats?.filter(stat => stat.avg_score).length || 0
    const avgScore = scoresCount > 0 ? scoresSum / scoresCount : 0

    const { data: categoryStats } = await supabase
      .from('leads')
      .select('category')
      .eq('coach_id', coachId)
      .gte('created_at', sevenDaysAgo.toISOString())

    const vipCount = categoryStats?.filter(l => l.category === 'vip').length || 0
    const standardCount = categoryStats?.filter(l => l.category === 'standard').length || 0
    const lowCount = categoryStats?.filter(l => l.category === 'low').length || 0

    return NextResponse.json({
      overview: {
        totalLeads,
        avgScore: Math.round(avgScore * 10) / 10,
        totalDmsSent,
        totalConversions,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        categoryDistribution: {
          vip: vipCount,
          standard: standardCount,
          low: lowCount,
        },
      },
    })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
