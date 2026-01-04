import { OVERLAY_CHAT_PORT, OVERLAY_TERMINAL_PORT } from '@custom/shared'

export const ALLOWED_ORIGINS = new Set<string>([
  'https://overlay.chat.krouskystepan.com',
  'https://overlay.terminal.krouskystepan.com'
])

//? INFO: Add overlays
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.add(`http://localhost:${OVERLAY_TERMINAL_PORT}`)
  ALLOWED_ORIGINS.add(`http://localhost:${OVERLAY_CHAT_PORT}`)
}
