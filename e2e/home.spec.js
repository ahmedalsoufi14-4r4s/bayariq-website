import { expect, test } from '@playwright/test'
import { isPlaceholder } from '../src/lib/placeholder.js'
import { store, texts } from './helpers.js'

const t = texts.ar

test('hero links to the products, and shows WhatsApp and call only with real numbers', async ({
  page,
}) => {
  await page.goto('./')
  const hero = page.locator('#home')
  const whatsApp = hero.getByRole('link', { name: t.contact.whatsapp })
  const call = hero.getByRole('link', { name: t.contact.call })

  await expect(hero.getByRole('link', { name: t.hero.browse })).toHaveAttribute(
    'href',
    '#products',
  )

  if (isPlaceholder(store.whatsapp)) {
    await expect(whatsApp).toHaveCount(0)
  } else {
    await expect(whatsApp).toHaveAttribute(
      'href',
      `https://wa.me/${store.whatsapp}`,
    )
  }

  if (isPlaceholder(store.phone)) {
    await expect(call).toHaveCount(0)
  } else {
    await expect(call).toHaveAttribute('href', `tel:${store.phone}`)
  }
})

test('"why shop with us" shows three highlights', async ({ page }) => {
  await page.goto('./')
  const highlights = page.getByRole('region', { name: t.highlights.title })

  await expect(highlights.getByRole('listitem')).toHaveCount(3)
})

test('store info shows the hours, the address and the map, or "coming soon"', async ({
  page,
}) => {
  await page.goto('./')
  const contact = page.getByRole('region', { name: t.contact.title })
  const mapsLink = contact.getByRole('link', { name: t.contact.openInMaps })

  if (isPlaceholder(store.hours)) {
    await expect(contact.getByText(t.comingSoon, { exact: true })).toBeVisible()
  } else {
    await expect(contact.locator('dt')).toHaveCount(store.hours.length)
  }

  await expect(contact.getByText(store.address_ar)).toBeVisible()

  if (isPlaceholder(store.mapsUrl)) {
    await expect(mapsLink).toHaveCount(0)
  } else {
    await expect(mapsLink).toHaveAttribute('href', store.mapsUrl)
  }

  if (isPlaceholder(store.mapsEmbedUrl)) {
    await expect(contact.getByText(t.contact.mapComingSoon)).toBeVisible()
  } else {
    await expect(contact.getByTitle(t.contact.mapTitle)).toHaveAttribute(
      'src',
      store.mapsEmbedUrl,
    )
  }
})

for (const width of [360, 1280]) {
  test(`at ${width}px the contact menu link shows the section title below the sticky header`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('./')

    await page
      .getByRole('navigation')
      .getByRole('link', { name: t.nav.contact })
      .click()
    await expect(page).toHaveURL(/#contact$/)

    const title = page.getByRole('heading', { name: t.contact.title })
    await expect(title).toBeInViewport()
    const headerBox = await page.locator('header').boundingBox()
    const titleBox = await title.boundingBox()
    expect(titleBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height)
  })
}
