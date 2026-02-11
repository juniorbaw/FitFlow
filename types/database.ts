// Database types matching Supabase schema
export interface Coach {
  id: string
  user_id: string
  email: string
  name: string
  instagram_username: string | null
  instagram_id: string | null
  facebook_page_id: string | null
  access_token: string | null
  plan: 'starter' | 'pro' | 'agency'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: 'active' | 'inactive' | 'canceled' | 'past_due'
  manychat_api_key: string | null
  webhook_url: string | null
  webhook_token: string | null
  business_name: string | null
  niche: string | null
  message_style: string | null
  auto_send_enabled: boolean
  daily_dm_limit: number
  daily_dm_count: number
  onboarding_complete: boolean
  onboarding_step: number
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  coach_id: string
  username: string
  comment: string
  post_url: string | null
  instagram_post_id: string | null
  ai_score: number | null
  ai_reason: string | null
  category: 'vip' | 'standard' | 'low'
  suggested_reply: string | null
  status: 'new' | 'dm_sent' | 'replied' | 'converted' | 'lost'
  revenue: number | null
  conversion_date: string | null
  manychat_subscriber_id: string | null
  dm_sent_at: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  coach_id: string
  instagram_post_id: string
  post_url: string
  caption: string | null
  post_type: 'image' | 'video' | 'reel' | 'carousel'
  total_leads: number
  total_conversions: number
  total_revenue: number
  avg_score: number | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface DailyStat {
  id: string
  coach_id: string
  date: string
  total_leads: number
  vip_leads: number
  standard_leads: number
  low_leads: number
  dms_sent: number
  replies: number
  conversions: number
  revenue: number
  avg_score: number | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  coach_id: string
  stripe_subscription_id: string
  stripe_customer_id: string | null
  plan: 'starter' | 'pro' | 'agency'
  billing_period: 'monthly' | 'annual' | null
  amount: number
  status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  current_period_start: string | null
  current_period_end: string | null
  cancel_at: string | null
  canceled_at: string | null
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      coaches: {
        Row: Coach
        Insert: Omit<Coach, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Coach, 'id' | 'created_at' | 'updated_at'>>
      }
      leads: {
        Row: Lead
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>
      }
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>
      }
      daily_stats: {
        Row: DailyStat
        Insert: Omit<DailyStat, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DailyStat, 'id' | 'created_at' | 'updated_at'>>
      }
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
