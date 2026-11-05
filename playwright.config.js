import { defineConfig } from '@playwright/test'

const SITE_ORIGIN = 'http://localhost:4173'
const SITE_URL = `${SITE_ORIGIN}/bayariq-website/`

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
    // Tests start as a returning visitor who has already seen the first-visit tour, so it
    // never covers the page. Same key as in src/tour/TourProvider.jsx.
    // e2e/tour.spec.js starts with empty storage to test the tour itself.
    storageState: {
      cookies: [],
      origins: [
        {
          origin: SITE_ORIGIN,
          localStorage: [{ name: 'bayariq-tour-seen', value: 'yes' }],
        },
      ],
    },
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: SITE_URL,
    reuseExistingServer: false,
  },
})
