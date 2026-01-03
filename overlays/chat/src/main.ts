import type { ChatOverlayEvent } from '@custom/shared'

const MAX_LINES = 50

function formatTime(date: Date | string) {
  const d = new Date(date)
  return d.toTimeString().slice(0, 8)
}

function resolveRole(event: ChatOverlayEvent): string | null {
  const badges = event.sender.identity.badges

  if (badges.some((b) => b.type === 'broadcaster')) return 'broadcaster'
  if (badges.some((b) => b.type === 'moderator')) return 'mod'
  if (badges.some((b) => b.type === 'subscriber')) return 'sub'

  return null
}

function renderMessage(event: ChatOverlayEvent) {
  const chat = document.getElementById('chat')
  if (!chat) return

  const line = document.createElement('div')
  line.className = 'line'

  const role = resolveRole(event)
  if (role) {
    line.classList.add(`role-${role}`)
  }

  const username = document.createElement('span')
  username.className = 'username'
  username.textContent = `<${event.sender.username}>`
  username.style.color = event.sender.identity.color || '#ffffff'

  const message = document.createElement('span')
  message.className = 'message'
  message.textContent = event.content

  line.append(username, message)
  chat.appendChild(line)

  while (chat.children.length > MAX_LINES) {
    chat.removeChild(chat.firstChild!)
  }
}

function start() {
  const WS_URL = import.meta.env.VITE_BACKEND_WS_URL as string
  if (!WS_URL) throw new Error('VITE_BACKEND_WS_URL is not defined')

  const ws = new WebSocket(WS_URL)

  ws.addEventListener('open', async () => {
    console.log('[chat] WS connected')

    const res = await fetch('https://kick.com/api/v2/channels/heddi')

    if (!res.ok) {
      throw new Error('Request failed')
    }

    const data = await res.json()
    console.log(data)
  })

  ws.addEventListener('close', (e) => {
    console.log('[terminal] WS closed', 'code:', e.code, 'reason:', e.reason)
  })

  ws.addEventListener('message', (e) => {
    const data = JSON.parse(e.data)

    console.log(data)

    if (data.type !== 'message') return

    renderMessage(data as ChatOverlayEvent)
  })
}

window.addEventListener('DOMContentLoaded', start)
