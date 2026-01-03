import type { AlertOverlayEvent } from '@custom/shared'

export function mapKickEvent(
  payload: any,
  eventType: string
): AlertOverlayEvent | null {
  switch (eventType) {
    case 'channel.followed': {
      return {
        type: 'follower',
        name: payload.follower?.username ?? 'Unknown'
      }
    }

    case 'channel.subscription.new': {
      return {
        type: 'subscriber',
        name: payload.subscriber?.username ?? 'Unknown',
        months: payload.duration ?? 1
      }
    }

    case 'channel.subscription.renewal': {
      return {
        type: 'subscriber',
        name: payload.subscriber?.username ?? 'Unknown',
        months: payload.duration
      }
    }

    case 'channel.subscription.gifts': {
      return {
        type: 'subscriber',
        name: payload.gifter?.username ?? 'Anonymous',
        gifted: true,
        amount: Array.isArray(payload.giftees) ? payload.giftees.length : 1,
        gifter: payload.gifter?.username ?? undefined
      }
    }

    case 'kicks.gifted': {
      return {
        type: 'tip',
        name: payload.sender?.username ?? 'Anonymous',
        amount: payload.gift?.amount ?? 0,
        message: payload.gift?.message
      }
    }

    default:
      return null
  }
}
