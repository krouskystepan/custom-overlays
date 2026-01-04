import { defineConfig } from 'vite'
import { OVERLAY_CHAT_PORT } from '../../shared/src'

export default defineConfig(() => {
  return {
    server: {
      port: OVERLAY_CHAT_PORT,
      strictPort: true
    }
  }
})
