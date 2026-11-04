// Makes the site's generated images with Playwright's Chromium (already used for the checks):
//   public/og-image.png          the preview card shown when the link is shared (1200 × 630)
//   public/apple-touch-icon.png  the icon an iPhone shows when the site is added to the home screen
//   docs/screenshots/*.jpg       the screenshots in README.md
// Run it with `npm run images` after changing the logo, the store name or the look of the site.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { build, preview } from 'vite'

const store = JSON.parse(
  readFileSync(new URL('../src/data/store.json', import.meta.url), 'utf8'),
)
const favicon = readFileSync(
  new URL('../public/favicon.svg', import.meta.url),
  'utf8',
)
const FONT_LINK =
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;700&display=swap">'
const GREEN = '#007a55'

// Playwright wants a plain file path, so the file URL is turned into one.
function outputPath(relativePath) {
  return fileURLToPath(new URL(`../${relativePath}`, import.meta.url))
}

// Share images are PNG, not WebP, because some apps (WhatsApp among them) do not show WebP previews.
async function makeShareImage(browser) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.setContent(
    `${FONT_LINK}
    <body style="margin:0; font-family:'IBM Plex Sans Arabic'; background:${GREEN}; color:white">
      <main style="height:630px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; text-align:center">
        <div style="width:120px; height:120px">${favicon}</div>
        <h1 dir="rtl" style="margin:0; font-size:76px; font-weight:700">${store.name_ar}</h1>
        <p style="margin:0; font-size:40px">${store.name_en}</p>
        <p dir="rtl" style="margin:0; font-size:30px; opacity:0.85">
          ${store.branches.map((branch) => branch.district_ar).join(' · ')}
        </p>
      </main>
    </body>`,
    { waitUntil: 'networkidle' },
  )
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: outputPath('public/og-image.png') })
  await page.close()
}

// iPhones round the corners themselves, so the icon fills the whole square with green.
async function makeAppleTouchIcon(browser) {
  const page = await browser.newPage({ viewport: { width: 180, height: 180 } })
  await page.setContent(
    `<body style="margin:0; background:${GREEN}">
      <div style="width:180px; height:180px">${favicon}</div>
    </body>`,
  )
  await page.screenshot({ path: outputPath('public/apple-touch-icon.png') })
  await page.close()
}

// Builds the site, serves it on port 4174 (away from the dev server and the checks), and takes the README screenshots.
async function makeReadmeScreenshots(browser) {
  await build({ logLevel: 'warn' })
  const server = await preview({
    logLevel: 'warn',
    preview: { port: 4174, strictPort: true },
  })
  const siteUrl = server.resolvedUrls.local[0]

  const shots = [
    { name: 'mobile-ar', width: 360, height: 780, scale: 2, theme: 'light' },
    {
      name: 'mobile-ar-dark',
      width: 360,
      height: 780,
      scale: 2,
      theme: 'dark',
      section: '#products',
    },
    { name: 'desktop-en', width: 1280, height: 800, scale: 1, theme: 'light' },
  ]

  for (const shot of shots) {
    const page = await browser.newPage({
      viewport: { width: shot.width, height: shot.height },
      deviceScaleFactor: shot.scale,
      colorScheme: shot.theme,
      reducedMotion: 'reduce',
    })
    const language = shot.name.includes('-en') ? 'en' : 'ar'
    await page.addInitScript(
      (value) => localStorage.setItem('bayariq-language', value),
      language,
    )
    await page.goto(siteUrl, { waitUntil: 'networkidle' })
    // scrollIntoView() keeps the section title below the sticky header (scroll-padding on <html>).
    if (shot.section) {
      await page
        .locator(shot.section)
        .evaluate((section) => section.scrollIntoView())
    }
    await page.screenshot({
      path: outputPath(`docs/screenshots/${shot.name}.jpg`),
      type: 'jpeg',
      quality: 80,
    })
    await page.close()
  }

  await server.close()
}

const browser = await chromium.launch()
await makeShareImage(browser)
await makeAppleTouchIcon(browser)
await makeReadmeScreenshots(browser)
await browser.close()
console.log(
  'Made public/og-image.png, public/apple-touch-icon.png and docs/screenshots/.',
)
