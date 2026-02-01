import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase with service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { user_id, instagram_username, comment_text, score, dm_suggested, reasoning } = body
    
    if (!user_id || !instagram_username || !comment_text || score === undefined || !dm_suggested || !reasoning) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: user_id, instagram_username, comment_text, score, dm_suggested, reasoning' },
        { status: 400 }
      )
    }

    // Validate score range
    if (score < 1 || score > 10) {
      return NextResponse.json(
        { success: false, error: 'Score must be between 1 and 10' },
        { status: 400 }
      )
    }

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          user_id,
          instagram_username,
          comment_text,
          score,
          dm_suggested,
          reasoning,
          status: 'pending',
          dm_sent_date: null,
          reply_received: false,
          reply_text: null
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        lead_id: data.id,
        message: 'Lead created successfully'
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: Add GET for testing
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Instagram Lead Scraping Webhook',
      endpoint: '/api/webhooks/scrape',
      method: 'POST',
      required_fields: ['user_id', 'instagram_username', 'comment_text', 'score', 'dm_suggested', 'reasoning']
    }
  )
}
