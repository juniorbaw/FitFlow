import { NextResponse } from 'next/server'

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Access token manquant' },
      { status: 400 }
    )
  }

  try {
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
    )

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json()
      throw new Error(errorData.error?.message || 'Erreur API')
    }

    const profile = await profileResponse.json()

    const mediaResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=10&access_token=${accessToken}`
    )

    let media = []
    if (mediaResponse.ok) {
      const mediaData = await mediaResponse.json()
      media = mediaData.data || []
    }

    return NextResponse.json({
      success: true,
      profile,
      media
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
