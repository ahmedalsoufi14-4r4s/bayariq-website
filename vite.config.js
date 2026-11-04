import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import store from './src/data/store.json' with { type: 'json' }
import { buildStoreJsonLd } from './src/lib/structuredData.js'

// A tiny Vite plugin: adds the store's JSON-LD (see src/lib/structuredData.js) to the
// <head> of index.html, so search engines can read it without running JavaScript.
function storeStructuredData() {
  return {
    name: 'store-structured-data',
    transformIndexHtml() {
      // Escaping "<" means no text in store.json can ever close the <script> tag early.
      const json = JSON.stringify(buildStoreJsonLd(store)).replaceAll(
        '<',
        '\\u003c',
      )
      return [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: json,
          injectTo: 'head',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from /<repo-name>/, so every asset path needs this prefix.
  base: '/bayariq-website/',
  plugins: [react(), tailwindcss(), storeStructuredData()],
  test: {
    // Vitest unit tests live next to the code in src/. The Playwright tests in e2e/ run with `npm run check`.
    include: ['src/**/*.test.js'],
  },
})
