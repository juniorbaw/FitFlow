/**
 * Service Instagram pour ClientWin
 * Gère les interactions avec l'API Instagram Graph
 */

const INSTAGRAM_API_URL = 'https://graph.instagram.com'
const FACEBOOK_API_URL = 'https://graph.facebook.com/v18.0'

export interface InstagramAccount {
  id: string
  username: string
  accountType: string
  mediaCount: number
}

export interface InstagramComment {
  id: string
  text: string
  username: string
  timestamp: string
  mediaId: string
}

export interface InstagramMessage {
  recipient: string
  message: string
}

/**
 * Classe principale pour gérer Instagram
 */
export class InstagramService {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  /**
   * Récupère les informations du compte Instagram
   */
  async getAccountInfo(): Promise<InstagramAccount> {
    const response = await fetch(
      `${INSTAGRAM_API_URL}/me?fields=id,username,account_type,media_count&access_token=${this.accessToken}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram account info')
    }

    const data = await response.json()
    return {
      id: data.id,
      username: data.username,
      accountType: data.account_type,
      mediaCount: data.media_count
    }
  }

  /**
   * Récupère les médias récents de l'utilisateur
   */
  async getRecentMedia(limit: number = 10) {
    const response = await fetch(
      `${INSTAGRAM_API_URL}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,username&limit=${limit}&access_token=${this.accessToken}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram media')
    }

    return response.json()
  }

  /**
   * Récupère les commentaires d'un post spécifique
   */
  async getMediaComments(mediaId: string): Promise<InstagramComment[]> {
    const response = await fetch(
      `${INSTAGRAM_API_URL}/${mediaId}/comments?fields=id,text,username,timestamp&access_token=${this.accessToken}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch media comments')
    }

    const data = await response.json()
    return data.data.map((comment: any) => ({
      id: comment.id,
      text: comment.text,
      username: comment.username,
      timestamp: comment.timestamp,
      mediaId
    }))
  }

  /**
   * Récupère TOUS les commentaires de tous les posts récents
   */
  async getAllRecentComments(mediaLimit: number = 10): Promise<InstagramComment[]> {
    const media = await this.getRecentMedia(mediaLimit)
    const allComments: InstagramComment[] = []

    for (const post of media.data) {
      try {
        const comments = await this.getMediaComments(post.id)
        allComments.push(...comments)
      } catch (error) {
        console.error(`Failed to fetch comments for media ${post.id}:`, error)
      }
    }

    return allComments
  }

  /**
   * Envoie un message direct à un utilisateur
   * ATTENTION: Nécessite instagram_manage_messages permission
   */
  async sendDirectMessage(recipientId: string, message: string) {
    // Pour envoyer des DM, on doit d'abord avoir l'ID de la conversation
    // ou créer une nouvelle conversation
    const response = await fetch(
      `${INSTAGRAM_API_URL}/me/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to send DM: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  /**
   * Répond à un commentaire
   */
  async replyToComment(commentId: string, message: string) {
    const response = await fetch(
      `${INSTAGRAM_API_URL}/${commentId}/replies`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          access_token: this.accessToken
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to reply to comment')
    }

    return response.json()
  }

  /**
   * Récupère les statistiques du compte
   */
  async getAccountInsights() {
    const response = await fetch(
      `${INSTAGRAM_API_URL}/me/insights?metric=follower_count,reach,impressions&period=day&access_token=${this.accessToken}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch account insights')
    }

    return response.json()
  }
}

/**
 * Génère l'URL d'autorisation Instagram OAuth
 */
export function getInstagramAuthUrl(redirectUri: string): string {
  const appId = process.env.INSTAGRAM_APP_ID!
  const scope = 'user_profile,user_media'

  return `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`
}

/**
 * Échange le code d'autorisation contre un access token
 */
export async function exchangeCodeForToken(code: string, redirectUri: string) {
  const appId = process.env.INSTAGRAM_APP_ID!
  const appSecret = process.env.INSTAGRAM_APP_SECRET!

  const response = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to exchange code: ${JSON.stringify(error)}`)
  }

  return response.json()
}

/**
 * Convertit un token short-lived en long-lived token (60 jours)
 */
export async function getLongLivedToken(shortLivedToken: string) {
  const appSecret = process.env.INSTAGRAM_APP_SECRET!

  const response = await fetch(
    `${FACEBOOK_API_URL}/oauth/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedToken}`
  )

  if (!response.ok) {
    throw new Error('Failed to get long-lived token')
  }

  return response.json()
}
