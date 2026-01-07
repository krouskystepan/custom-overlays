import type { ParsedPart, Emote } from '../emotes/types'
import { sevenTvEmotes, kickEmotes } from '../emotes/registry'

const KICK_EMOTE_REGEX = /\[emote:(\d+):([^\]]+)\]/g

function parseTextFallback(text: string): ParsedPart[] {
  const parts: ParsedPart[] = []
  const tokens = text.split(/(\s+)/)

  for (const token of tokens) {
    if (sevenTvEmotes.has(token)) {
      parts.push({
        type: 'emote',
        emote: sevenTvEmotes.get(token)!
      })
      continue
    }

    if (kickEmotes.has(token)) {
      parts.push({
        type: 'emote',
        emote: kickEmotes.get(token)!
      })
      continue
    }

    parts.push({
      type: 'text',
      value: token
    })
  }

  return parts
}

export function parseMessage(content: string): ParsedPart[] {
  const parts: ParsedPart[] = []

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = KICK_EMOTE_REGEX.exec(content)) !== null) {
    const [raw, id, name] = match
    const start = match.index

    if (start > lastIndex) {
      parts.push(...parseTextFallback(content.slice(lastIndex, start)))
    }

    const emote: Emote = {
      name,
      provider: 'kick',
      urls: {
        x1: `https://files.kick.com/emotes/${id}/fullsize`,
        x2: `https://files.kick.com/emotes/${id}/fullsize`,
        x3: `https://files.kick.com/emotes/${id}/fullsize`
      }
    }

    parts.push({ type: 'emote', emote })

    lastIndex = start + raw.length
  }

  if (lastIndex < content.length) {
    parts.push(...parseTextFallback(content.slice(lastIndex)))
  }

  return parts
}
