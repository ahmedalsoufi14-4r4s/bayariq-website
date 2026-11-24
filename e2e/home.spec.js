import { getCallUrl, getMapEmbedUrl } from '../src/lib/branches.js'
import { isPlaceholder } from '../src/lib/placeholder.js'
import { fillIn } from '../src/lib/text.js'
import {
  hiddenBranches,
  openSite,
  store,
  texts,
  waitForProducts,
} from './helpers.js'
import { expect, test } from './test.js'

const t = texts.ar

function branchLabel(branch) {
  return fillIn(t.contact.branch, { district: branch.district_ar })
}

// True once a photo has really loaded, not only its empty box.
function hasLoaded(photo) {
  return photo.evaluate((image) => image.complete && image.naturalWidth > 0)
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

for (const language of ['ar', 'en']) {
  test(`the hero shows the storefront and two photos from inside the branch (${language})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await openSite(page, language)
    const hero = page.locator('#home')
    await expect(hero.getByRole('img')).toHaveCount(3)

    for (const alt of Object.values(texts[language].photos)) {
      const photo = hero.getByRole('img', { name: alt, exact: true })
      await photo.scrollIntoViewIfNeeded()
      await expect.poll(() => hasLoaded(photo)).toBe(true)
    }
  })
}

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

test('the branches section shows the three branches with their hours, address, phone, buttons and map', async ({
  page,
}) => {
  await page.goto('./')
  const section = page.getByRole('region', { name: t.contact.title })
  await expect(section.getByRole('article')).toHaveCount(3)
  await waitForProducts(page)
  await expect(page.locator('iframe')).toHaveCount(0)

  for (const branch of store.branches) {
    const label = branchLabel(branch)
    const card = section.getByRole('article', { name: label, exact: true })
    await expect(card.getByRole('heading', { name: label })).toBeVisible()
    await expect(card.getByText(branch.name_ar, { exact: true })).toBeVisible()
    await expect(card.getByText(t.comingSoon, { exact: true })).toHaveCount(0)

    await expect(card.locator('dt')).toHaveText(
      branch.hours.map((row) => row.days_ar),
    )
    await expect(card.locator('dd')).toHaveText(
      branch.hours.map((row) => row.time_ar),
    )
    await expect(card.getByText(branch.address_ar)).toBeVisible()
    await expect(card.getByText(branch.phone, { exact: true })).toBeVisible()

    await expect(
      card.getByRole('link', { name: t.contact.openInMaps }),
    ).toHaveAttribute('href', branch.mapsUrl)
    // The map is only added to the page once the visitor is close to it.
    await card.scrollIntoViewIfNeeded()
    await expect(
      card.getByTitle(fillIn(t.contact.mapTitle, { branch: label })),
    ).toHaveAttribute('src', getMapEmbedUrl(branch, 'ar'))

    await expect(
      card.getByRole('link', { name: `${t.contact.whatsapp} – ${label}` }),
    ).toHaveAttribute('href', `https://wa.me/${branch.whatsapp}`)
    await expect(
      card.getByRole('link', { name: `${t.contact.call} – ${label}` }),
    ).toHaveAttribute('href', getCallUrl(branch.phone))
  }
})

for (const language of ['ar', 'en']) {
  test(`a branch card shows its photo, or says the photo is coming soon (${language})`, async ({
    page,
  }) => {
    await openSite(page, language)
    const { contact } = texts[language]
    const cards = page.locator('#contact article')

    for (const [index, branch] of store.branches.entries()) {
      const card = cards.nth(index)
      await card.scrollIntoViewIfNeeded()
      const photo = card.getByRole('img', {
        name: fillIn(contact.photoAlt, {
          branch: fillIn(contact.branch, {
            district: branch[`district_${language}`],
          }),
        }),
      })
      const comingSoon = card.getByText(contact.photoComingSoon, {
        exact: true,
      })

      if (isPlaceholder(branch.photo)) {
        await expect(photo).toHaveCount(0)
        await expect(comingSoon).toBeVisible()
        await expect(comingSoon.locator('svg')).toHaveCount(1)
      } else {
        await expect.poll(() => hasLoaded(photo)).toBe(true)
        await expect(comingSoon).toHaveCount(0)
      }
    }
    // Only Al Mahamid has the owner's own photos so far.
    expect(
      store.branches
        .filter((branch) => !isPlaceholder(branch.photo))
        .map((branch) => branch.id),
    ).toEqual(['al-mahamid'])
  })
}

test('the hidden branch is nowhere: not on the page, in the order form, in the chat or in the code of the site', async ({
  page,
}) => {
  expect(hiddenBranches.map((branch) => branch.id)).toEqual(['al-harazat'])
  const [hidden] = hiddenBranches
  // Every word that would give it away. Its English name shares words with the others.
  const traces = [
    hidden.district_ar,
    hidden.district_en,
    'التوفيق التجارية',
    'Tawfiq',
    hidden.whatsapp,
    hidden.phone,
  ]

  // Everything the browser downloads for the page, except photos and fonts.
  const files = []
  page.on('response', async (response) => {
    if (/html|javascript|json/.test(response.headers()['content-type'] ?? '')) {
      files.push(response.text().catch(() => ''))
    }
  })

  for (const language of ['ar', 'en']) {
    await openSite(page, language)
    const { cart, chat } = texts[language]
    await page.getByRole('button', { name: chat.open }).click()
    const chatPanel = page.getByRole('dialog', { name: chat.title })
    await chatPanel
      .getByRole('button', { name: chat.topics.branches, exact: true })
      .click()
    await expect(
      chatPanel
        .getByRole('group', { name: chat.suggestions })
        .last()
        .getByRole('button'),
    ).toHaveCount(3)
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: cart.open }).click()
    await expect(
      page.getByRole('dialog', { name: cart.title }).getByRole('radio'),
    ).toHaveCount(3)

    // The whole document, with the closed dialogs and the JSON-LD.
    const html = await page.content()
    for (const trace of traces) expect(html).not.toContain(trace)
  }

  const downloaded = (await Promise.all(files)).join('\n')
  expect(downloaded.length).toBeGreaterThan(100_000)
  for (const trace of traces) expect(downloaded).not.toContain(trace)
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
