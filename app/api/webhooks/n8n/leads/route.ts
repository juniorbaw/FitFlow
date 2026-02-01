import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST: Receive leads from N8n workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { leads } = body
    
    if (!leads || !Array.isArray(leads)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload. Expected { leads: [...] }' },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    // Process each lead
    for (const lead of leads) {
      try {
        // Validate lead data
        if (!lead.instagram_username) {
          errors.push({ lead, error: 'Missing instagram_username' })
          continue
        }

        // Check if lead already exists
        const { data: existingLead } = await supabase
          .from('leads')
          .select('id')
          .eq('instagram_username', lead.instagram_username)
          .single()

        if (existingLead) {
          // Update existing lead
          const { data: updatedLead, error } = await supabase
            .from('leads')
            .update({
              full_name: lead.full_name || null,
              bio: lead.bio || null,
              followers_count: lead.followers_count || null,
              following_count: lead.following_count || null,
              posts_count: lead.posts_count || null,
              profile_pic_url: lead.profile_pic_url || null,
              is_verified: lead.is_verified || false,
              is_business: lead.is_business || false,
              engagement_rate: lead.engagement_rate || null,
              lead_score: lead.lead_score || null,
              tags: lead.tags || [],
              source: lead.source || 'n8n',
              notes: lead.notes || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingLead.id)
            .select()
            .single()

          if (error) throw error
          results.push({ action: 'updated', lead: updatedLead })
        } else {
          // Create new lead
          const { data: newLead, error } = await supabase
            .from('leads')
            .insert({
              instagram_username: lead.instagram_username,
              full_name: lead.full_name || null,
              bio: lead.bio || null,
              followers_count: lead.followers_count || null,
              following_count: lead.following_count || null,
              posts_count: lead.posts_count || null,
              profile_pic_url: lead.profile_pic_url || null,
              is_verified: lead.is_verified || false,
              is_business: lead.is_business || false,
              engagement_rate: lead.engagement_rate || null,
              lead_score: lead.lead_score || null,
              status: lead.status || 'new',
              tags: lead.tags || [],
              source: lead.source || 'n8n',
              notes: lead.notes || null,
              created_at: new Date().toISOString()
            })
            .select()
            .single()

          if (error) throw error
          results.push({ action: 'created', lead: newLead })
        }
      } catch (err: any) {
        errors.push({ lead, error: err.message })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error: any) {
    console.error('N8n webhook error:', error)
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
    endpoint: '/api/webhooks/n8n/leads',
    methods: ['POST'],
    description: 'Receive leads from N8n workflow'
  })
}
