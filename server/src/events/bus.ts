import type { AlertOverlayEvent, ChatOverlayEvent } from '@custom/shared'

export type OverlayEvent = AlertOverlayEvent | ChatOverlayEvent
type Subscriber = (event: OverlayEvent) => void

const subscribers = new Set<Subscriber>()

export function publish(event: OverlayEvent) {
  for (const sub of subscribers) {
    try {
      sub(event)
    } catch (err) {
      console.error('[EVENT BUS] subscriber error', err)
    }
  }
}

export function subscribe(fn: Subscriber) {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}
