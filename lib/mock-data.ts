import type { Lead, DailyStat, Post } from '@/types/database'

export const mockLeads: Lead[] = [
  {
    id: '1',
    coach_id: 'coach_123',
    username: 'fitness_marie',
    comment: 'Super intéressée par ton programme! Comment je peux avoir plus d\'infos?',
    post_url: 'https://instagram.com/p/test1',
    instagram_post_id: 'test1',
    ai_score: 9,
    ai_reason: 'Forte motivation exprimée',
    category: 'vip',
    suggested_reply: 'Salut Marie! Je t\'envoie tout ça en DM 😊',
    status: 'converted',
    revenue: 297,
    conversion_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    manychat_subscriber_id: 'sub_123',
    dm_sent_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    coach_id: 'coach_123',
    username: 'coach_tony',
    comment: 'Ça a l\'air top! C\'est combien?',
    post_url: 'https://instagram.com/p/test2',
    instagram_post_id: 'test2',
    ai_score: 7,
    ai_reason: 'Intérêt prix',
    category: 'standard',
    suggested_reply: 'Hey Tony! Je te DM ça 🔥',
    status: 'replied',
    revenue: null,
    conversion_date: null,
    manychat_subscriber_id: 'sub_124',
    dm_sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockDailyStats: DailyStat[] = []
export const mockPosts: Post[] = []
