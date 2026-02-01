import { NextRequest, NextResponse } from 'next/server'
import { calculateLeadScore } from '@/lib/lead-scoring'

// POST: Calculate lead score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.instagram_username) {
      return NextResponse.json(
        { success: false, error: 'Missing instagram_username' },
        { status: 400 }
      )
    }

    const scoringResult = calculateLeadScore(body)

    return NextResponse.json({
      success: true,
      ...scoringResult
    })

  } catch (error: any) {
    console.error('Lead scoring error:', error)
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
    endpoint: '/api/leads/score',
    methods: ['POST'],
    description: 'Calculate lead score based on Instagram data'
  })
}
