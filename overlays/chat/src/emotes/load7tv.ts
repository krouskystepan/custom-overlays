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

async function load7TVEmoteSet(setId: string): Promise<void> {
  const res = await fetch(`https://7tv.io/v3/emote-sets/${setId}`)

  if (!res.ok) return

  const data: SevenTvSetResponse = await res.json()

  for (const e of data.emotes) {
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

export async function load7TVGlobalEmotes(): Promise<void> {
  await load7TVEmoteSet('global')
}

export async function load7TVChannelEmotes(
  kickChannelId: number
): Promise<void> {
  const userRes = await fetch(`https://7tv.io/v3/users/kick/${kickChannelId}`)

  if (!userRes.ok) return

  const userData: SevenTvUserResponse = await userRes.json()
  if (!userData.emote_set) return

  await load7TVEmoteSet(userData.emote_set.id)
}
