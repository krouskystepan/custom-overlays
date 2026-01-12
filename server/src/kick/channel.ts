export interface KickChannelInfo {
  id: number
  user_id: number
}

export async function fetchKickChannel(
  channelName: string
): Promise<KickChannelInfo> {
  const response = await fetch(
    `https://kick.com/api/v2/channels/${channelName}`,
    {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'overlay-backend'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`Kick API error: ${response.status}`)
  }

  const data = (await response.json()) as KickChannelInfo

  if (typeof data.id !== 'number' || typeof data.user_id !== 'number') {
    throw new Error('Invalid Kick API response shape')
  }

  return {
    id: data.id,
    user_id: data.user_id
  }
}
