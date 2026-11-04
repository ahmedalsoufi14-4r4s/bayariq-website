import { expect, test } from '@playwright/test'
import { isPlaceholder } from '../src/lib/placeholder.js'
import { fillIn } from '../src/lib/text.js'
import { store, texts } from './helpers.js'

const t = texts.ar

function branchLabel(branch) {
  return fillIn(t.contact.branch, { district: branch.district_ar })
}

test('hero links to the products and to the branches', async ({ page }) => {
  await page.goto('./')
  const hero = page.locator('#home')

  await expect(hero.getByRole('link', { name: t.hero.browse })).toHaveAttribute(
    'href',
    '#products',
  )
  await expect(
    hero.getByRole('link', { name: t.hero.branches }),
  ).toHaveAttribute('href', '#contact')
})

test('"why shop with us" shows three highlights, and "nearby" names every branch district', async ({
  page,
}) => {
  await page.goto('./')
  const highlights = page.getByRole('region', { name: t.highlights.title })
  const nearby = highlights
    .getByRole('listitem')
    .filter({ hasText: t.highlights.nearby.title })

  await expect(highlights.getByRole('listitem')).toHaveCount(3)
  for (const branch of store.branches) {
    await expect(nearby).toContainText(branch.district_ar)
  }
})

test('the branches section shows every branch with its own name, hours, address, buttons and map', async ({
  page,
}) => {
  await page.goto('./')
  const section = page.getByRole('region', { name: t.contact.title })
  await expect(section.getByRole('article')).toHaveCount(store.branches.length)

  for (const branch of store.branches) {
    const label = branchLabel(branch)
    const card = section.getByRole('article', { name: label, exact: true })
    await expect(card.getByRole('heading', { name: label })).toBeVisible()
    await expect(card.getByText(branch.name_ar, { exact: true })).toBeVisible()

    // Missing hours and address each show "coming soon".
    const missing = [branch.hours, branch.address_ar].filter(isPlaceholder)
    await expect(card.getByText(t.comingSoon, { exact: true })).toHaveCount(
      missing.length,
    )
    if (!isPlaceholder(branch.hours)) {
      await expect(card.locator('dt')).toHaveCount(branch.hours.length)
    }
    if (!isPlaceholder(branch.address_ar)) {
      await expect(card.getByText(branch.address_ar)).toBeVisible()
    }

    const mapsLink = card.getByRole('link', { name: t.contact.openInMaps })
    if (isPlaceholder(branch.mapsUrl)) {
      await expect(mapsLink).toHaveCount(0)
    } else {
      await expect(mapsLink).toHaveAttribute('href', branch.mapsUrl)
    }

    if (isPlaceholder(branch.mapsEmbedUrl)) {
      await expect(card.getByText(t.contact.mapComingSoon)).toBeVisible()
    } else {
      await expect(
        card.getByTitle(fillIn(t.contact.mapTitle, { branch: label })),
      ).toHaveAttribute('src', branch.mapsEmbedUrl)
    }

    // Call and WhatsApp show only with the branch's real numbers.
    const whatsApp = card.getByRole('link', {
      name: `${t.contact.whatsapp} – ${label}`,
    })
    const call = card.getByRole('link', {
      name: `${t.contact.call} – ${label}`,
    })
    if (isPlaceholder(branch.whatsapp)) {
      await expect(whatsApp).toHaveCount(0)
    } else {
      await expect(whatsApp).toHaveAttribute(
        'href',
        `https://wa.me/${branch.whatsapp}`,
      )
    }
    if (isPlaceholder(branch.phone)) {
      await expect(call).toHaveCount(0)
    } else {
      await expect(call).toHaveAttribute('href', `tel:${branch.phone}`)
    }
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
