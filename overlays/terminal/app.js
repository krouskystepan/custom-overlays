// =======================
// State
// =======================

let fieldData
let hideTimeout

// =======================
// Lifecycle
// =======================

window.addEventListener('onWidgetLoad', (obj) => {
  fieldData = obj.detail.fieldData
})

window.addEventListener('onEventReceived', (obj) => {
  if (!fieldData) return

  const ev = obj.detail.event
  if (!ev || !ev.type) return

  if (!isPrimaryEvent(ev)) return

  if (!isEventEnabled(ev.type)) return

  const data = ev.data || ev
  if (!data) return

  const payload = extractPayload(ev.type, data)
  render(payload)
})

// =======================
// Event enable logic
// =======================

function isEventEnabled(type) {
  if (type === 'follower') return fieldData.listenFollow
  if (type === 'subscriber') return fieldData.listenSub
  if (type === 'tip') return fieldData.listenTip
  return false
}

// =======================
// Data extraction
// =======================

function extractPayload(type, data) {
  return {
    type,
    name: data.displayName || data.username || data.name || '',
    months: extractMonths(type, data),
    message: typeof data.message === 'string' ? data.message : '',
    amount: extractAmount(type, data),
    amountFormatted:
      typeof data.amountFormatted === 'string' ? data.amountFormatted : '',
    currency: typeof data.currency === 'string' ? data.currency : '',
    isGift: data.type === 'subscriber' && isGiftSub(data),
    subGifter: data.type === 'subscriber' && getGiftSender(data)
  }
}

function extractMonths(type, data) {
  if (type !== 'subscriber') return null
  if (typeof data.months === 'number') return data.months
  if (typeof data.amount === 'number') return data.amount
  return null
}

function extractAmount(type, data) {
  if (type !== 'tip' && type !== 'subscriber') return null
  if (typeof data.amount === 'number') return data.amount
  return null
}

function isGiftSub(data) {
  return data.gifted === true
}

// =======================
// Render
// =======================

function render({
  type,
  name,
  months,
  message,
  amount,
  amountFormatted,
  currency,
  isGift,
  subGifter
}) {
  clearTimeout(hideTimeout)
  show()

  setAnimatedText('command', fieldData.command)
  setAnimatedText('action', resolveAction(type))
  setAnimatedText('name', name)

  const { result, extra } = buildResult({
    type,
    months,
    message,
    amount,
    amountFormatted,
    currency,
    isGift,
    subGifter
  })

  setText('result', result)
  setText('extra', extra)

  hideTimeout = setTimeout(hide, fieldData.duration * 1000)
}

// =======================
// Result logic
// =======================

function buildResult({
  type,
  months,
  message,
  amount,
  amountFormatted,
  currency,
  isGift,
  subGifter
}) {
  // FOLLOW
  if (type === 'follower') {
    return {
      result: fieldData.resultText || '✔ follow',
      extra: ''
    }
  }

  // SUB
  if (type === 'subscriber') {
    // 🎁 GIFT SUB
    if (isGift) {
      return {
        result: `✔ ${subGifter} gifted ${
          amount === 1 ? 'a sub' : `${amount} subs`
        }`,
        extra: ''
      }
    }

    // ⭐ NORMAL SUB
    let result = '✔ subscribed'

    if (typeof months === 'number') {
      result = `✔ subscribed (${months} ${months === 1 ? 'month' : 'months'})`
    }

    return {
      result,
      extra: message || ''
    }
  }

  // TIP
  if (type === 'tip') {
    let result = '✔ donated'

    if (amountFormatted) {
      result = `✔ donated ${amountFormatted}`
    } else if (typeof amount === 'number') {
      result = `✔ donated ${amount} ${currency}`.trim()
    }

    return {
      result,
      extra: message || ''
    }
  }

  return {
    result: fieldData.resultText || '✔ success',
    extra: ''
  }
}

// =======================
// Helpers
// =======================

function resolveAction(type) {
  if (type === 'follower') return fieldData.actionFollow
  if (type === 'subscriber') return fieldData.actionSub
  if (type === 'tip') return fieldData.actionTip
  return fieldData.action || ''
}

function show() {
  const el = document.getElementById('wrapper')
  if (el) el.style.display = 'flex'
}

function hide() {
  const el = document.getElementById('wrapper')
  if (el) el.style.display = 'none'
}

function setText(id, text) {
  const el = document.getElementById(id)
  if (el) el.textContent = text || ''
}

function setAnimatedText(id, text) {
  const el = document.getElementById(id)
  if (!el) return

  el.innerHTML = ''
  const s = String(text || '')

  for (let i = 0; i < s.length; i += 1) {
    const span = document.createElement('span')
    span.className = 'animated-letter'
    span.style.animationDelay = `${i * 0.06}s`
    span.textContent = s[i]
    el.appendChild(span)
  }
}

function getGiftSender(data) {
  return data.sender || data.gifter || data.from || ''
}

function isPrimaryEvent(ev) {
  if (!ev.originalEventName) return true
  return ev.originalEventName.endsWith('-latest')
}
