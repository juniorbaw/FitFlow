/**
 * Lead Scoring System for FitFlow
 * Scores Instagram profiles based on fitness coaching potential
 */

export interface LeadData {
  instagram_username: string
  full_name?: string
  bio?: string
  followers_count?: number
  following_count?: number
  posts_count?: number
  is_verified?: boolean
  is_business?: boolean
  engagement_rate?: number
  recent_comments?: string[]
  recent_posts?: any[]
}

export interface ScoringResult {
  lead_score: number
  score_breakdown: {
    bio_score: number
    engagement_score: number
    follower_score: number
    activity_score: number
    interest_score: number
  }
  qualification: 'hot' | 'warm' | 'cold'
  tags: string[]
  recommended_action: string
}

/**
 * Calculate lead score (0-100)
 */
export function calculateLeadScore(lead: LeadData): ScoringResult {
  const breakdown = {
    bio_score: scoreBio(lead.bio || ''),
    engagement_score: scoreEngagement(lead.engagement_rate, lead.followers_count),
    follower_score: scoreFollowers(lead.followers_count, lead.following_count),
    activity_score: scoreActivity(lead.posts_count),
    interest_score: scoreInterest(lead.recent_comments || [], lead.bio || '')
  }

  // Weighted average
  const totalScore = Math.round(
    breakdown.bio_score * 0.25 +
    breakdown.engagement_score * 0.20 +
    breakdown.follower_score * 0.20 +
    breakdown.activity_score * 0.15 +
    breakdown.interest_score * 0.20
  )

  // Generate tags
  const tags = generateTags(lead, breakdown)

  // Determine qualification
  let qualification: 'hot' | 'warm' | 'cold'
  let recommended_action: string

  if (totalScore >= 70) {
    qualification = 'hot'
    recommended_action = 'Send personalized DM immediately'
  } else if (totalScore >= 45) {
    qualification = 'warm'
    recommended_action = 'Add to nurture campaign'
  } else {
    qualification = 'cold'
    recommended_action = 'Monitor for now, engage with content'
  }

  return {
    lead_score: totalScore,
    score_breakdown: breakdown,
    qualification,
    tags,
    recommended_action
  }
}

/**
 * Score bio content (0-100)
 */
function scoreBio(bio: string): number {
  if (!bio) return 0

  const bioLower = bio.toLowerCase()
  let score = 10 // Base score for having a bio

  // Fitness-related keywords
  const fitnessKeywords = [
    'fitness', 'gym', 'workout', 'training', 'coach',
    'health', 'nutrition', 'muscle', 'weight loss', 'transformation',
    'bodybuilding', 'cardio', 'athlete', 'runner', 'yoga',
    'crossfit', 'personal trainer', 'pt', 'wellness'
  ]

  // Check for fitness keywords
  const keywordMatches = fitnessKeywords.filter(keyword => bioLower.includes(keyword)).length
  score += Math.min(keywordMatches * 15, 60)

  // Bonus for goal-oriented language
  const goalKeywords = ['goal', 'dream', 'transform', 'journey', 'results']
  if (goalKeywords.some(keyword => bioLower.includes(keyword))) {
    score += 15
  }

  // Bonus for engagement indicators
  if (bioLower.includes('dm') || bioLower.includes('contact') || bioLower.includes('inquiries')) {
    score += 15
  }

  return Math.min(score, 100)
}

/**
 * Score engagement rate (0-100)
 */
function scoreEngagement(engagementRate?: number, followers?: number): number {
  if (!engagementRate) return 30 // Neutral score if unknown

  // Good engagement rates vary by follower count
  const followersCount = followers || 1000
  
  let threshold: number
  if (followersCount < 1000) {
    threshold = 8 // Smaller accounts should have higher engagement
  } else if (followersCount < 10000) {
    threshold = 5
  } else if (followersCount < 100000) {
    threshold = 3
  } else {
    threshold = 2
  }

  const score = Math.min((engagementRate / threshold) * 100, 100)
  return Math.round(score)
}

/**
 * Score follower/following ratio (0-100)
 */
function scoreFollowers(followers?: number, following?: number): number {
  if (!followers || !following) return 40 // Neutral if unknown

  const ratio = followers / following

  // Ideal profiles have more followers than following
  if (ratio >= 2) return 100
  if (ratio >= 1.5) return 85
  if (ratio >= 1) return 70
  if (ratio >= 0.5) return 50
  if (ratio >= 0.3) return 30
  return 15
}

/**
 * Score account activity (0-100)
 */
function scoreActivity(posts?: number): number {
  if (!posts) return 20

  // Active accounts have regular posts
  if (posts >= 100) return 100
  if (posts >= 50) return 85
  if (posts >= 20) return 70
  if (posts >= 10) return 50
  if (posts >= 5) return 30
  return 15
}

/**
 * Score interest level based on comments and bio (0-100)
 */
function scoreInterest(comments: string[], bio: string): number {
  let score = 0

  // Analyze comments for buying signals
  const buyingSignals = [
    'how much', 'price', 'cost', 'interested', 'want', 'need',
    'help', 'program', 'plan', 'coaching', 'guide', 'tips',
    'recommend', 'advice', 'struggling', 'looking for'
  ]

  const commentsText = comments.join(' ').toLowerCase()
  const matchCount = buyingSignals.filter(signal => commentsText.includes(signal)).length
  
  score += Math.min(matchCount * 20, 60)

  // Check bio for pain points
  const painPoints = [
    'struggling', 'stuck', 'help', 'need', 'looking for',
    'tired of', 'frustrated', 'plateau'
  ]

  const bioLower = bio.toLowerCase()
  if (painPoints.some(pain => bioLower.includes(pain))) {
    score += 40
  }

  return Math.min(score, 100)
}

/**
 * Generate relevant tags
 */
function generateTags(lead: LeadData, breakdown: any): string[] {
  const tags: string[] = []

  // Lead quality tags
  if (breakdown.bio_score >= 70) tags.push('fitness-focused')
  if (breakdown.engagement_score >= 70) tags.push('highly-engaged')
  if (breakdown.follower_score >= 70) tags.push('good-following')
  if (breakdown.interest_score >= 70) tags.push('high-intent')

  // Account type tags
  if (lead.is_verified) tags.push('verified')
  if (lead.is_business) tags.push('business-account')

  // Follower size tags
  const followers = lead.followers_count || 0
  if (followers < 1000) tags.push('micro')
  else if (followers < 10000) tags.push('small')
  else if (followers < 100000) tags.push('medium')
  else tags.push('large')

  return tags
}
