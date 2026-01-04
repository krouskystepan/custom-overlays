export type SystemBadge =
  | 'broadcaster'
  | 'moderator'
  | 'vip'
  | 'founder'
  | 'og'
  | 'staff'
  | 'verified'
  | 'sidekick'
  | 'trainwreckstv'
  | 'subGifter'
  | 'subGifter25'
  | 'subGifter50'
  | 'subGifter100'
  | 'subGifter200'

export type SubscriptionBadge = {
  type: 'subscriber'
  text: string
  count: number
  image_url: string
}

export type Badge =
  | {
      type: 'system'
      role: SystemBadge
      url: string
    }
  | {
      type: 'subscription'
      url: string
    }
