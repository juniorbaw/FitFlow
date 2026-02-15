import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG, SUPABASE_CONFIG } from '@/lib/config';

const supabase = createClient(
  SUPABASE_CONFIG.URL,
  SUPABASE_CONFIG.SERVICE_ROLE_KEY
);

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all users with auto_send enabled and Instagram connected
    const { data: users } = await supabase
      .from('profiles')
      .select('id, instagram_username, instagram_access_token, instagram_business_id')
      .eq('auto_send_enabled', true)
      .eq('instagram_connected', true);

    const results = [];

    for (const user of users || []) {
      // Call the comments endpoint for each user
      const commentsResponse = await fetch(
        APP_CONFIG.api.instagram.comments(user.id)
      );
      const commentsData = await commentsResponse.json();

      // Analyze each comment with Gemini
      for (const comment of commentsData.comments || []) {
        // Check if already processed
        const { data: existing } = await supabase
          .from('leads')
          .select('id')
          .eq('comment_id', comment.comment_id)
          .single();

        if (existing) continue;

        // Analyze with AI
        const analyzeResponse = await fetch(
          APP_CONFIG.api.ai.analyze(),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              comment_text: comment.comment_text,
              post_caption: comment.post_caption,
              instagram_username: comment.instagram_username,
            }),
          }
        );
        const analysisData = await analyzeResponse.json();

        if (analysisData.success && analysisData.analysis.score >= 6) {
          // Create lead
          await supabase.from('leads').insert({
            user_id: user.id,
            instagram_username: comment.instagram_username,
            comment_text: comment.comment_text,
            comment_id: comment.comment_id,
            post_url: comment.post_url,
            score: analysisData.analysis.score,
            dm_suggested: analysisData.analysis.dm_suggested,
            reasoning: analysisData.analysis.reasoning,
            status: 'pending',
          });

          results.push({
            user_id: user.id,
            comment_id: comment.comment_id,
            score: analysisData.analysis.score,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error('Cron scrape error:', error);
    return NextResponse.json({ error: 'Scrape failed' }, { status: 500 });
  }
}
