import WebSocket from 'ws'
import { type ChatOverlayEvent } from '@custom/shared'

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

  const data: {
    chatroom?: { id: number }
  } = await res.json()

  if (!data.chatroom?.id) {
    throw new Error('chatroom_id not found')
  }

  return data.chatroom.id
}

export async function startKickChat(
  channel: string,
  broadcast: (event: ChatOverlayEvent) => void
) {
  const CHATROOM_ID = await getChatroomId(channel)

  const ws = new WebSocket(
    'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=7.6.0&flash=false'
  )

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
  })

  ws.on('message', (raw) => {
    const payload = JSON.parse(raw.toString())

    if (payload.event !== 'App\\Events\\ChatMessageEvent') return

    const data = JSON.parse(payload.data)

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
            data.sender.identity?.badges?.map(
              (
                b: ChatOverlayEvent['sender']['identity']['badges'][number]
              ) => ({
                type: b.type,
                text: b.text,
                count: b.count
              })
            ) ?? []
        }
      }
    })
  })
}
