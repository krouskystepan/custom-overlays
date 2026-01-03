import { createClient } from '@retconned/kick-js'
import type { ChatOverlayEvent } from '@custom/shared'

export async function startKickChat(
  channel: string,
  broadcast: (event: ChatOverlayEvent) => void
) {
  const client = createClient(channel, {
    readOnly: true,
    logger: false
  })

  client.on('ChatMessage', (msg) => {
    broadcast({
      type: 'message',
      content: msg.content,
      created_at: msg.created_at,
      sender: {
        id: msg.sender.id,
        username: msg.sender.username,
        slug: msg.sender.channel_slug,
        identity: {
          color: msg.sender.identity?.color ?? '#ffffff',
          badges:
            msg.sender.identity?.badges?.map(
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

  console.log(
    `✅ Kick chat client initialized ${process.env.KICK_CHANNEL_NAME}`
  )
}
