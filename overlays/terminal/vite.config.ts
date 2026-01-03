import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      port: Number(env.OVERLAY_TERMINAL_PORT),
      strictPort: true
    }
  }
})
