import { AlertOverlayEvent } from '@custom/shared'
import { CONFIG } from './config'
import { enqueue } from './render'

function start() {
  const API_URL = import.meta.env.VITE_BACKEND_HTTP_URL as string

  if (!API_URL) {
    throw new Error('VITE_BACKEND_HTTP_URL is not defined')
  }

  const es = new EventSource(`${API_URL}/events`)

  es.addEventListener('message', (e) => {
    const data = JSON.parse(e.data) as AlertOverlayEvent

    if (!CONFIG.listen[data.type]) return

    enqueue(data)
  })

  es.addEventListener('error', () => {
    console.warn('[SSE] connection lost, browser will retry')
  })
}

window.addEventListener('DOMContentLoaded', start)
