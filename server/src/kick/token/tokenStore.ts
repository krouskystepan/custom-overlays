import fs from 'fs/promises'
import path from 'path'

const FILE = path.resolve('server/src/data/kick-token.json')

export interface KickToken {
  access_token: string
  refresh_token: string
  expires_at: number
}

export async function loadToken(): Promise<KickToken | null> {
  try {
    const raw = await fs.readFile(FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function saveToken(token: KickToken) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(token, null, 2))
}
