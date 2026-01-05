import { Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { saveToken } from './kick/token/tokenStore'

const VERIFIER_PATH = path.resolve('data/kick-verifier.txt')

export async function oauthCallback(req: Request, res: Response) {
  const code = req.query.code as string
  if (!code) {
    return res.status(400).send('Missing code')
  }

  let codeVerifier: string
  try {
    codeVerifier = await fs.readFile(VERIFIER_PATH, 'utf-8')
  } catch {
    return res.status(500).send('Missing PKCE verifier (run OAuth again)')
  }

  const response = await fetch('https://id.kick.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KICK_CLIENT_ID!,
      client_secret: process.env.KICK_CLIENT_SECRET!,
      redirect_uri: process.env.KICK_REDIRECT_URI!,
      code_verifier: codeVerifier,
      code
    })
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('❌ OAuth error:', data)
    return res.status(500).json(data)
  }

  await saveToken({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000
  })

  console.log('✅ Kick OAuth completed, token saved')

  res.send('OAuth OK – token saved. You can close this window.')
}
