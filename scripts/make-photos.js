import { Buffer } from 'node:buffer'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

// The photos on the site, made from the store's own originals in photos/ by `npm run images`.
// crop is the part of the original to keep, in pixels (all of it when there is no crop), and
// width is how wide the photo is saved: about twice as wide as it shows, for sharp phone screens.
export const PHOTOS = [
  {
    // The storefront with the sign. The original has black bars above and below the picture.
    source: 'al-mahamid/02.jpg',
    crop: { x: 0, y: 384, width: 1080, height: 350 },
    width: 1080,
    output: 'public/images/al-mahamid-storefront.webp',
  },
  {
    source: 'al-mahamid/04.jpg',
    width: 520,
    output: 'public/images/al-mahamid-produce.webp',
  },
  {
    source: 'al-mahamid/03.jpg',
    crop: { x: 0, y: 120, width: 1280, height: 720 },
    width: 520,
    output: 'public/images/al-mahamid-aisle.webp',
  },
]

const QUALITY = 0.8

function projectFile(path) {
  return new URL(`../${path}`, import.meta.url)
}

// Draws each original on a browser <canvas>, cropped and resized, and saves it as WebP.
// Drawing it again also leaves out the hidden details a camera saves in a photo (EXIF).
export async function makePhotos(browser) {
  mkdirSync(projectFile('public/images'), { recursive: true })
  const page = await browser.newPage()
  for (const photo of PHOTOS) {
    const original = readFileSync(projectFile(`photos/${photo.source}`))
    const dataUrl = await page.evaluate(
      async ({ source, crop, width, quality }) => {
        const image = new Image()
        image.src = source
        await image.decode()
        const part = crop ?? {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = Math.round((part.height * width) / part.width)
        const context = canvas.getContext('2d')
        context.imageSmoothingQuality = 'high'
        context.drawImage(
          image,
          part.x,
          part.y,
          part.width,
          part.height,
          0,
          0,
          canvas.width,
          canvas.height,
        )
        return canvas.toDataURL('image/webp', quality)
      },
      {
        source: `data:image/jpeg;base64,${original.toString('base64')}`,
        crop: photo.crop,
        width: photo.width,
        quality: QUALITY,
      },
    )
    const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
    writeFileSync(projectFile(photo.output), Buffer.from(base64, 'base64'))
  }
  await page.close()
}
