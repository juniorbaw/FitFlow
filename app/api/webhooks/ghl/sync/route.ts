import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST: Sync leads to Go High Level
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lead_id, ghl_contact_id, ghl_opportunity_id, sync_status } = body

    if (!lead_id) {
      return NextResponse.json(
        { success: false, error: 'Missing lead_id' },
        { status: 400 }
      )
    }

    // Update lead with GHL data
    const updates: any = {}
    
    if (ghl_contact_id) updates.ghl_contact_id = ghl_contact_id
    if (ghl_opportunity_id) updates.ghl_opportunity_id = ghl_opportunity_id
    if (sync_status) updates.ghl_sync_status = sync_status

    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', lead_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      lead: data
    })

  } catch (error: any) {
    console.error('GHL sync error:', error)
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
    endpoint: '/api/webhooks/ghl/sync',
    methods: ['POST'],
    description: 'Sync lead data with Go High Level'
  })
}
