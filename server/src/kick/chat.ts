import WebSocket from 'ws'
import { type ChatOverlayEvent } from '@custom/shared'

let activeSocket: WebSocket | null = null
let reconnectTimer: NodeJS.Timeout | null = null
let pingInterval: NodeJS.Timeout | null = null

const RECONNECT_DELAY_MS = 5_000
const PING_INTERVAL_MS = 60_000

async function getChatroomId(channel: string): Promise<number> {
  const res = await fetch(`https://kick.com/api/v2/channels/${channel}`, {
    headers: {
      accept: 'application/json',
      'user-agent': 'Mozilla/5.0 (compatible; CustomOverlay/1.0)'
    }
  })

  if (!res.ok) {
    throw new Error(`Failed to load Kick channel ${channel} (${res.status})`)
  }

  const data: { chatroom?: { id: number } } = await res.json()

  if (!data.chatroom?.id) {
    throw new Error('chatroom_id not found')
  }

  return data.chatroom.id
}

function scheduleReconnect(
  channel: string,
  broadcast: (event: ChatOverlayEvent) => void
) {
  if (reconnectTimer) return

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    startKickChat(channel, broadcast).catch((err) => {
      console.error('[Kick chat reconnect failed]', err)
    })
  }, RECONNECT_DELAY_MS)
}

export async function startKickChat(
  channel: string,
  broadcast: (event: ChatOverlayEvent) => void
) {
  if (activeSocket) {
    activeSocket.removeAllListeners()
    activeSocket.terminate()
    activeSocket = null
  }

  if (pingInterval) {
    clearInterval(pingInterval)
    pingInterval = null
  }

  const CHATROOM_ID = await getChatroomId(channel)

  const ws = new WebSocket(
    'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=7.6.0&flash=false'
  )

  activeSocket = ws

  ws.on('open', () => {
    console.log(`✅ Connected to Kick Chat WS: ${channel}`)

    ws.send(
      JSON.stringify({
        event: 'pusher:subscribe',
        data: {
          channel: `chatrooms.${CHATROOM_ID}.v2`
        }
      })
    )

    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping()
      }
    }, PING_INTERVAL_MS)
  })

  ws.on('message', (raw) => {
    let payload: { event?: string; data?: string }

    try {
      payload = JSON.parse(raw.toString())
    } catch {
      return
    }

    if (payload.event !== 'App\\Events\\ChatMessageEvent') return
    if (!payload.data) return

    let data: {
      content: string
      created_at: string
      sender: {
        id: number
        username: string
        slug: string
        identity?: {
          color?: string
          badges?: Array<{
            type: string
            text: string
            count?: number
          }>
        }
      }
    }

    try {
      data = JSON.parse(payload.data)
    } catch {
      return
    }

    broadcast({
      type: 'message',
      content: data.content,
      created_at: new Date(data.created_at),
      sender: {
        id: data.sender.id,
        username: data.sender.username,
        slug: data.sender.slug,
        identity: {
          color: data.sender.identity?.color ?? '#ffffff',
          badges:
            data.sender.identity?.badges?.map((b) => ({
              type: b.type,
              text: b.text,
              count: b.count ?? 1
            })) ?? []
        }
      }
    })
  })

  ws.on('close', (code, reason) => {
    console.error('[Kick chat WS closed]', code, reason.toString())

    if (pingInterval) {
      clearInterval(pingInterval)
      pingInterval = null
    }

    activeSocket = null
    scheduleReconnect(channel, broadcast)
  })

  ws.on('error', (err) => {
    console.error('[Kick chat WS error]', err)

    if (pingInterval) {
      clearInterval(pingInterval)
      pingInterval = null
    }

    activeSocket = null
    scheduleReconnect(channel, broadcast)
  })
}
