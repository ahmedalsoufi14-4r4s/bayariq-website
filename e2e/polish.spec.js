import { existsSync, statSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { findLowContrastText, offers, products, texts } from './helpers.js'

const t = texts.ar
const MAX_PHOTO_BYTES = 200 * 1024

function openCartDrawer(page) {
  return page.getByRole('button', { name: t.cart.open }).click()
}

// Breaks one thing the page uses while it draws ("why shop with us" joins the branch
// districts with Intl.ListFormat), so the page crashes and the error message shows instead.
async function openCrashingSite(page) {
  await page.addInitScript(() => {
    Intl.ListFormat = function () {
      throw new Error('Broken on purpose by the test')
    }
  })
  await page.goto('./')
}

function errorCard(page) {
  return page.locator('main .card').filter({
    has: page.getByRole('heading', { name: t.error.title }),
  })
}

test.describe('with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('the cart drawer animates when it opens', async ({ page }) => {
    await page.goto('./')
    await openCartDrawer(page)

    await expect(page.getByRole('dialog', { name: t.cart.title })).toHaveCSS(
      'transition-duration',
      /0\.2s/,
    )
  })

  test('the error message’s card lifts and glows under the pointer, and its icon wiggles', async ({
    page,
  }) => {
    await openCrashingSite(page)
    const card = errorCard(page)
    await card.locator('p').hover()

    await expect(card).toHaveCSS('translate', '0px -6px')
    await expect
      .poll(() =>
        card.evaluate(
          (element) => getComputedStyle(element, '::before').opacity,
        ),
      )
      .toBe('1')
    await expect(card.locator('span').first()).toHaveCSS(
      'animation-name',
      'wiggle',
    )
  })

  test('a photo shows a softly pulsing skeleton until it has loaded', async ({
    page,
  }) => {
    const product = products.find((item) => item.image)
    test.skip(!product, 'no product photos yet')
    // Holds the photo back until the skeleton has been checked.
    let releasePhoto
    const photoHeld = new Promise((resolve) => (releasePhoto = resolve))
    await page.route(`**/${product.image}`, async (route) => {
      await photoHeld
      await route.continue()
    })
    await page.goto('./')
    const photo = page
      .locator('#products article')
      .filter({
        has: page.getByRole('heading', { name: product.name_ar, exact: true }),
      })
      .locator('img')

    // Photos are lazy-loaded, so the card must be on screen before the photo is requested.
    await photo.scrollIntoViewIfNeeded()
    await expect(photo).toHaveCSS('animation-name', 'pulse')
    releasePhoto()
    await expect(photo).toHaveCSS('animation-name', 'none')
  })
})

for (const theme of ['light', 'dark']) {
  test.describe(`${theme} mode`, () => {
    test.use({ colorScheme: theme })

    test('if the page crashes, a friendly message shows in a card over the moving circles, with AA text', async ({
      page,
    }) => {
      await openCrashingSite(page)
      const card = errorCard(page)
      await expect(card).toBeVisible()
      await expect(card.getByText(t.error.text)).toBeVisible()
      await expect(page.locator('.circle')).not.toHaveCount(0)
      expect(await findLowContrastText(page)).toEqual([])
    })
  })
}

test('the error message’s button loads the page again', async ({ page }) => {
  await openCrashingSite(page)
  await Promise.all([
    page.waitForEvent('load'),
    errorCard(page).getByRole('button', { name: t.error.reload }).click(),
  ])
  // The test breaks the page on every load, so the message shows again.
  await expect(errorCard(page)).toBeVisible()
})

test('visitors who ask for less motion get no animation', async ({ page }) => {
  // playwright.config.js asks for reduced motion in every test.
  await page.goto('./')
  await openCartDrawer(page)

  await expect(page.getByRole('dialog', { name: t.cart.title })).toHaveCSS(
    'transition-duration',
    '0s',
  )
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
})

test('keyboard focus shows a clear outline', async ({ page }) => {
  await page.goto('./')
  await page.keyboard.press('Tab')

  const focused = page.locator(':focus')
  await expect(focused).toHaveCSS('outline-style', 'solid')
  await expect(focused).toHaveCSS('outline-width', '2px')
})

test('every product and offer photo is a WebP file under 200 KB in public/', () => {
  const photos = [...products, ...offers]
    .map((item) => item.image)
    .filter(Boolean)

  for (const photo of photos) {
    const file = new URL(`../public/${photo}`, import.meta.url)
    expect(photo).toMatch(/\.webp$/)
    expect(existsSync(file), `${photo} is missing from public/`).toBe(true)
    expect(statSync(file).size).toBeLessThan(MAX_PHOTO_BYTES)
  }
})

test('every photo on the page is lazy-loaded and has alt text', async ({
  page,
}) => {
  await page.goto('./')

  for (const photo of await page.locator('img').all()) {
    await expect(photo).toHaveAttribute('loading', 'lazy')
    await expect(photo).toHaveAttribute('alt', /\S/)
  }
})

test('a product photo that fails to load is replaced by the category icon', async ({
  page,
}) => {
  const product = products.find((item) => item.image)
  test.skip(!product, 'no product photos yet')
  await page.route(`**/${product.image}`, (route) => route.abort())
  await page.goto('./')
  const card = page.locator('#products article').filter({
    has: page.getByRole('heading', { name: product.name_ar, exact: true }),
  })

  // Photos are lazy-loaded, so the card must be on screen before the photo is requested.
  await card.scrollIntoViewIfNeeded()
  await expect(card.locator('img')).toHaveCount(0)
})

test('the page only uses the font weights it loads (regular and bold)', async ({
  page,
}) => {
  // src/index.css loads only 400 and 700. Any other weight would quietly show as one of them.
  await page.goto('./')
  const weights = await page.evaluate(() => [
    ...new Set(
      [...document.body.querySelectorAll('*')].map(
        (element) => getComputedStyle(element).fontWeight,
      ),
    ),
  ])

  expect(weights.sort()).toEqual(['400', '700'])
})
