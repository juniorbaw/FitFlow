import { NextRequest, NextResponse } from 'next/server';

// GET - Webhook verification (Meta requires this)
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('hub.mode');
  const token = request.nextUrl.searchParams.get('hub.verify_token');
  const challenge = request.nextUrl.searchParams.get('hub.challenge');
  
  const expectedToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;

  console.log('Webhook verification:', {
    mode,
    receivedToken: token,
    expectedToken: expectedToken ? 'EXISTS' : 'MISSING',
    challenge
  });

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('✅ Webhook verified successfully!');
    return new NextResponse(challenge, { status: 200 });
  }

  console.log('❌ Webhook verification failed');
  return new NextResponse('Forbidden', { status: 403 });
}

// POST - Receive webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Instagram webhook received:', JSON.stringify(body, null, 2));

    // Process webhook events
    if (body.object === 'instagram') {
      for (const entry of body.entry || []) {
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'comments') {
              console.log('New comment:', change.value);
            }
            if (change.field === 'messages') {
              console.log('New message:', change.value);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
