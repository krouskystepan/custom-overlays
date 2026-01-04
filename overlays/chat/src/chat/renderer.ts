import type { ChatOverlayEvent } from '@custom/shared'
import { parseMessage } from './parser'
import { resolveBadges } from '../badges/resolveBadges'

const MAX_LINES = 50

export function renderMessage(event: ChatOverlayEvent): void {
  const chat = document.getElementById('chat')
  if (!chat) return

  const line = document.createElement('div')
  line.className = 'line'

  // BADGES
  const badges = resolveBadges(event)
  for (const badge of badges) {
    const img = document.createElement('img')
    img.src = badge.url
    img.className = 'badge'
    img.alt = badge.type === 'system' ? badge.role : 'sub'
    line.append(img)
  }

  // USERNAME
  const username = document.createElement('span')
  username.className = 'username'
  username.textContent = `<${event.sender.username}>`
  username.style.color = event.sender.identity.color || '#ffffff'

  // MESSAGE
  const message = document.createElement('span')
  message.className = 'message'

  const parts = parseMessage(event.content)

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]

    if (part.type === 'text') {
      message.append(document.createTextNode(part.value))
    } else {
      const img = document.createElement('img')
      img.src = part.emote.urls.x2
      img.alt = part.emote.name
      img.className = 'emote'
      message.append(img)
    }

    if (i < parts.length - 1) {
      message.append(document.createTextNode(' '))
    }
  }

  line.append(username, message)
  chat.appendChild(line)

  while (chat.children.length > MAX_LINES) {
    chat.removeChild(chat.firstChild!)
  }
}
