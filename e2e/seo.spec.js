import { expect, test } from '@playwright/test'
import { openSite, store, texts } from './helpers.js'

const MAX_SHARE_IMAGE_BYTES = 200 * 1024

function metaContent(page, selector) {
  return page.locator(`head meta[${selector}]`).getAttribute('content')
}

// Most crawlers and link previews (WhatsApp, X, Facebook) do not run JavaScript,
// so these tests read the page exactly as the server sends it.
test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the page has an Arabic title, a description and its canonical address', async ({
    page,
  }) => {
    await page.goto('./')

    await expect(page).toHaveTitle(texts.ar.meta.title)
    expect(await metaContent(page, 'name="description"')).toMatch(/\S{10}/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      store.website,
    )
  })

  test('Open Graph tags describe the share card and point to the live site', async ({
    page,
  }) => {
    await page.goto('./')

    expect(await metaContent(page, 'property="og:title"')).toMatch(/\S/)
    expect(await metaContent(page, 'property="og:description"')).toMatch(/\S/)
    expect(await metaContent(page, 'property="og:url"')).toBe(store.website)
    expect(await metaContent(page, 'property="og:image"')).toBe(
      `${store.website}og-image.png`,
    )
    expect(await metaContent(page, 'name="twitter:card"')).toBe(
      'summary_large_image',
    )
  })

  test('the share image is a 1200 × 630 PNG under 200 KB', async ({ page }) => {
    const response = await page.request.get('./og-image.png')
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toBe('image/png')

    const image = await response.body()
    expect(image.length).toBeLessThan(MAX_SHARE_IMAGE_BYTES)
    // A PNG file stores its width and height at bytes 16 and 20.
    expect(image.readUInt32BE(16)).toBe(1200)
    expect(image.readUInt32BE(20)).toBe(630)
  })

  test('the favicon and the iPhone icon load', async ({ page }) => {
    await page.goto('./')

    for (const rel of ['icon', 'apple-touch-icon']) {
      const href = await page
        .locator(`head link[rel="${rel}"]`)
        .getAttribute('href')
      const response = await page.request.get(new URL(href, page.url()).href)
      expect(response.ok(), rel).toBe(true)
      expect(response.headers()['content-type'], rel).toMatch(/^image\//)
    }
  })

  test('JSON-LD describes the store as a GroceryStore, without placeholders', async ({
    page,
  }) => {
    await page.goto('./')
    const json = await page
      .locator('script[type="application/ld+json"]')
      .textContent()
    const data = JSON.parse(json)

    expect(data['@type']).toBe('GroceryStore')
    expect(data.name).toBe(store.name_ar)
    expect(data.url).toBe(store.website)
    expect(json).not.toContain('NEEDS-AHMED')
  })
})

test('the browser tab title follows the language', async ({ page }) => {
  await openSite(page, 'en')
  await expect(page).toHaveTitle(texts.en.meta.title)

  await page.getByRole('button', { name: texts.en.switchLanguage }).click()
  await expect(page).toHaveTitle(texts.ar.meta.title)
})
