import { sevenTvEmotes } from './registry'
import type { Emote } from './types'

type SevenTvUserResponse = {
  emote_set?: {
    id: string
  }
}

type SevenTvSetResponse = {
  emotes: {
    name: string
    data: {
      host: {
        url: string
      }
    }
  }[]
}

export async function load7TVChannelEmotes(
  kickChannelId: number
): Promise<void> {
  const userRes = await fetch(`https://7tv.io/v3/users/kick/${kickChannelId}`)

  if (!userRes.ok) return

  const userData: SevenTvUserResponse = await userRes.json()
  if (!userData.emote_set) return

  const setRes = await fetch(
    `https://7tv.io/v3/emote-sets/${userData.emote_set.id}`
  )

  if (!setRes.ok) return

  const setData: SevenTvSetResponse = await setRes.json()

  for (const e of setData.emotes) {
    const emote: Emote = {
      name: e.name,
      provider: '7tv',
      urls: {
        x1: `${e.data.host.url}/1x.webp`,
        x2: `${e.data.host.url}/2x.webp`,
        x3: `${e.data.host.url}/3x.webp`
      }
    }

    sevenTvEmotes.set(e.name, emote)
  }
}
