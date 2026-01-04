import fs from 'fs/promises'
import path from 'path'

const TOKEN_PATH = path.resolve(process.cwd(), 'data/kick-token.json')

type StoredToken = {
  access_token: string
  refresh_token: string
  expires_at: number
}

export class KickTokenNotInitializedError extends Error {
  constructor() {
    super('Kick token not initialized – run OAuth once')
    this.name = 'KickTokenNotInitializedError'
  }
}

export async function getKickAccessToken(): Promise<string> {
  let token: StoredToken

  try {
    const raw = await fs.readFile(TOKEN_PATH, 'utf-8')
    token = JSON.parse(raw) as StoredToken
  } catch (err) {
    throw new KickTokenNotInitializedError()
  }

  if (Date.now() < token.expires_at - 60_000) {
    return token.access_token
  }

  const response = await fetch('https://id.kick.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
      client_id: process.env.KICK_CLIENT_ID!,
      client_secret: process.env.KICK_CLIENT_SECRET!
    })
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Kick token')
  }

  const data = (await response.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
  }

  const updated: StoredToken = {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? token.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000
  }

  await fs.mkdir(path.dirname(TOKEN_PATH), { recursive: true })
  await fs.writeFile(TOKEN_PATH, JSON.stringify(updated, null, 2))

  return updated.access_token
}
