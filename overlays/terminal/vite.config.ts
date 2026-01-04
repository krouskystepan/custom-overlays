import { defineConfig, loadEnv } from 'vite'
import { OVERLAY_TERMINAL_PORT } from '../../shared/src'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      port: OVERLAY_TERMINAL_PORT,
      strictPort: true
    }
  }
})
