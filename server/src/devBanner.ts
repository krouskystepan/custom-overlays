const EMPTY = ' '

export function printDevBanner() {
  console.log(
    [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '🚀  Custom Overlays — DEV',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '🌐  Backend (HTTP)',
      `    http://localhost:${process.env.HTTP_PORT}`,
      EMPTY,
      '🔌  Backend (WebSocket)',
      `    ws://localhost:${process.env.HTTP_PORT}/ws`,
      EMPTY,
      '👀  Overlays',
      `    Terminal   →  http://localhost:${process.env.OVERLAY_TERMINAL_PORT}`,
      `    Chat       →  http://localhost:${process.env.OVERLAY_CHAT_PORT}`,
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    ].join('\n')
  )
}
