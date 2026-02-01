import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST: Receive DM delivery status from Go High Level
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lead_id, instagram_username, status, message, timestamp, ghl_message_id } = body

    // Find lead
    let lead;
    let fetchError;
    
    if (lead_id) {
      const result = await supabase
        .from('leads')
        .select('*')
        .eq('id', lead_id)
        .single()
      lead = result.data
      fetchError = result.error
    } else if (instagram_username) {
      const result = await supabase
        .from('leads')
        .select('*')
        .eq('instagram_username', instagram_username)
        .single()
      lead = result.data
      fetchError = result.error
    } else {
      return NextResponse.json(
        { success: false, error: 'Must provide lead_id or instagram_username' },
        { status: 400 }
      )
    }

    if (fetchError || !lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Update lead based on status
    const updates: any = {}
    
    if (status === 'sent' || status === 'delivered') {
      updates.status = 'sent'
      updates.dm_sent_date = timestamp || new Date().toISOString()
      if (ghl_message_id) updates.last_ghl_message_id = ghl_message_id
    } else if (status === 'replied') {
      updates.status = 'replied'
      updates.reply_received = true
      updates.reply_text = message || null
      updates.reply_date = timestamp || new Date().toISOString()
    } else if (status === 'failed') {
      updates.status = 'failed'
      updates.notes = `DM failed: ${message || 'Unknown error'}`
    }

    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', lead.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead
    })

  } catch (error: any) {
    console.error('GHL DM status error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET: Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/webhooks/ghl/dm-status',
    methods: ['POST'],
    description: 'Receive DM delivery status from Go High Level'
  })
}
