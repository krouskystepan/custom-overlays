import type { ParsedPart, Emote } from '../emotes/types'
import { sevenTvEmotes, kickEmotes } from '../emotes/registry'

function getEmote(name: string): Emote | null {
  // prio: 7TV > Kick
  return sevenTvEmotes.get(name) ?? kickEmotes.get(name) ?? null
}

function isEmote(token: string): token is string {
  return sevenTvEmotes.has(token) || kickEmotes.has(token)
}

export function parseMessage(input: string): ParsedPart[] {
  const result: ParsedPart[] = []
  let buffer = ''

  const tokens = input.split(/(\s+)/)

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    const prev = tokens[i - 1]
    const next = tokens[i + 1]

    const isWhitespace = /^\s+$/.test(token)

    if (isWhitespace && prev && next && isEmote(prev) && isEmote(next)) {
      continue
    }

    if (isEmote(token)) {
      if (buffer.length > 0) {
        result.push({ type: 'text', value: buffer })
        buffer = ''
      }

      const emote = getEmote(token)
      if (emote) {
        result.push({ type: 'emote', emote })
      } else {
        buffer += token
      }
    } else {
      buffer += token
    }
  }

  if (buffer.length > 0) {
    result.push({ type: 'text', value: buffer })
  }

  return result
}
