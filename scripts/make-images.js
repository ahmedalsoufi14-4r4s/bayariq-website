// Makes the site's generated images with Playwright's Chromium (already used for the checks):
//   photos/logo-transparent.png  the logo from photos/logo.png, cropped, on a transparent background
//   public/logo.webp             the same logo at the size the footer shows it (Footer.jsx)
//   public/og-image.png          the preview card shown when the link is shared (1200 × 630)
//   public/apple-touch-icon.png  the icon an iPhone shows when the site is added to the home screen
//   docs/screenshots/*.jpg       the screenshots in README.md
// Run it with `npm run images` after changing the logo, the store name or the look of the site.
import { Buffer } from 'node:buffer'
import { readFileSync, writeFileSync } from 'node:fs'
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
// The colors come from the palette in src/index.css (the first, light-mode value of each),
// so the images follow when the palette changes.
const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
function themeColor(name) {
  return css.match(new RegExp(`--color-${name}: (#[0-9a-f]{6});`))[1]
}
const GREEN = themeColor('main')
const PAPER = themeColor('logo-paper')

// The footer shows the logo 320px wide (Footer.jsx); the file is twice that, for sharp phone screens.
const LOGO_WEBP_WIDTH = 640

// Playwright wants a plain file path, so the file URL is turned into one.
function outputPath(relativePath) {
  return fileURLToPath(new URL(`../${relativePath}`, import.meta.url))
}

// A "data:image/png;base64,..." address from the browser, saved as a file.
function saveDataUrl(dataUrl, relativePath) {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  writeFileSync(outputPath(relativePath), Buffer.from(base64, 'base64'))
}

// photos/logo.png is a small, blurry picture with a lot of white around it. In a browser
// <canvas>, this turns the white background transparent, cuts the picture down to the logo,
// and saves it full size (PNG) and at the footer's size (WebP).
// NEEDS-AHMED: replace photos/logo.png with the original high-quality logo file, then run this again.
async function makeLogo(browser) {
  const page = await browser.newPage()
  const logo = readFileSync(new URL('../photos/logo.png', import.meta.url))
  const { png, webp } = await page.evaluate(
    async ({ source, webpWidth }) => {
      const image = new Image()
      image.src = source
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      const picture = context.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = picture.data // red, green, blue, alpha, red, green, ...

      // A pixel's lowest channel says how far it is from white: 255 is white. White and the
      // faint grey noise near it (240 and up) become fully see-through, strong colors (60 and
      // down) stay solid, and the soft edges in between become partly see-through. Then the
      // white mixed into an edge pixel is taken out again, so edges don't look washed out.
      let top = canvas.height
      let bottom = 0
      let left = canvas.width
      let right = 0
      for (let index = 0; index < pixels.length; index += 4) {
        const lowest = Math.min(
          pixels[index],
          pixels[index + 1],
          pixels[index + 2],
        )
        const alpha = Math.min(Math.max((240 - lowest) / 180, 0), 1)
        for (let channel = 0; channel < 3; channel++) {
          const color = pixels[index + channel]
          pixels[index + channel] =
            alpha === 0 ? 255 : (color - 255 * (1 - alpha)) / alpha
        }
        pixels[index + 3] = alpha * 255

        // The logo's edges: the outermost pixels that are mostly solid.
        if (alpha > 0.5) {
          const x = (index / 4) % canvas.width
          const y = Math.floor(index / 4 / canvas.width)
          top = Math.min(top, y)
          bottom = Math.max(bottom, y)
          left = Math.min(left, x)
          right = Math.max(right, x)
        }
      }
      context.putImageData(picture, 0, 0)

      // A small margin around the logo, so its soft edges are not cut off.
      const margin = Math.round((bottom - top) * 0.03)
      const crop = {
        x: left - margin,
        y: top - margin,
        width: right - left + 1 + margin * 2,
        height: bottom - top + 1 + margin * 2,
      }
      function draw(width) {
        const output = document.createElement('canvas')
        output.width = width
        output.height = Math.round((crop.height * width) / crop.width)
        const outputContext = output.getContext('2d')
        outputContext.imageSmoothingQuality = 'high'
        outputContext.drawImage(
          canvas,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          output.width,
          output.height,
        )
        return output
      }
      return {
        png: draw(crop.width).toDataURL('image/png'),
        webp: draw(webpWidth).toDataURL('image/webp', 0.9),
      }
    },
    {
      source: `data:image/png;base64,${logo.toString('base64')}`,
      webpWidth: LOGO_WEBP_WIDTH,
    },
  )
  saveDataUrl(png, 'photos/logo-transparent.png')
  saveDataUrl(webp, 'public/logo.webp')
  await page.close()
}

// Share images are PNG, not WebP, because some apps (WhatsApp among them) do not show WebP previews.
// The logo on white (the 60%), above a green band (the 30%) with the branch districts.
// The logo is shown 820px wide, smaller than its file, so it stays sharp (and the PNG small).
async function makeShareImage(browser) {
  const logo = readFileSync(
    new URL('../photos/logo-transparent.png', import.meta.url),
  ).toString('base64')
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.setContent(
    `${FONT_LINK}
    <body style="margin:0; font-family:'IBM Plex Sans Arabic'; background:${PAPER}">
      <main style="height:630px; display:flex; flex-direction:column">
        <div style="flex:1; display:flex; align-items:center; justify-content:center">
          <img src="data:image/png;base64,${logo}" style="width:820px">
        </div>
        <p dir="rtl" style="margin:0; padding:36px 0 44px; background:${GREEN}; color:white; text-align:center; font-size:40px; font-weight:700">
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

// iPhones round the corners themselves, so the icon fills the whole square with white,
// the same white as the favicon's plate.
async function makeAppleTouchIcon(browser) {
  const page = await browser.newPage({ viewport: { width: 180, height: 180 } })
  await page.setContent(
    `<body style="margin:0; background:${PAPER}">
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
    // The language, and the first-visit tour marked as seen, so it does not cover the page.
    const language = shot.name.includes('-en') ? 'en' : 'ar'
    await page.addInitScript((value) => {
      localStorage.setItem('bayariq-language', value)
      localStorage.setItem('bayariq-tour-seen', 'yes')
    }, language)
    await page.goto(siteUrl, { waitUntil: 'networkidle' })
    // scrollIntoView() keeps the section title below the sticky header (scroll-padding on <html>).
    if (shot.section) {
      await page
        .locator(shot.section)
        .evaluate((section) => section.scrollIntoView())
    }
    // Waits for color fades to end, like the underline growing under the menu link of the section on screen.
    await page.waitForFunction(() => document.getAnimations().length === 0)
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
await makeLogo(browser)
await makeShareImage(browser)
await makeAppleTouchIcon(browser)
await makeReadmeScreenshots(browser)
await browser.close()
console.log(
  'Made photos/logo-transparent.png, public/logo.webp, public/og-image.png, public/apple-touch-icon.png and docs/screenshots/.',
)
