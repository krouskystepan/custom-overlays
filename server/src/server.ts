import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'

import { kickWebhook } from './kick/webhook'
import { streamelementsWebhook } from './streamelements/webhook'
import { initSSE, handleSSE } from './transports/sse'
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

const app = express()
app.use(cors(corsOptions))
app.use(express.json({ limit: '256kb' }))

if (process.env.NODE_ENV === 'development') {
  app.post('/__mock/kick', mockKick)
}

app.get('/health', (_, res) => res.json({ ok: true }))
app.get('/oauth/start', oauthStart)
app.get('/oauth/callback', oauthCallback)
app.get('/api/kick/channel/:channelName', getKickChannel)

app.get('/events', handleSSE)

app.post(
  '/kick/events',
  express.json({ verify: kickWebhook.verify }),
  kickWebhook.handler()
)

app.post(
  '/streamelements/events',
  express.json({ verify: streamelementsWebhook.verify }),
  streamelementsWebhook.handler()
)

const httpServer = createServer(app)

// initWS(httpServer)
initSSE()

httpServer.listen(SERVER_HTTP_PORT, () => {
  console.log(`[HTTP] listening on port ${SERVER_HTTP_PORT}`)

  if (process.env.NODE_ENV === 'development') {
    printDevBanner()
  }

  startKickTokenRefresher()
  subscribeToKickEvents().catch(console.error)
  startKickChat(CHANNEL_NAME).catch(console.error)
})
