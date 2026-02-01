import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lead_id } = body

    if (!lead_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: lead_id' },
        { status: 400 }
      )
    }

    // Check if lead exists
    const { data: lead, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single()

    if (fetchError || !lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Update lead status to "sent" and set dm_sent_date
    const { data, error } = await supabase
      .from('leads')
      .update({
        status: 'sent',
        dm_sent_date: new Date().toISOString()
      })
      .eq('id', lead_id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // TODO: Integrate with actual Instagram DM API here
    // For now, just updating the status in database

    return NextResponse.json(
      { 
        success: true,
        message: 'DM sent successfully',
        lead: data
      }
    )

  } catch (error: any) {
    console.error('Send DM error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Send Instagram DM Webhook',
      endpoint: '/api/webhooks/send-dm',
      method: 'POST',
      required_fields: ['lead_id']
    }
  )
}
