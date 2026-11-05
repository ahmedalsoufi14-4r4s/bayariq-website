import { expect, test } from '@playwright/test'
import { categories, openSite, products, texts, tokenColor } from './helpers.js'

const t = texts.ar
const inStockProduct = products.find((product) => product.inStock)

function filterRow(page, language = 'ar') {
  return page.getByRole('group', {
    name: texts[language].products.categoriesLabel,
  })
}

// The saffron pill is the only <span> directly inside the filter row.
function filterPill(row) {
  return row.locator(':scope > span')
}

// True when the pill covers the button exactly, to the pixel.
async function pillIsUnder(pill, button) {
  const [pillBox, buttonBox] = await Promise.all([
    pill.boundingBox(),
    button.boundingBox(),
  ])
  return ['x', 'y', 'width', 'height'].every(
    (side) => Math.abs(pillBox[side] - buttonBox[side]) < 1,
  )
}

// How far the saffron underline of a menu link has grown: 0 (hidden) to 1 (full width).
function underlineScale(link) {
  return link.evaluate((element) =>
    parseFloat(getComputedStyle(element, '::after').scale),
  )
}

// Playwright cannot send the tab to the background, so the page is told it is hidden.
function setTabHidden(page, isHidden) {
  return page.evaluate((hidden) => {
    Object.defineProperty(document, 'hidden', {
      value: hidden,
      configurable: true,
    })
    document.dispatchEvent(new Event('visibilitychange'))
  }, isHidden)
}

for (const width of [360, 1280]) {
  test(`at ${width}px the menu highlights the link of the section on screen`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('./')
    const nav = page.getByRole('navigation')
    const link = (id) => nav.getByRole('link', { name: t.nav[id] })
    const accent = await tokenColor(page, 'accent')

    await expect(link('home')).toHaveAttribute('aria-current', 'true')

    for (const id of ['offers', 'products', 'contact']) {
      await page
        .locator(`#${id}`)
        .evaluate((section) => section.scrollIntoView())
      await expect(link(id)).toHaveAttribute('aria-current', 'true')
      await expect(nav.locator('[aria-current]')).toHaveCount(1)
      await expect(link(id)).toHaveCSS('color', accent)
      expect(await underlineScale(link(id))).toBe(1)
    }

    // "Why shop with us" has no menu link, so "Home" stays highlighted there.
    await page
      .getByRole('region', { name: t.highlights.title })
      .evaluate((section) => section.scrollIntoView())
    await expect(link('home')).toHaveAttribute('aria-current', 'true')
  })
}

test('a menu link grows its underline on hover', async ({ page }) => {
  await page.goto('./')
  const offers = page.getByRole('navigation').getByRole('link', {
    name: t.nav.offers,
  })

  expect(await underlineScale(offers)).toBe(0)
  await offers.hover()
  await expect.poll(() => underlineScale(offers)).toBe(1)
})

test('the search box shows a clear button while it has text', async ({
  page,
}) => {
  await page.goto('./')
  const search = page.getByRole('searchbox', { name: t.products.searchLabel })
  const clear = page.getByRole('button', { name: t.products.clearSearch })
  const searchIcon = page.locator('#product-search ~ svg')

  await expect(clear).toHaveCount(0)
  await search.focus()
  // On focus the border turns navy, a soft ring appears and the icon turns navy.
  const mainInk = await tokenColor(page, 'main-ink')
  await expect(search).toHaveCSS('border-color', mainInk)
  await expect(search).toHaveCSS('box-shadow', /0px 0px 0px 4px/)
  await expect(searchIcon).toHaveCSS('color', mainInk)

  await search.fill('zzzz')
  await expect(clear).toBeVisible()
  await clear.click()
  await expect(search).toHaveValue('')
  await expect(search).toBeFocused()
  await expect(clear).toHaveCount(0)
  await expect(page.locator('#products').getByRole('article')).toHaveCount(
    products.length,
  )
})

