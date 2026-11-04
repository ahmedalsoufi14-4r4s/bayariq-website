import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from /<repo-name>/, so every asset path needs this prefix.
  // TODO: change this if the GitHub repo gets a different name.
  base: '/bayariq-website/',
  plugins: [react(), tailwindcss()],
})
