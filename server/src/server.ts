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

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.post('/__mock/kick', mockKick)
}

app.get('/oauth/start', oauthStart)
app.get('/oauth/callback', oauthCallback)

app.post(
  '/kick/events',
  express.json({ verify: kickWebhook.verify }),
  kickWebhook.handler(broadcast)
)

const seCors = cors({
  origin: true
})

app.post(
  '/streamelements/events',
  seCors,
  express.json({ verify: streamelementsWebhook.verify }),
  streamelementsWebhook.handler(broadcast)
)

app.options('/streamelements/events', seCors)

const httpServer = createServer(app)
initWS(httpServer)

httpServer.listen(SERVER_HTTP_PORT, async () => {
  if (process.env.NODE_ENV === 'development') {
    // DEV ONLY
    printDevBanner()
  } else {
    //? Need https NOT http
    startKickTokenRefresher()

    await subscribeToKickEvents()
  }

  startKickChat(CHANNEL_NAME, broadcast)
})
