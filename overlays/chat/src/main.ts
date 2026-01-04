import { CHANNEL_NAME, type ChatOverlayEvent } from '@custom/shared'
import { renderMessage } from './chat/renderer'
import { loadKickEmotes } from './emotes/loadKick'
import { load7TVChannelEmotes } from './emotes/load7tvChannel'

async function start(): Promise<void> {
  const WS_URL = import.meta.env.VITE_BACKEND_WS_URL as string
  if (!WS_URL) {
    throw new Error('VITE_BACKEND_WS_URL is not defined')
  }

  const channelRes = await fetch(
    `https://kick.com/api/v2/channels/${CHANNEL_NAME}`
  )

  if (!channelRes.ok) {
    throw new Error('Failed to load Kick channel')
  }

  const channel: { id: number; user_id: number } = await channelRes.json()

  await Promise.all([loadKickEmotes(), load7TVChannelEmotes(channel.user_id)])

  const ws = new WebSocket(WS_URL)

  ws.addEventListener('message', (e) => {
    const data = JSON.parse(e.data)

    if (data.type !== 'message') return

    renderMessage(data as ChatOverlayEvent)
  })
}

window.addEventListener('DOMContentLoaded', () => {
  void start()
})
