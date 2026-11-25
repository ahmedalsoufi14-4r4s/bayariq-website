import { readdirSync, readFileSync, statSync } from 'node:fs'
import {
  categories,
  categoryProducts,
  findLowContrastText,
  openSite,
  photoCredits,
  products,
  texts,
  tokenColor,
  waitForProducts,
} from './helpers.js'
import { expect, test } from './test.js'

// The product photos: their files, their credits, the credits page, and the category pictures
// that stand in for them.

const t = texts.ar
const MAX_PHOTO_BYTES = 40 * 1024
const MAX_FOLDER_BYTES = 15 * 1024 * 1024
const PHOTO_FOLDER = new URL('../public/images/products/', import.meta.url)
// The open databases photos may come from: their name in photo-credits.json, the key of their
// texts under `credits`, and their website (the product pages are on the same site).
const OPEN_SOURCES = [
  {
    name: 'Open Food Facts',
    key: 'openFoodFacts',
    site: 'https://world.openfoodfacts.org',
  },
  {
    name: 'Open Beauty Facts',
    key: 'openBeautyFacts',
    site: 'https://world.openbeautyfacts.org',
  },
  {
    name: 'Open Products Facts',
    key: 'openProductsFacts',
    site: 'https://world.openproductsfacts.org',
  },
]

const allProducts = categories.flatMap((category) =>
  categoryProducts(category.id),
)
const withPhoto = products.find((product) => product.image)
const withoutPhoto = products.find((product) => !product.image)

function productCard(page, product) {
  return page
    .locator('#products')
    .getByRole('article')
    .filter({
      has: page.getByRole('heading', { name: product.name, exact: true }),
    })
}

test('every photo used on the site is in photo-credits.json, and nothing else is', () => {
  const credited = photoCredits.map((photo) => photo.productId).sort()
  const used = allProducts.filter((product) => product.image)
  expect(credited.length).toBeGreaterThan(200)
  expect(new Set(credited).size).toBe(credited.length)
  expect(used.map((product) => product.id).sort()).toEqual(credited)
  expect(
    readdirSync(PHOTO_FOLDER)
      .map((file) => file.replace('.webp', ''))
      .sort(),
  ).toEqual(credited)
  for (const product of used) {
    expect(product.image).toBe(`images/products/${product.id}.webp`)
  }
})

test('every credit names the product, the source and the license, and no source is another store', () => {
  const nameOf = Object.fromEntries(
    allProducts.map((product) => [product.id, product.name]),
  )
  for (const photo of photoCredits) {
    expect(photo.productName, photo.productId).toBe(nameOf[photo.productId])
    expect(photo.sourceName, photo.productId).toMatch(/\S/)
    expect(photo.sourceUrl, photo.productId).toMatch(/^https:\/\//)
    expect(photo.originalUrl, photo.productId).toMatch(/^https:\/\//)
    expect(photo.sourceUrl).not.toMatch(
      /danube|carrefour|tamimi|panda|othaim|lulu|nana|ninja|amazon|noon/i,
    )
    // Only openly licensed photos. A manufacturer's photo (all rights reserved) needs the
    // company's permission first.
    const source = OPEN_SOURCES.find((open) => open.name === photo.sourceName)
    expect(source, photo.productId).toBeDefined()
    expect(photo.license, photo.productId).toBe('CC BY-SA 3.0')
    expect(photo.sourceUrl, photo.productId).toMatch(
      new RegExp(`^${source.site.replaceAll('.', '\\.')}/product/\\d{8,13}$`),
    )
  }
})

test('every product photo is a 400 × 400 WebP under 40 KB, and the folder stays small', () => {
  let total = 0
  for (const file of readdirSync(PHOTO_FOLDER)) {
    expect(file).toMatch(/^\d+\.webp$/)
    const url = new URL(file, PHOTO_FOLDER)
    const { size } = statSync(url)
    expect(size, file).toBeLessThan(MAX_PHOTO_BYTES)
    total += size

    // A simple WebP file ("VP8 ") stores its width and height, 14 bits each, at bytes 26 and 28.
    const image = readFileSync(url)
    expect(image.toString('latin1', 0, 4), file).toBe('RIFF')
    expect(image.toString('latin1', 8, 16), file).toBe('WEBPVP8 ')
    expect(image.readUInt16LE(26) & 0x3fff, file).toBe(400)
    expect(image.readUInt16LE(28) & 0x3fff, file).toBe(400)
  }
  expect(total).toBeLessThan(MAX_FOLDER_BYTES)
})

test('a product with a photo shows it, lazy-loaded and with the product name as alt text', async ({
  page,
}) => {
  await page.goto('./')
  const photo = productCard(page, withPhoto).locator('img')

  await expect(photo).toHaveAttribute('alt', withPhoto.name)
  await expect(photo).toHaveAttribute('loading', 'lazy')
  await photo.scrollIntoViewIfNeeded()
  await expect
    .poll(() => photo.evaluate((image) => image.complete && image.naturalWidth))
    .toBe(400)
})

test.describe('with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('a product photo pulses softly until it has loaded', async ({
    page,
  }) => {
    let releasePhoto
    const photoHeld = new Promise((resolve) => (releasePhoto = resolve))
    await page.route('**/images/products/*.webp', async (route) => {
      await photoHeld
      await route.continue()
    })
    await page.goto('./')
    const photo = productCard(page, withPhoto).locator('img')
    await photo.scrollIntoViewIfNeeded()

    await expect(photo).toHaveCSS('animation-name', 'pulse')
    releasePhoto()
    await expect(photo).toHaveCSS('animation-name', 'none')
  })
})

