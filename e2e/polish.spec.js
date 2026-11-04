import { existsSync, statSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { offers, products, texts } from './helpers.js'

const t = texts.ar
const MAX_PHOTO_BYTES = 200 * 1024

function openCartDrawer(page) {
  return page.getByRole('button', { name: t.cart.open }).click()
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
