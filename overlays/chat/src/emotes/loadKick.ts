import { kickEmotes } from './registry'
import type { Emote } from './types'

type KickEmoteJson = Record<
  string,
  {
    x1: string
    x2: string
    x3: string
  }
>

export async function loadKickEmotes(): Promise<void> {
  const res = await fetch('/kick-emotes.json')
  if (!res.ok) return

  const data: KickEmoteJson = await res.json()

  for (const [name, urls] of Object.entries(data)) {
    const emote: Emote = {
      name,
      provider: 'kick',
      urls
    }

    kickEmotes.set(name, emote)
  }
}
