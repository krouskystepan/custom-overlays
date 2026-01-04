import type { ChatOverlayEvent } from '@custom/shared'
import type { Badge, SubscriptionBadge, SystemBadge } from './types'

const SYSTEM_BADGE_URLS: Record<SystemBadge, string> = {
  broadcaster: '/broadcaster.svg',
  moderator: '/moderator.svg',
  vip: '/vip.svg',
  founder: '/founder.svg',
  og: '/og.svg',
  staff: '/staff.svg',
  verified: '/verified.svg',
  sidekick: '/sidekick.svg',
  trainwreckstv: '/trainwreckstv.svg',
  subGifter: '/subGifter.svg',
  subGifter25: '/subGifter25.svg',
  subGifter50: '/subGifter50.svg',
  subGifter100: '/subGifter100.svg',
  subGifter200: '/subGifter200.svg'
}

type RawBadge = ChatOverlayEvent['sender']['identity']['badges'][number]

function isSubscriptionBadge(badge: RawBadge): badge is SubscriptionBadge {
  return (
    badge.type === 'subscriber' &&
    typeof (badge as unknown as { image_url?: unknown }).image_url === 'string'
  )
}

function isSystemBadgeType(type: string): type is SystemBadge {
  return type in SYSTEM_BADGE_URLS
}

export function resolveBadges(event: ChatOverlayEvent): Badge[] {
  const result: Badge[] = []

  for (const badge of event.sender.identity.badges) {
    // SUB badge (Kick image_url)
    if (isSubscriptionBadge(badge)) {
      result.push({
        type: 'subscription',
        url: badge.image_url
      })
      continue
    }

    // SYSTEM badge (lokální SVG)
    if (isSystemBadgeType(badge.type)) {
      result.push({
        type: 'system',
        role: badge.type,
        url: SYSTEM_BADGE_URLS[badge.type]
      })
    }
  }

  return result
}
