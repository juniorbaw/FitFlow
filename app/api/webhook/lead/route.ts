import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Récupérer le token depuis les headers
    const webhookToken = request.headers.get('x-webhook-token')
    
    if (!webhookToken) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 })
    }

    const body = await request.json()
    const {
      username,
      comment_text,
      post_url,
      instagram_post_id,
      ai_score,
      ai_reason,
      category,
      suggested_reply,
      manychat_subscriber_id,
    } = body

    // Validation des champs requis
    if (!username || !comment_text) {
      return NextResponse.json({ error: 'username et comment_text sont requis' }, { status: 400 })
    }

    // Utiliser le client admin pour bypasser RLS
    const supabase = createAdminClient()

    // Appeler la fonction Supabase qui vérifie le token et insère le lead
    const { data, error } = await supabase.rpc('insert_lead_from_webhook', {
      p_webhook_token: webhookToken,
      p_username: username,
      p_comment: comment_text,
      p_post_url: post_url || null,
      p_instagram_post_id: instagram_post_id || null,
      p_ai_score: ai_score || null,
      p_ai_reason: ai_reason || null,
      p_category: category || 'standard',
      p_suggested_reply: suggested_reply || null,
      p_manychat_subscriber_id: manychat_subscriber_id || null,
    })

    if (error) {
      console.error('Webhook error:', error)
      
      // Si le token est invalide
      if (error.message.includes('Invalid webhook token')) {
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
      }
      
      return NextResponse.json({ error: 'Erreur lors de la création du lead' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      lead_id: data,
      message: 'Lead créé avec succès' 
    })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Méthode GET pour tester le webhook
export async function GET() {
  return NextResponse.json({
    message: 'Webhook FitFlow - Utilisez POST avec x-webhook-token header',
    required_fields: {
      username: 'string (requis)',
      comment_text: 'string (requis)',
      post_url: 'string (optionnel)',
      instagram_post_id: 'string (optionnel)',
      ai_score: 'number 0-10 (optionnel)',
      ai_reason: 'string (optionnel)',
      category: 'vip|standard|low (optionnel, default: standard)',
      suggested_reply: 'string (optionnel)',
      manychat_subscriber_id: 'string (optionnel)',
    },
  })
}
