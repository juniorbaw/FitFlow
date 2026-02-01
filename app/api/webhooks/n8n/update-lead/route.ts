import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST: Update lead status/data from N8n
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lead_id, instagram_username, updates } = body

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid updates object' },
        { status: 400 }
      )
    }

    // Find lead by ID or username
    let data;
    let error;
    
    if (lead_id) {
      const result = await supabase
        .from('leads')
        .update(updates)
        .eq('id', lead_id)
        .select()
        .single()
      data = result.data
      error = result.error
    } else if (instagram_username) {
      const result = await supabase
        .from('leads')
        .update(updates)
        .eq('instagram_username', instagram_username)
        .select()
        .single()
      data = result.data
      error = result.error
    } else {
      return NextResponse.json(
        { success: false, error: 'Must provide lead_id or instagram_username' },
        { status: 400 }
      )
    }

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
    console.error('Update lead error:', error)
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
    endpoint: '/api/webhooks/n8n/update-lead',
    methods: ['POST'],
    description: 'Update lead status or data from N8n'
  })
}
