import type { Request, Response } from 'express'
import { subscribe } from '../events/bus'

const clients = new Set<Response>()

export function initSSE() {
  subscribe((event) => {
    const payload = `data: ${JSON.stringify(event)}\n\n`

    for (const res of clients) {
      try {
        const ok = res.write(payload)
        if (!ok) {
          clients.delete(res)
        }
      } catch {
        clients.delete(res)
      }
    }
  })
}

export function handleSSE(req: Request, res: Response) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Encoding': 'identity'
  })

  res.flushHeaders?.()

  clients.add(res)

  res.write('retry: 3000\n')
  res.write(': connected\n\n')

  const heartbeat = setInterval(() => {
    try {
      res.write(': keepalive\n\n')
    } catch {
      clearInterval(heartbeat)
      clients.delete(res)
    }
  }, 25_000)

  req.on('close', () => {
    clearInterval(heartbeat)
    clients.delete(res)
  })
}
