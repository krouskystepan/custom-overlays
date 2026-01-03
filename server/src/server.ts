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
import { ALLOWED_ORIGINS } from './config/security'

const HTTP_PORT = Number(process.env.HTTP_PORT || 3000)

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.post('/__mock/kick', mockKick)
}

const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`CORS blocked: ${origin}`))
  }
})

app.get('/oauth/callback', oauthCallback)

app.post(
  '/kick/events',
  express.json({ verify: kickWebhook.verify }),
  kickWebhook.handler(broadcast)
)

app.post(
  '/streamelements/events',
  corsMiddleware,
  express.json({ verify: streamelementsWebhook.verify }),
  streamelementsWebhook.handler(broadcast)
)

app.options('/streamelements/events', corsMiddleware)

const httpServer = createServer(app)
initWS(httpServer)

httpServer.listen(HTTP_PORT, async () => {
  printDevBanner()

  await subscribeToKickEvents()
  startKickChat(process.env.KICK_CHANNEL_NAME!, broadcast)

  startKickTokenRefresher()
})
