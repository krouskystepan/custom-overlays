export type AlertOverlayEvent = FollowEvent | SubEvent | TipEvent

export interface BaseEvent {
  type: 'follower' | 'subscriber' | 'tip'
  name: string
  message?: string
}

export interface FollowEvent extends BaseEvent {
  type: 'follower'
}

export interface SubEvent extends BaseEvent {
  type: 'subscriber'
  amount?: number
  months?: number
  gifted?: boolean
  gifter?: string
}

export interface TipEvent extends BaseEvent {
  type: 'tip'
  amount: number
  currency?: string
}

export type ChatOverlayEvent = {
  content: string
  type: 'message'
  created_at: Date
  sender: {
    id: number
    username: string
    slug: string
    identity: {
      color: string
      badges: { type: string; text: string; count: number }[]
    }
  }
}
