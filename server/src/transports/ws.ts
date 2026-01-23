import { WebSocketServer, WebSocket } from 'ws'
import type { Server as HTTPServer } from 'http'
import { ALLOWED_ORIGINS } from '../config/security'
import { subscribe } from '../events/bus'

type Client = WebSocket
const clients = new Set<Client>()

export function initWS(httpServer: HTTPServer) {
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/ws'
  })

  wss.on('connection', (ws, req) => {
    const origin = req.headers.origin

    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      ws.close(1008, 'Invalid origin')
      return
    }

    clients.add(ws)
    console.log('[WS] client connected')

    ws.on('close', () => {
      clients.delete(ws)
      console.log('[WS] client disconnected')
    })

    ws.on('error', () => {
      clients.delete(ws)
    })
  })

  subscribe((event) => {
    const payload = JSON.stringify(event)

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload)
      }
    }
  })
}