test('at 360px the header, menu, filter and cart buttons are at least 44px for fingers', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('./')
  await page
    .locator('#products')
    .getByRole('button', { name: `${t.cart.add}: ${inStockProduct.name_ar}` })
    .click()
  await page.getByRole('button', { name: t.cart.open }).click()
  const drawer = page.getByRole('dialog', { name: t.cart.title })
  await expect(drawer).toBeVisible()

  const targets = [
    ...(await page.locator('header').getByRole('button').all()),
    ...(await page.getByRole('navigation').getByRole('link').all()),
    ...(await filterRow(page).getByRole('button').all()),
    drawer.getByRole('button', { name: t.cart.close }),
    drawer.getByRole('button', { name: t.cart.increase }),
    drawer.getByRole('button', { name: t.cart.decrease }),
  ]
  for (const target of targets) {
    const { width, height } = await target.boundingBox()
    const name = await target.evaluate(
      (element) => element.getAttribute('aria-label') || element.textContent,
    )
    expect(Math.min(width, height), name).toBeGreaterThanOrEqual(44)
  }
})

test.describe('with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('a saffron pill slides to the chosen category, in Arabic and in English', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await openSite(page, 'ar')
    const row = filterRow(page)
    const pill = filterPill(row)

    await expect
      .poll(() =>
        pillIsUnder(pill, row.getByRole('button', { name: t.products.all })),
      )
      .toBe(true)

    // The last category is off screen at 360px: the row scrolls, and the pill slides there.
    const last = row.getByRole('button', { name: categories.at(-1).name_ar })
    await last.click()
    expect(
      await pill.evaluate((element) => element.getAnimations().length),
    ).toBeGreaterThan(0)
    await expect.poll(() => pillIsUnder(pill, last)).toBe(true)

    // In English the buttons change size and order; the pill follows the chosen one.
    await page.getByRole('button', { name: t.switchLanguage }).click()
    const rowEn = filterRow(page, 'en')
    const lastEn = rowEn.getByRole('button', {
      name: categories.at(-1).name_en,
    })
    await expect(lastEn).toHaveAttribute('aria-pressed', 'true')
    await expect.poll(() => pillIsUnder(filterPill(rowEn), lastEn)).toBe(true)
  })

  test('icon buttons move their icon on hover: the moon tilts, the cart rocks, close turns', async ({
    page,
  }) => {
    await page.goto('./')
    const themeButton = page.getByRole('button', { name: t.darkMode })
    const cartButton = page.getByRole('button', { name: t.cart.open })

    await themeButton.hover()
    await expect(themeButton.locator('svg')).toHaveCSS('rotate', '-12deg')
    await cartButton.hover()
    await expect(cartButton.locator('svg')).toHaveCSS(
      'animation-name',
      'wiggle',
    )

    await cartButton.click()
    const close = page
      .getByRole('dialog', { name: t.cart.title })
      .getByRole('button', { name: t.cart.close })
    await close.hover()
    await expect(close.locator('svg')).toHaveCSS('rotate', '90deg')
  })

  test('a saffron button sweeps a soft light across from the start side on hover', async ({
    page,
  }) => {
    await page.goto('./')
    const button = page.getByRole('link', { name: t.hero.browse })
    const light = () =>
      button.evaluate(
        (element) => getComputedStyle(element, '::before').translate,
      )

    // In Arabic the start side is on the right, so the light waits there and crosses to the left.
    expect(await light()).toBe('100%')
    await button.hover()
    await expect.poll(light).toBe('-100%')
  })

  test('the background shapes drift in slow loops and stop while the tab is hidden', async ({
    page,
  }) => {
    await page.goto('./')
    const shapes = await page.locator('.drift').all()
    // Two behind the page and two glows in the hero.
    expect(shapes).toHaveLength(4)

    for (const shape of shapes) {
      await expect(shape).toHaveCSS('animation-name', 'drift')
      await expect(shape).toHaveCSS('animation-play-state', 'running')
      const seconds = parseFloat(
        await shape.evaluate(
          (element) => getComputedStyle(element).animationDuration,
        ),
      )
      expect(seconds).toBeGreaterThanOrEqual(20)
      expect(seconds).toBeLessThanOrEqual(40)
    }

    await setTabHidden(page, true)
    for (const shape of shapes) {
      await expect(shape).toHaveCSS('animation-play-state', 'paused')
    }
    await setTabHidden(page, false)
    for (const shape of shapes) {
      await expect(shape).toHaveCSS('animation-play-state', 'running')
    }
  })
})

test('visitors who ask for less motion get a still background and a pill that jumps', async ({
  page,
}) => {
  // playwright.config.js asks for reduced motion in every test.
  await page.goto('./')

  for (const shape of await page.locator('.drift').all()) {
    await expect(shape).toHaveCSS('animation-name', 'none')
  }
  await expect(filterPill(filterRow(page))).toHaveCSS(
    'transition-duration',
    '0s',
  )
})
