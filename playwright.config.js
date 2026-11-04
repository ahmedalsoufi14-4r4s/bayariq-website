import { defineConfig } from '@playwright/test'

const SITE_URL = 'http://localhost:4173/bayariq-website/'

// Browser checks run in Chromium against a fresh production build served by `vite preview`.
// Port 4173 keeps them away from the dev server on port 5173.
export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: {
    baseURL: SITE_URL,
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: SITE_URL,
    reuseExistingServer: false,
  },
})
