import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'user_id required' }, { status: 400 });
  }

  try {
    // Total leads
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Leads this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count: leadsThisWeek } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', weekAgo.toISOString());

    // DMs sent
    const { count: dmsSent } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('dm_sent_date', 'is', null);

    // Replies received
    const { count: repliesReceived } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('reply_received', true);

    // Converted
    const { count: converted } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'converted');

    // Average score
    const { data: scoreData } = await supabase
      .from('leads')
      .select('score')
      .eq('user_id', userId)
      .not('score', 'is', null);

    const avgScore = scoreData && scoreData.length > 0
      ? scoreData.reduce((a, b) => a + (b.score || 0), 0) / scoreData.length
      : 0;

    // Response rate
    const responseRate = dmsSent && dmsSent > 0
      ? Math.round(((repliesReceived || 0) / dmsSent) * 100)
      : 0;

    // Conversion rate
    const conversionRate = repliesReceived && repliesReceived > 0
      ? Math.round(((converted || 0) / repliesReceived) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads: totalLeads || 0,
        leadsThisWeek: leadsThisWeek || 0,
        dmsSent: dmsSent || 0,
        repliesReceived: repliesReceived || 0,
        converted: converted || 0,
        avgScore: Math.round(avgScore * 10) / 10,
        responseRate,
        conversionRate,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
