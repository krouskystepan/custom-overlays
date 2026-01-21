import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'

import { kickWebhook } from './kick/webhook'
import { streamelementsWebhook } from './streamelements/webhook'
import { initWS, broadcast } from './ws'
import { oauthCallback } from './oauth'
import { printDevBanner } from './devBanner'
import { subscribeToKickEvents } from './kick/subscribe'
import { mockKick } from './mock/kick'
import { startKickChat } from './kick/chat'
import { startKickTokenRefresher } from './kick/token/token-refresh'
import { CHANNEL_NAME, SERVER_HTTP_PORT } from '@custom/shared'
import { oauthStart } from './kick/oauth/start'
import { getKickChannel } from './routes/kick'
import { corsOptions } from './config/security'

process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION]', err)
})

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err)
})

process.on('SIGTERM', () => {
  console.log('[SIGTERM] received')
})

process.on('SIGINT', () => {
  console.log('[SIGINT] received')
})

const app = express()

app.use(cors(corsOptions))

if (process.env.NODE_ENV === 'development') {
  app.post('/__mock/kick', mockKick)
}

app.get('/oauth/start', oauthStart)
app.get('/oauth/callback', oauthCallback)
app.get('/api/kick/channel/:channelName', getKickChannel)

app.post(
  '/kick/events',
  express.json({ verify: kickWebhook.verify }),
  kickWebhook.handler(broadcast)
)

const seCors = cors({ origin: true })

app.post(
  '/streamelements/events',
  seCors,
  express.json({ verify: streamelementsWebhook.verify }),
  streamelementsWebhook.handler(broadcast)
)

app.options('/streamelements/events', seCors)

const httpServer = createServer(app)
initWS(httpServer)

httpServer.listen(SERVER_HTTP_PORT, () => {
  console.log(`[HTTP] listening on port ${SERVER_HTTP_PORT}`)

  if (process.env.NODE_ENV === 'development') {
    printDevBanner()
    return
  }

  try {
    startKickTokenRefresher()
  } catch (err) {
    console.error('[Kick token refresher failed]', err)
  }

  subscribeToKickEvents().catch((err) => {
    console.error('[Kick event subscription failed]', err)
  })

  try {
    const maybePromise = startKickChat(CHANNEL_NAME, broadcast)

    if (
      maybePromise &&
      typeof (maybePromise as Promise<void>).catch === 'function'
    ) {
      ;(maybePromise as Promise<void>).catch((err) => {
        console.error('[Kick chat failed]', err)
      })
    }
  } catch (err) {
    console.error('[Kick chat threw synchronously]', err)
  }
})

setInterval(() => {}, 1 << 30)
