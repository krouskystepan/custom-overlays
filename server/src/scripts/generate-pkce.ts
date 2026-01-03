import crypto from 'node:crypto'
import 'dotenv/config'

function base64url(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

const CODE_VERIFIER = process.env.KICK_CODE_VERIFIER

if (!CODE_VERIFIER) {
  console.error('❌ Missing KICK_CODE_VERIFIER in env')
  process.exit(1)
}

const hash = crypto.createHash('sha256').update(CODE_VERIFIER).digest()
const codeChallenge = base64url(hash)

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('🔑 PKCE')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('code_verifier:')
console.log(CODE_VERIFIER)
console.log('')
console.log('code_challenge:')
console.log(codeChallenge)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━')
