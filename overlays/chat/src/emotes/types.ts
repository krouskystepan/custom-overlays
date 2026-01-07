export type EmoteProvider = 'kick' | '7tv'

export type Emote = {
  name: string
  provider: EmoteProvider
  urls: {
    x1: string
    x2: string
    x3: string
  }
}

export type ParsedPart =
  | { type: 'text'; value: string }
  | { type: 'emote'; emote: Emote }

export type KickMessageEmote = {
  id: number
  name: string
  start: number
  end: number
}

export type KickChatMessage = {
  content: string
  emotes?: KickMessageEmote[]
}
