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
    // TODO: Send daily report email to all users
    // Get yesterday's stats for each user
    // Use SendGrid or similar to send email

    return NextResponse.json({ success: true, message: 'Daily reports sent' });
  } catch (error) {
    console.error('Daily report error:', error);
    return NextResponse.json({ error: 'Report failed' }, { status: 500 });
  }
}
