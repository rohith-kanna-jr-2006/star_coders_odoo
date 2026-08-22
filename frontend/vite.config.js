import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        // Use [\\/] to match both Windows (\) and POSIX (/) path separators
        if (!/src[\\/].*\.js$/i.test(id)) return null
        return transformWithOxc(code, id, {
          lang: 'jsx',
          jsx: { runtime: 'automatic' },
        })
      },
    },
    react(),
  ],
})