test('a product photo that fails to load is replaced by the picture of its category', async ({
  page,
}) => {
  await page.route('**/images/products/*.webp', (route) => route.abort())
  await page.goto('./')
  const card = productCard(page, withPhoto)
  await card.scrollIntoViewIfNeeded()

  await expect(card.locator('img')).toHaveCount(0)
  await expect(card.locator('svg[viewBox="0 0 64 64"]')).toBeVisible()
})

for (const theme of ['light', 'dark']) {
  test.describe(`${theme} mode`, () => {
    test.use({ colorScheme: theme })

    test('a product without a photo shows a large picture of its category on the category’s tint', async ({
      page,
    }) => {
      await page.goto('./')
      const card = productCard(page, withoutPhoto)
      await card.scrollIntoViewIfNeeded()
      const picture = card.locator('svg[viewBox="0 0 64 64"]')
      const tile = picture.locator('..')
      const { tint } = categories.find(
        (category) => category.id === withoutPhoto.category,
      )

      await expect(card.locator('img')).toHaveCount(0)
      await expect(picture).toBeVisible()
      await expect(tile).toHaveCSS(
        'background-color',
        await tokenColor(page, `tint-${tint}`),
      )
      const [pictureBox, tileBox] = [
        await picture.boundingBox(),
        await tile.boundingBox(),
      ]
      expect(pictureBox.width / tileBox.width).toBeGreaterThan(0.6)
    })
  })
}

test('every category has its own picture and one of the three tints', async ({
  page,
}) => {
  const drawings = new Set()
  await page.goto('./')
  await waitForProducts(page)
  const filter = page.getByRole('group', { name: t.products.categoriesLabel })

  for (const category of categories) {
    expect(['leaf', 'mint', 'mist'], category.id).toContain(category.tint)
    const button = filter.getByRole('button', {
      name: category.name_ar,
      exact: true,
    })
    await button.click()
    await expect(button).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#products')).toContainText(
      `${t.products.results} ${categoryProducts(category.id).length}`,
    )
    // The first product of the category that has no photo.
    const picture = page
      .locator('#products article svg[viewBox="0 0 64 64"]')
      .first()
    drawings.add(await picture.innerHTML())
  }
  expect(drawings.size).toBe(categories.length)
})

test('the footer links to the photo credits page, and the page links back', async ({
  page,
}) => {
  await page.goto('./')
  await page
    .locator('footer')
    .getByRole('link', { name: t.footer.photoCredits })
    .click()

  await expect(page).toHaveURL(/photo-credits\.html$/)
  await expect(page).toHaveTitle(t.meta.creditsTitle)
  await page.getByRole('link', { name: t.credits.back }).click()
  await expect(page.locator('#products')).toBeVisible()
})

for (const language of ['ar', 'en']) {
  for (const width of [360, 1280]) {
    test(`the credits page lists every photo with its source and license (${language}, ${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 })
      const errors = await openSite(page, language, './photo-credits.html')
      const { credits } = texts[language]
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        credits.title,
      )
      await expect(page.getByRole('listitem')).toHaveCount(photoCredits.length)

      // One group per open database, with its own photos.
      for (const source of OPEN_SOURCES) {
        const own = photoCredits.filter(
          (photo) => photo.sourceName === source.name,
        )
        expect(own.length, source.name).toBeGreaterThan(0)
        const section = page.getByRole('region', {
          name: credits[source.key].title,
        })
        await expect(section.getByRole('listitem')).toHaveCount(own.length)
        // What the license asks for: the author, the license with its link, and the changes.
        await expect(section).toContainText(credits[source.key].text)
        await expect(section).toContainText(credits.changes)
        for (const [name, url] of [
          [credits[source.key].site, source.site],
          [credits.license, 'https://creativecommons.org/licenses/by-sa/3.0/'],
          [
            credits.dataLicense,
            'https://opendatacommons.org/licenses/odbl/1-0/',
          ],
        ]) {
          await expect(
            section.getByRole('link', { name, exact: true }),
          ).toHaveAttribute('href', url)
        }
      }
      // No photos from manufacturers' websites, so no empty group for them.
      await expect(
        page.getByRole('heading', { name: credits.makers.title }),
      ).toHaveCount(0)

      const links = await page
        .getByRole('listitem')
        .getByRole('link')
        .evaluateAll((list) => list.map((link) => link.getAttribute('href')))
      expect([...links].sort()).toEqual(
        photoCredits.map((photo) => photo.sourceUrl).sort(),
      )
      await expect(page.getByRole('listitem').first()).toContainText(
        'CC BY-SA 3.0',
      )

      const hasSidewaysScroll = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      )
      expect(hasSidewaysScroll).toBe(false)
      expect(errors).toEqual([])
    })
  }
}

for (const theme of ['light', 'dark']) {
  test.describe(`credits page, ${theme} mode`, () => {
    test.use({ colorScheme: theme })

    test('all text is AA, and the language and theme buttons work', async ({
      page,
    }) => {
      await page.goto('./photo-credits.html')
      await expect(page.getByRole('listitem').first()).toBeVisible()
      expect(await findLowContrastText(page)).toEqual([])
      await page.screenshot({ path: `screenshots/credits-${theme}.png` })

      await page.getByRole('button', { name: t.switchLanguage }).click()
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
      await expect(page).toHaveTitle(texts.en.meta.creditsTitle)
      await page.getByRole('button', { name: texts.en.darkMode }).click()
      await expect(page.locator('html')).toHaveClass(
        theme === 'light' ? /dark/ : /^(?!.*dark)/,
      )
    })
  })
}

test('if the credits cannot be loaded, the page says so', async ({ page }) => {
  await page.route('**/photo-credits.json', (route) => route.abort())
  await page.goto('./photo-credits.html')
  await expect(page.getByRole('alert')).toContainText(t.credits.loadFailed)
})
