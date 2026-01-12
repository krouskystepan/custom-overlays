import type { Request, Response } from 'express'
import { fetchKickChannel } from '../kick/channel'

export async function getKickChannel(
  req: Request<{ channelName: string }>,
  res: Response
): Promise<void> {
  try {
    const { channelName } = req.params

    if (!channelName) {
      res.status(400).json({ error: 'Missing channel name' })
      return
    }

    const channel = await fetchKickChannel(channelName)

    res.json(channel)
  } catch (err) {
    res.status(502).json({
      error: 'Failed to fetch Kick channel'
    })
  }
}
