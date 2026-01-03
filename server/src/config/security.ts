export const ALLOWED_ORIGINS = new Set<string>([
  'https://overlay.chat.krouskystepan.com',
  'https://overlay.terminal.krouskystepan.com'
])

if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.add(`http://localhost:${process.env.OVERLAY_TERMINAL_PORT}`)
  ALLOWED_ORIGINS.add(`http://localhost${process.env.OVERLAY_CHAT_PORT}`)
}
