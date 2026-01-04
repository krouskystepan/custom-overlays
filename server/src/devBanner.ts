import {
  OVERLAY_CHAT_PORT,
  OVERLAY_TERMINAL_PORT,
  SERVER_HTTP_PORT
} from '@custom/shared'

const EMPTY = ' '

export function printDevBanner() {
  console.log(
    [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '🚀  Custom Overlays — DEV',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '🌐  Backend (HTTP)',
      `    http://localhost:${SERVER_HTTP_PORT}`,
      EMPTY,
      '🔌  Backend (WebSocket)',
      `    ws://localhost:${SERVER_HTTP_PORT}/ws`,
      EMPTY,
      '👀  Overlays',
      `    Terminal   →  http://localhost:${OVERLAY_TERMINAL_PORT}`,
      `    Chat       →  http://localhost:${OVERLAY_CHAT_PORT}`,
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    ].join('\n')
  )
}
