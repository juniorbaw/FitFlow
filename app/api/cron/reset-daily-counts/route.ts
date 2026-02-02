import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Reset daily DM counts for all users
    await supabase
      .from('profiles')
      .update({ daily_dm_count: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

    return NextResponse.json({ success: true, message: 'Daily counts reset' });
  } catch (error) {
    console.error('Reset counts error:', error);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
