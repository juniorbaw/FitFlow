/**
 * 🎯 ONBOARDING WIZARD API
 * 
 * Guide les nouveaux utilisateurs étape par étape
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateClientData } from '@/lib/validation';
import { errorResponse, Errors, createLogger } from '@/lib/errors';

const logger = createLogger('onboarding-api');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id');

    if (!userId) {
      throw Errors.badRequest('user_id required');
    }

    // Get onboarding status
    const { data, error } = await supabase
      .from('users')
      .select('onboarding_completed, onboarding_step, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      throw Errors.database('Failed to fetch onboarding status', error);
    }

    return NextResponse.json({
      completed: data?.onboarding_completed || false,
      current_step: data?.onboarding_step || 1,
      steps: [
        {
          step: 1,
          title: 'Connecter Instagram',
          description: 'Liez votre compte Instagram professionnel',
          completed: false
        },
        {
          step: 2,
          title: 'Créer votre premier template',
          description: 'Configurez un message automatique',
          completed: false
        },
        {
          step: 3,
          title: 'Lancer votre première campagne',
          description: 'Choisissez un post et commencez',
          completed: false
        }
      ]
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, step, data: stepData } = await request.json();

    if (!user_id) {
      throw Errors.badRequest('user_id required');
    }

    logger.info('Onboarding step completed', { user_id, step });

    // Update onboarding step
    const { error } = await supabase
      .from('users')
      .update({
        onboarding_step: step,
        onboarding_completed: step >= 3,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    if (error) {
      throw Errors.database('Failed to update onboarding', error);
    }

    return NextResponse.json({
      success: true,
      next_step: step + 1,
      completed: step >= 3
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
