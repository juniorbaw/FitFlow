/**
 * 📧 NOTIFICATIONS API
 * 
 * Envoyer des notifications email/push aux utilisateurs
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { errorResponse, Errors, createLogger } from '@/lib/errors';

const logger = createLogger('notifications-api');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface NotificationPayload {
  user_id: string;
  type: 'new_lead' | 'campaign_complete' | 'instagram_connected' | 'daily_summary';
  title: string;
  message: string;
  data?: any;
}

export async function POST(request: NextRequest) {
  try {
    const payload: NotificationPayload = await request.json();

    if (!payload.user_id || !payload.type) {
      throw Errors.badRequest('user_id and type required');
    }

    // Get user preferences
    const { data: user } = await supabase
      .from('users')
      .select('email, notification_preferences')
      .eq('id', payload.user_id)
      .single();

    if (!user) {
      throw Errors.notFound('User');
    }

    const prefs = user.notification_preferences || {};

    // Check if user wants this type of notification
    if (prefs[`email_${payload.type}`] === false) {
      logger.info('Notification skipped (user preference)', { 
        user_id: payload.user_id, 
        type: payload.type 
      });
      return NextResponse.json({ 
        success: true, 
        sent: false, 
        reason: 'user_preference' 
      });
    }

    // Store notification in DB
    const { error: insertError } = await supabase
      .from('notifications')
      .insert({
        user_id: payload.user_id,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        data: payload.data,
        read: false,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      throw Errors.database('Failed to create notification', insertError);
    }

    // TODO: Envoyer email via service (SendGrid, Resend, etc.)
    // Pour l'instant, juste logger
    logger.info('Notification created', {
      user_id: payload.user_id,
      type: payload.type,
      title: payload.title
    });

    return NextResponse.json({
      success: true,
      sent: true,
      channel: 'in_app'
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id');
    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true';

    if (!userId) {
      throw Errors.badRequest('user_id required');
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) {
      throw Errors.database('Failed to fetch notifications', error);
    }

    return NextResponse.json({
      notifications: data || [],
      unread_count: data?.filter(n => !n.read).length || 0
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { notification_id, read } = await request.json();

    if (!notification_id) {
      throw Errors.badRequest('notification_id required');
    }

    const { error } = await supabase
      .from('notifications')
      .update({ 
        read: read !== false,
        read_at: read !== false ? new Date().toISOString() : null
      })
      .eq('id', notification_id);

    if (error) {
      throw Errors.database('Failed to update notification', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
