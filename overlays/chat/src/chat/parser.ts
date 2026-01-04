import { kickEmotes, sevenTvEmotes } from '../emotes/registry'
import type { ParsedPart } from '../emotes/types'

export function parseMessage(message: string): ParsedPart[] {
  const tokens = message.split(/\s+/)
  const result: ParsedPart[] = []

  for (const token of tokens) {
    const emote = sevenTvEmotes.get(token) ?? kickEmotes.get(token)

    if (emote) {
      result.push({ type: 'emote', emote })
    } else {
      result.push({ type: 'text', value: token })
    }
  }

  return result
}
