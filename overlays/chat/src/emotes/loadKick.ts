import { kickEmotes } from './registry'
import type { Emote } from './types'
import { CHANNEL_NAME } from '@custom/shared'

type KickEmoteGroup = {
  name: string
  id: string
  emotes: {
    id: number
    name: string
    subscribers_only: boolean
    channel_id: number | null
  }[]
}

export async function loadKickEmotes(): Promise<void> {
  const res = await fetch(`https://kick.com/emotes/${CHANNEL_NAME}`, {
    headers: {
      accept: 'application/json'
    }
  })

  if (!res.ok) {
    return
  }

  const data: unknown = await res.json()

  if (!Array.isArray(data)) {
    return
  }

  const groups = data as KickEmoteGroup[]

  for (const group of groups) {
    if (
      group.name !== 'Global' &&
      group.name !== 'Channel' &&
      group.name !== 'Emojis'
    ) {
      continue
    }

    for (const e of group.emotes) {
      const emote: Emote = {
        name: e.name,
        provider: 'kick',
        urls: {
          x1: `https://files.kick.com/emotes/${e.id}/fullsize`,
          x2: `https://files.kick.com/emotes/${e.id}/fullsize`,
          x3: `https://files.kick.com/emotes/${e.id}/fullsize`
        }
      }

      kickEmotes.set(e.name, emote)
    }
  }
}
