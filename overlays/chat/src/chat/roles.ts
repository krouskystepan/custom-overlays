import type { ChatOverlayEvent } from '@custom/shared'

export function resolveRole(event: ChatOverlayEvent): string | null {
  const badges = event.sender.identity.badges

  if (badges.some((b) => b.type === 'broadcaster')) return 'broadcaster'
  if (badges.some((b) => b.type === 'moderator')) return 'mod'
  if (badges.some((b) => b.type === 'subscriber')) return 'sub'

  return null
}
