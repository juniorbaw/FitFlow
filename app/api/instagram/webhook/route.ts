import { NextRequest, NextResponse } from 'next/server';

// GET - Webhook verification (Meta requires this)
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('hub.mode');
  const token = request.nextUrl.searchParams.get('hub.verify_token');
  const challenge = request.nextUrl.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// POST - Receive webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the webhook for debugging
    console.log('Instagram webhook received:', JSON.stringify(body, null, 2));

    // Process webhook events (comments, mentions, messages, etc.)
    if (body.object === 'instagram') {
      for (const entry of body.entry || []) {
        // Handle comments
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'comments') {
              // New comment received
              console.log('New comment:', change.value);
              // TODO: Process comment, score it, create lead
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
