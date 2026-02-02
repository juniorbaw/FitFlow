import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('GHL webhook received:', body);

    // Handle different GHL webhook events
    if (body.type === 'InboundMessage') {
      // Lead replied to DM
      const contactId = body.contactId;
      const message = body.message;

      // Find lead by GHL contact ID
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('ghl_contact_id', contactId)
        .single();

      if (lead) {
        // Update lead with reply
        await supabase
          .from('leads')
          .update({
            status: 'replied',
            reply_received: true,
            reply_text: message,
            reply_date: new Date().toISOString(),
          })
          .eq('id', lead.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('GHL webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
