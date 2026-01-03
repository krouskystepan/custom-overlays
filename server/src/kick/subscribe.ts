import 'dotenv/config'
import { getKickAccessToken } from './token/token'

export async function subscribeToKickEvents() {
  const token = await getKickAccessToken()

  const res = await fetch(
    'https://api.kick.com/public/v1/events/subscriptions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events: [
          { name: 'channel.followed', version: 1 },
          { name: 'channel.subscription.new', version: 1 },
          { name: 'channel.subscription.renewal', version: 1 },
          { name: 'channel.subscription.gifts', version: 1 },
          { name: 'kicks.gifted', version: 1 }
        ],
        method: 'webhook',
        webhook: {
          url: `${process.env.PUBLIC_URL}/kick/events`
          // secret: process.env.KICK_WEBHOOK_SECRET
        }
      })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    console.error('❌ Subscribe failed:', data)
    throw new Error('Kick subscribe failed')
  }

  console.log(
    '✅ Kick events subscribed:',
    data.data
      .map((e: { name: string; version: number }) => `${e.name}@v${e.version}`)
      .join(' | ')
  )
}
