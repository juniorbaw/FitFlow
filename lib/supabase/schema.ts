// Schéma app_crm pour FitFlow
export const SCHEMA = 'app_crm';

export interface Coach {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name?: string;
  instagram_username?: string;
  instagram_user_id?: string;
  instagram_access_token?: string;
  instagram_token_expires_at?: string;
  profile_picture_url?: string;
  subscription_status?: string;
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  id: string;
  coach_id: string;
  instagram_username?: string;
  instagram_user_id?: string;
  full_name?: string;
  profile_picture_url?: string;
  comment_text?: string;
  post_id?: string;
  ai_score?: number;
  ai_category?: string;
  status?: string;
  tier?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Conversation {
  id: string;
  coach_id: string;
  lead_id?: string;
  instagram_thread_id?: string;
  status?: string;
  last_message_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  coach_id: string;
  sender_type?: string;
  message_text?: string;
  sent_at?: string;
  is_ai_generated?: boolean;
  ai_confidence?: number;
  created_at?: string;
}

export interface Feedback {
  id: string;
  coach_id: string;
  rating?: number;
  comments?: string;
  status?: string;
  created_at?: string;
}
