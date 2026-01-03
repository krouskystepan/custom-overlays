import crypto from 'crypto'
import type { Request, Response, NextFunction } from 'express'

export function verifyWebhook(
  req: Request & { rawBody?: Buffer },
  res: Response,
  next: NextFunction
) {
  const signature = req.headers['x-signature'] as string
  const timestamp = req.headers['x-timestamp'] as string

  if (!signature || !timestamp) {
    return res.status(401).end()
  }

  const payload = `${timestamp}.${req.rawBody?.toString('utf8') ?? ''}`

  const expected = crypto
    .createHmac('sha256', process.env.INTERNAL_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex')

  if (signature !== expected) {
    console.warn('❌ Invalid internal webhook signature')
    return res.status(401).end()
  }

  next()
}
