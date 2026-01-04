import type { Request, Response } from 'express'
import type { AlertOverlayEvent } from '@custom/shared'

const SE_SECRET = process.env.STREAMELEMENTS_WEBHOOK_SECRET

if (!SE_SECRET) {
  throw new Error('Missing STREAMELEMENTS_WEBHOOK_SECRET')
}

export const streamelementsWebhook = {
  verify(req: Request & { rawBody?: Buffer }, _: unknown, buf: Buffer) {
    req.rawBody = buf
  },

  handler:
    (broadcast: (event: AlertOverlayEvent) => void) =>
    (req: Request, res: Response) => {
      const token =
        req.headers['x-se-token'] ??
        req.headers['authorization'] ??
        req.query.token

      if (token !== SE_SECRET) {
        console.warn('❌ StreamElements invalid token')
        return res.sendStatus(401)
      }

      const body = req.body

      if (
        body?.event?.listener !== 'tip-latest' ||
        body?.event?.event?.type !== 'tip'
      ) {
        return res.sendStatus(200)
      }

      broadcast(body.event.event as AlertOverlayEvent)
      return res.sendStatus(200)
    }
}
