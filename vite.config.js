import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from /<repo-name>/, so every asset path needs this prefix.
  // TODO: change this if the GitHub repo gets a different name.
  base: '/bayariq-website/',
  plugins: [react(), tailwindcss()],
  test: {
    // Vitest unit tests live next to the code in src/. The Playwright tests in e2e/ run with `npm run check`.
    include: ['src/**/*.test.js'],
  },
})
