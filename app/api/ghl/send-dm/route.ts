import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { lead_id, user_id, custom_message } = await request.json();

    if (!lead_id || !user_id) {
      return NextResponse.json({ error: 'lead_id and user_id required' }, { status: 400 });
    }

    // Get user's GHL API key
    const { data: user } = await supabase
      .from('profiles')
      .select('ghl_api_key, ghl_location_id, daily_dm_count, daily_dm_limit')
      .eq('id', user_id)
      .single();

    if (!user?.ghl_api_key) {
      return NextResponse.json({ error: 'GHL not configured' }, { status: 400 });
    }

    // Check daily limit
    if ((user.daily_dm_count || 0) >= (user.daily_dm_limit || 30)) {
      return NextResponse.json({ error: 'Daily DM limit reached' }, { status: 429 });
    }

    // Get lead details
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single();

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const message = custom_message || lead.dm_suggested;

    // Create or find contact in GHL
    let contactId = lead.ghl_contact_id;

    if (!contactId) {
      const createContactResponse = await fetch(
        'https://rest.gohighlevel.com/v1/contacts/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.ghl_api_key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: lead.instagram_username,
            source: 'FitFlow',
            tags: ['fitflow-lead', `score-${lead.score}`],
          }),
        }
      );
      const contactData = await createContactResponse.json();
      contactId = contactData.contact?.id;
    }

    // Send Instagram DM via GHL
    const sendDmResponse = await fetch(
      'https://rest.gohighlevel.com/v1/conversations/messages',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.ghl_api_key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Instagram',
          contactId: contactId,
          message: message,
        }),
      }
    );

    const dmResult = await sendDmResponse.json();

    if (!sendDmResponse.ok) {
      throw new Error(dmResult.message || 'Failed to send DM');
    }

    // Update lead status
    await supabase
      .from('leads')
      .update({
        status: 'sent',
        dm_sent_date: new Date().toISOString(),
        ghl_contact_id: contactId,
      })
      .eq('id', lead_id);

    // Increment daily count
    await supabase
      .from('profiles')
      .update({ daily_dm_count: (user.daily_dm_count || 0) + 1 })
      .eq('id', user_id);

    return NextResponse.json({
      success: true,
      message: 'DM sent successfully',
      contact_id: contactId,
    });
  } catch (error: any) {
    console.error('Send DM error:', error);
    return NextResponse.json(
      { error: 'Failed to send DM', details: String(error) },
      { status: 500 }
    );
  }
}
