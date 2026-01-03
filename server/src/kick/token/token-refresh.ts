import { getKickAccessToken } from './token'

export function startKickTokenRefresher() {
  setInterval(async () => {
    try {
      await getKickAccessToken()
    } catch (err) {
      console.error('❌ Kick token refresh failed:', err)
    }
  }, 5 * 60 * 1000)

  console.log('🔁 Kick token refresher started')
}
