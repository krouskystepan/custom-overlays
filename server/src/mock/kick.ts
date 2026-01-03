import type { Request, Response } from 'express'
import { mapKickEvent } from '../kick/mapEvent'
import { broadcast } from '../ws'

export function mockKick(req: Request, res: Response) {
  const eventType = req.headers['kick-event-type'] as string
  const event = mapKickEvent(req.body, eventType)

  if (event) {
    broadcast(event)
  }

  res.json({ ok: true })
}
