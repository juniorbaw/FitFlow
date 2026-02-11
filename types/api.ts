// API request/response types
export interface CreateLeadRequest {
  username: string
  comment_text: string
  post_url: string
  ai_score: number
  ai_reason: string
  category: 'vip' | 'standard' | 'low'
  suggested_reply: string
  manychat_subscriber_id?: string
}

export interface UpdateLeadRequest {
  status?: 'new' | 'dm_sent' | 'replied' | 'converted' | 'lost'
  revenue?: number
}

export interface StatsOverviewResponse {
  total_leads: number
  avg_score: number
  dms_sent: number
  conversions: number
  estimated_revenue: number
  leads_change: number
  score_change: number
  dms_change: number
  conversions_change: number
  revenue_change: number
}

export interface DailyStatsResponse {
  date: string
  total_leads: number
  vip_leads: number
  standard_leads: number
  low_leads: number
  conversions: number
  revenue: number
}[]

export interface StripeCheckoutRequest {
  plan: 'starter' | 'pro'
  billing_period: 'monthly' | 'annual'
}
