import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateClientData } from '@/lib/validation';
import { errorResponse, Errors, createLogger } from '@/lib/errors';

const logger = createLogger('clients-api');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET: List clients for current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'Missing user_id parameter' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, clients: data || [] })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST: Create new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      user_id, 
      client_name, 
      client_email, 
      plan_type, 
      amount, 
      start_date, 
      end_date,
      engagement_score 
    } = body

    // Validate required fields
    if (!user_id || !client_name || !client_email || !plan_type || amount === undefined || !start_date || !end_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          user_id,
          client_name,
          client_email,
          plan_type,
          amount,
          start_date,
          end_date,
          renewal_status: 'active',
          engagement_score: engagement_score || 5
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, client: data },
      { status: 201 }
    )

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
