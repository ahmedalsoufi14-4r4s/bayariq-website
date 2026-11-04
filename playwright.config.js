import { defineConfig } from '@playwright/test'

const SITE_URL = 'http://localhost:4173/bayariq-website/'

// Browser checks run in Chromium against a fresh production build served by `vite preview`.
// Port 4173 keeps them away from the dev server on port 5173.
export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: {
    baseURL: SITE_URL,
    // Tests act like a visitor who asked for less motion, so they never wait for animations.
    // e2e/polish.spec.js turns motion back on to check the animations.
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: SITE_URL,
    reuseExistingServer: false,
  },
})
