import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/My-Sticker-Collection/',
  build: {
    outDir: 'docs',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/sticker.svg'],
      manifest: {
        name: 'My Sticker Collection',
        short_name: 'Stickers',
        description: 'Local-first sticker album tracker for collection and duplicates.',
        theme_color: '#f7c948',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/My-Sticker-Collection/',
        icons: [
          {
            src: 'icons/sticker.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
