import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { Request, Response } from 'express'

const VERIFIER_PATH = path.resolve('data/kick-verifier.txt')

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url')
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url')
}

export async function oauthStart(_req: Request, res: Response) {
  const verifier = generateCodeVerifier()
  const challenge = generateCodeChallenge(verifier)

  await fs.writeFile(VERIFIER_PATH, verifier, 'utf-8')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.KICK_CLIENT_ID!,
    redirect_uri: process.env.KICK_REDIRECT_URI!,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  })

  res.redirect(`https://id.kick.com/oauth/authorize?${params}`)
}
