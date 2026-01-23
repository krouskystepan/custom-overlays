import type { Request, Response } from 'express'
import { subscribe } from '../events/bus'

const clients = new Set<Response>()

export function initSSE() {
  subscribe((event) => {
    const payload = `data: ${JSON.stringify(event)}\n\n`
    for (const res of clients) {
      res.write(payload)
    }
  })
}

export function handleSSE(req: Request, res: Response) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  })

  clients.add(res)
  res.write(': connected\n\n')

  const heartbeat = setInterval(() => {
    res.write(': keepalive\n\n')
  }, 25_000)

  req.on('close', () => {
    clearInterval(heartbeat)
    clients.delete(res)
  })
}
