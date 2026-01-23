import { CHANNEL_NAME, type ChatOverlayEvent } from '@custom/shared'
import { renderMessage } from './chat/renderer'
import { load7TVGlobalEmotes, load7TVChannelEmotes } from './emotes/load7tv'

async function start(): Promise<void> {
  const API_URL = import.meta.env.VITE_BACKEND_HTTP_URL as string
  if (!API_URL) {
    throw new Error('VITE_BACKEND_HTTP_URL is not defined')
  }

  const channelRes = await fetch(`${API_URL}/api/kick/channel/${CHANNEL_NAME}`)
  if (!channelRes.ok) {
    throw new Error('Failed to load Kick channel')
  }

  const channel: { id: number; user_id: number } = await channelRes.json()

  await Promise.all([
    load7TVGlobalEmotes(),
    load7TVChannelEmotes(channel.user_id)
  ])

  const es = new EventSource(`${API_URL}/events`)

  es.addEventListener('message', (e) => {
    const data = JSON.parse(e.data)

    if (data.type !== 'message') return

    renderMessage(data as ChatOverlayEvent)
  })

  es.addEventListener('error', () => {
    console.warn('[SSE] connection lost, browser will retry')
  })
}

window.addEventListener('DOMContentLoaded', () => {
  void start()
})
