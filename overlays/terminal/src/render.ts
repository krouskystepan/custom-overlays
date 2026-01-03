import type { AlertOverlayEvent } from '@custom/shared'
import { CONFIG } from './config'

// States

let hideTimeout: number | undefined

const queue: AlertOverlayEvent[] = []
let isRendering = false

// Public API

function finishRender() {
  isRendering = false
  processQueue()
}

function renderInternal(event: AlertOverlayEvent) {
  clearTimeout(hideTimeout)
  show()

  setAnimatedText('command', CONFIG.command)
  setAnimatedText('action', resolveAction(event.type))
  setAnimatedText('name', event.name)

  const { result, extra } = buildResult(event)
  setText('result', result)
  setText('extra', extra)

  hideTimeout = window.setTimeout(() => {
    hide()
    finishRender()
  }, CONFIG.durationMs)
}

// Result logic

function buildResult(event: AlertOverlayEvent): {
  result: string
  extra: string
} {
  // FOLLOW
  if (event.type === 'follower') {
    return {
      result: CONFIG.resultText || '✔ follow',
      extra: ''
    }
  }

  // SUB
  if (event.type === 'subscriber') {
    if (event.gifted && event.gifter) {
      return {
        result: `✔ ${event.gifter} gifted ${
          event.amount === 1 ? 'a sub' : `${event.amount} subs`
        }`,
        extra: ''
      }
    }

    let result = '✔ subscribed'

    if (typeof event.months === 'number') {
      result = `✔ subscribed (${event.months} ${
        event.months === 1 ? 'month' : 'months'
      })`
    }

    return {
      result,
      extra: event.message ?? ''
    }
  }

  // TIP
  if (event.type === 'tip') {
    let result = '✔ donated'

    if (event.amount) {
      result = `✔ donated ${event.amount} ${event.currency ?? ''}`.trim()
    }

    return {
      result,
      extra: event.message ?? ''
    }
  }

  return {
    result: CONFIG.resultText || '✔ success',
    extra: ''
  }
}

// Helpers

function processQueue() {
  if (isRendering) return
  const next = queue.shift()
  if (!next) return

  isRendering = true
  renderInternal(next)
}

export function enqueue(event: AlertOverlayEvent) {
  queue.push(event)
  processQueue()
}

function resolveAction(type: AlertOverlayEvent['type']) {
  if (type === 'follower') return CONFIG.actions.follower
  if (type === 'subscriber') return CONFIG.actions.subscriber
  if (type === 'tip') return CONFIG.actions.tip
  return ''
}

function show() {
  const el = document.getElementById('wrapper')
  if (!el) return

  el.classList.remove('is-hiding')
  el.classList.remove('is-hidden')
  el.classList.remove('is-visible')

  el.getBoundingClientRect()

  el.classList.add('is-visible')
}

function hide(onDone?: () => void) {
  const el = document.getElementById('wrapper')
  if (!el) return

  el.classList.remove('is-visible')
  el.classList.add('is-hiding')

  setTimeout(() => {
    el.classList.remove('is-hiding')
    el.classList.add('is-hidden')
    onDone?.()
  }, 250)
}

function setText(id: string, text: string) {
  const el = document.getElementById(id)
  if (el) el.textContent = text || ''
}

function setAnimatedText(id: string, text: string) {
  const el = document.getElementById(id)
  if (!el) return

  el.innerHTML = ''
  const s = String(text || '')

  for (let i = 0; i < s.length; i++) {
    const span = document.createElement('span')
    span.className = 'animated-letter'
    span.style.animationDelay = `${i * 0.06}s`
    span.textContent = s[i]
    el.appendChild(span)
  }
}
