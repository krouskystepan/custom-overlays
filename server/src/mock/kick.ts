import type { Request, Response } from 'express'
import { mapKickEvent } from '../kick/mapEvent'
import { publish } from '../events/bus'

export function mockKick(req: Request, res: Response) {
  const eventType = req.headers['kick-event-type'] as string
  const event = mapKickEvent(req.body, eventType)

  if (event) {
    publish(event)
  }

  res.json({ ok: true })
}
