import { OVERLAY_CHAT_PORT, OVERLAY_TERMINAL_PORT } from '@custom/shared'
import type { CorsOptions } from 'cors'

export const ALLOWED_ORIGINS = new Set<string>([
  'https://overlay.chat.krouskystepan.com',
  'https://overlay.terminal.krouskystepan.com'
])

//? INFO: Add overlays
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.add(`http://localhost:${OVERLAY_TERMINAL_PORT}`)
  ALLOWED_ORIGINS.add(`http://localhost:${OVERLAY_CHAT_PORT}`)
}

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) {
    return true
  }

  return ALLOWED_ORIGINS.has(origin)
}

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`CORS blocked origin: ${origin}`))
  },
  methods: ['GET', 'POST'],
  credentials: false
}
