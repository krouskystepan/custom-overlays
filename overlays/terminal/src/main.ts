import { AlertOverlayEvent } from '@custom/shared'
import { CONFIG } from './config'
import { enqueue } from './render'

function start() {
  const WS_URL = import.meta.env.VITE_BACKEND_WS_URL as string

  if (!WS_URL) {
    throw new Error('VITE_BACKEND_WS_URL is not defined')
  }

  const ws = new WebSocket(WS_URL)

  ws.addEventListener('open', () => {
    console.log('[terminal] WS connected')
  })

  ws.addEventListener('close', (e) => {
    console.log('[terminal] WS closed', 'code:', e.code, 'reason:', e.reason)
  })

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data) as AlertOverlayEvent
    console.log('[terminal] EVENT', data)

    if (!CONFIG.listen[data.type]) return

    enqueue(data)
  })
}

window.addEventListener('DOMContentLoaded', start)
