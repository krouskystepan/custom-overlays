import crypto from 'crypto'
import type { AlertOverlayEvent } from '@custom/shared'
import { mapKickEvent } from './mapEvent'

const KICK_PUBLIC_KEY = process.env.KICK_PUBLIC_KEY?.replace(/\\n/g, '\n')

if (!KICK_PUBLIC_KEY) {
  throw new Error('Missing KICK_PUBLIC_KEY')
}

export const kickWebhook = {
  verify(req: any, _: any, buf: Buffer) {
    req.rawBody = buf
  },

  handler:
    (broadcast: (e: AlertOverlayEvent) => void) => (req: any, res: any) => {
      const signature = req.headers['kick-event-signature'] as string
      const messageId = req.headers['kick-event-message-id'] as string
      const timestamp = req.headers['kick-event-message-timestamp'] as string

      if (!signature || !messageId || !timestamp) {
        console.warn('❌ Missing signature headers')
        return res.status(401).end()
      }

      const signedPayload = `${messageId}.${timestamp}.${req.rawBody.toString(
        'utf8'
      )}`

      const isValid = crypto.verify(
        'RSA-SHA256',
        Buffer.from(signedPayload, 'utf8'),
        KICK_PUBLIC_KEY,
        Buffer.from(signature, 'base64')
      )

      if (!isValid) {
        console.warn('❌ Invalid signature')
        return res.status(401).end()
      }

      const eventType = req.headers['kick-event-type'] as string
      const event = mapKickEvent(req.body, eventType)

      if (event) {
        broadcast(event)
      }

      res.status(200).end()
    }
}
