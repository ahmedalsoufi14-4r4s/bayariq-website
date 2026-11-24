import { expect, test } from './test.js'
import {
  categories,
  openSite,
  products,
  store,
  texts,
  tokenColor,
  waitForProducts,
} from './helpers.js'

const t = texts.ar
const firstProduct = products[0]

// Waits until a card has finished fading in (see reveal.js, on the card or on its list item),
// so it does not rise away from under the mouse or the finger.
function waitUntilStill(card) {
  return expect
    .poll(() =>
      card.evaluate((element) =>
        [element, element.parentElement].every(
          (node) => node.getAnimations().length === 0,
        ),
      ),
    )
    .toBe(true)
}

// How visible the glow around a card is: "0" (hidden) to "1".
function glowOpacity(card) {
  return card.evaluate(
    (element) => getComputedStyle(element, '::before').opacity,
  )
}

// The mouse cursor shown 12px inside the card's top-left corner.
async function cursorInCorner(page, card) {
  const box = await card.boundingBox()
  return page.evaluate(
    ({ x, y }) => getComputedStyle(document.elementFromPoint(x, y)).cursor,
    { x: box.x + 12, y: box.y + 12 },
  )
}

function filterRow(page, language = 'ar') {
  return page.getByRole('group', {
    name: texts[language].products.categoriesLabel,
  })
}

// The red pill is the only <span> directly inside the filter row.
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

// How far the white underline of a menu link has grown: 0 (hidden) to 1 (full width).
function underlineScale(link) {
  return link.evaluate((element) =>
    parseFloat(getComputedStyle(element, '::after').scale),
  )
}

for (const width of [360, 1280]) {
  test(`at ${width}px the menu highlights the link of the section on screen`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('./')
    const nav = page.getByRole('navigation')
    const link = (id) => nav.getByRole('link', { name: t.nav[id] })
    const onMain = await tokenColor(page, 'on-main')

    await expect(link('home')).toHaveAttribute('aria-current', 'true')

    for (const id of ['offers', 'products', 'contact']) {
      await page
        .locator(`#${id}`)
        .evaluate((section) => section.scrollIntoView())
      await expect(link(id)).toHaveAttribute('aria-current', 'true')
      await expect(nav.locator('[aria-current]')).toHaveCount(1)
      // A full white underline marks it: a shape, not only a color, and white, because the
      // red accent barely shows on the green header.
      expect(await underlineScale(link(id))).toBe(1)
      expect(
        await link(id).evaluate(
          (element) => getComputedStyle(element, '::after').backgroundColor,
        ),
      ).toBe(onMain)
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
  // On focus the border turns green, a soft ring appears and the icon turns green.
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
  await expect(
    page.locator('#products').getByRole('heading', { level: 3 }).first(),
  ).toHaveText(products[0].name)
})

test('at 360px the header, menu, filter, product, cart and order-form controls are at least 44px for fingers', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('./')
  await page
    .locator('#products')
    .getByRole('button', { name: `${t.cart.add}: ${firstProduct.name}` })
    .click()
  await page.getByRole('button', { name: t.cart.open }).click()
  const drawer = page.getByRole('dialog', { name: t.cart.title })
  await expect(drawer).toBeVisible()

  const targets = [
    ...(await page.locator('header').getByRole('button').all()),
    ...(await page.getByRole('navigation').getByRole('link').all()),
    ...(await filterRow(page).getByRole('button').all()),
    ...(await page
      .locator('#products')
      .getByRole('button', { name: t.cart.add })
      .all()),
    drawer.getByRole('button', { name: t.cart.close }),
    drawer.getByRole('button', { name: t.cart.increase }),
    drawer.getByRole('button', { name: t.cart.decrease }),
    drawer.getByRole('button', { name: t.cart.remove }),
    drawer.getByRole('button', { name: t.cart.clear }),
    // The order form: each branch choice (the whole row can be tapped) and each text field.
    ...(await drawer
      .locator('label')
      .filter({ has: page.getByRole('radio') })
      .all()),
    ...(await drawer.getByRole('textbox').all()),
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

  test('a red pill slides to the chosen category, in Arabic and in English', async ({
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

    // The last category is off screen at 360px: the row scrolls, and the pill slides there
    // (a 300 ms transition, not a jump).
    const last = row.getByRole('button', { name: categories.at(-1).name_ar })
    await last.click()
    await expect(pill).toHaveCSS(
      'transition-property',
      'translate, width, height',
    )
    await expect(pill).toHaveCSS('transition-duration', '0.3s')
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

  test('icon buttons move their icon on hover: the moon tilts, the cart rocks, close, plus and minus turn', async ({
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

    await page
      .locator('#products')
      .getByRole('button', { name: `${t.cart.add}: ${firstProduct.name}` })
      .click()
    await cartButton.click()
    const drawer = page.getByRole('dialog', { name: t.cart.title })
    // Wait until the drawer has slid in, so its buttons stay under the mouse.
    await expect
      .poll(() => drawer.evaluate((element) => element.getAnimations().length))
      .toBe(0)
    const close = drawer.getByRole('button', { name: t.cart.close })
    await close.hover()
    await expect(close.locator('svg')).toHaveCSS('rotate', '90deg')

    const plus = drawer.getByRole('button', { name: t.cart.increase })
    await plus.hover()
    await expect(plus.locator('svg')).toHaveCSS('rotate', '90deg')
    const minus = drawer.getByRole('button', { name: t.cart.decrease })
    await minus.hover()
    await expect(minus.locator('svg')).toHaveCSS('rotate', '180deg')
  })

  test('a category button’s icon rocks under the pointer', async ({ page }) => {
    await page.goto('./')
    const button = filterRow(page).getByRole('button', {
      name: categories[0].name_ar,
    })
    await button.hover()
    await expect(button.locator('svg')).toHaveCSS('animation-name', 'wiggle')
  })

  test('text buttons, branch choices and the footer link shrink a little while pressed', async ({
    page,
  }) => {
    await page.goto('./')
    const [first, second] = products
    for (const product of [first, second]) {
      await page
        .locator('#products')
        .getByRole('button', { name: `${t.cart.add}: ${product.name}` })
        .click()
    }
    await page.getByRole('button', { name: t.cart.open }).click()
    const drawer = page.getByRole('dialog', { name: t.cart.title })
    await expect
      .poll(() => drawer.evaluate((element) => element.getAnimations().length))
      .toBe(0)

    // Each one is pressed, checked while held, then let go, which clicks it. The order keeps
    // the clicks harmless: a branch is chosen, one of the two products is removed, and only
    // then is the cart emptied.
    const pressed = [
      [
        drawer
          .locator('label')
          .filter({ has: page.getByRole('radio') })
          .first(),
        '0.98',
      ],
      [
        drawer.getByRole('button', {
          name: `${t.cart.remove} ${first.name}`,
        }),
        '0.95',
      ],
      [drawer.getByRole('button', { name: t.cart.clear }), '0.95'],
    ]
    for (const [target, scale] of pressed) {
      await target.hover()
      await page.mouse.down()
      await expect(target).toHaveCSS('scale', scale)
      // A branch choice also lights up while pressed, so a tap on a phone shows.
      if (scale === '0.98') {
        await expect(target).toHaveCSS(
          'background-color',
          await tokenColor(page, 'main-soft'),
        )
      }
      await page.mouse.up()
    }
    await page.keyboard.press('Escape')

    // The footer link starts the tour when clicked, so the mouse leaves before it is let go.
    const footerLink = page
      .locator('footer')
      .getByRole('button', { name: t.tour.again })
    await footerLink.hover()
    await page.mouse.down()
    await expect(footerLink).toHaveCSS('scale', '0.95')
    await page.mouse.move(0, 0)
    await page.mouse.up()
  })

  test('a red button sweeps a soft light across from the start side on hover', async ({
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

  test('every card and box on the page lifts, tilts and glows under the pointer, and its icon moves', async ({
    page,
  }) => {
    // Tall enough for a whole branch card, so its corner is on screen too.
    await page.setViewportSize({ width: 1280, height: 1100 })
    await page.goto('./')
    await waitForProducts(page)
    // Why shop with us, the offers (or the "coming soon" card), the products and the branches.
    for (const area of [
      page.getByRole('region', { name: t.highlights.title }),
      page.locator('#offers'),
      page.locator('#products'),
      page.locator('#contact'),
    ]) {
      await expect(area.locator('.card')).not.toHaveCount(0)
    }

    for (const card of await page.locator('main .card').all()) {
      const isProduct = await card.evaluate((element) =>
        Boolean(element.closest('#products')),
      )
      await card.scrollIntoViewIfNeeded()
      await waitUntilStill(card)
      await card.hover()

      await expect(card).toHaveCSS('translate', '0px -6px')
      await expect(card).toHaveCSS('rotate', '-0.75deg')
      await expect.poll(() => glowOpacity(card)).toBe('1')
      if (isProduct) {
        // A product card is clickable: its picture zooms, and the pointer is a hand.
        await expect(
          card.locator('[class*="group-hover:scale-105"]'),
        ).toHaveCSS('scale', '1.05')
        expect(await cursorInCorner(page, card)).toBe('pointer')
      } else {
        // The others are not: their icon moves, and the pointer stays an arrow, without underline.
        await expect(
          card.locator('[class*="card-active:"]').first(),
        ).not.toHaveCSS('animation-name', 'none')
        expect(await cursorInCorner(page, card)).toBe('auto')
        await expect(card).toHaveCSS('text-decoration-line', 'none')
      }
    }
  })

  test('the logo and the hero photos react to the pointer too', async ({
    page,
  }) => {
    await page.goto('./')
    const logo = page
      .locator('header')
      .getByRole('link', { name: store.name_ar, exact: true })
    await logo.hover()
    await expect(logo.locator('span').first()).toHaveCSS('rotate', '-6deg')

    // The photos bob all the time, so the mouse goes to the middle of one without waiting
    // for it to stand still.
    const frame = page.locator('#home .tile-bob').first()
    const box = await frame.boundingBox()
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await expect(frame).toHaveCSS('scale', '1.04')
    await expect(frame.locator('img')).toHaveCSS('scale', '1.06')
  })
})

test.describe('on a phone', () => {
  test.use({
    hasTouch: true,
    reducedMotion: 'no-preference',
    viewport: { width: 360, height: 800 },
  })

  test('a tap makes a card lift, glow and move its icon for a moment', async ({
    page,
  }) => {
    await page.clock.install()
    await page.goto('./')
    const card = page
      .getByRole('region', { name: t.highlights.title })
      .locator('.card')
      .first()
    await card.scrollIntoViewIfNeeded()
    await waitUntilStill(card)

    // From here the page's timers wait for the test, so "a moment" (700 ms in tapReaction.js)
    // lasts until the test moves the clock on, however busy the computer is.
    // CSS animations don't use these timers, so they still run.
    await page.clock.pauseAt(Date.now() + 1000)
    await card.tap()
    await expect(card).toHaveAttribute('data-tapped', '')
    await expect(card).toHaveCSS('translate', '0px -6px')
    await expect.poll(() => glowOpacity(card)).toBe('1')
    await expect(card.locator('[class*="card-active:"]')).not.toHaveCSS(
      'animation-name',
      'none',
    )

    // A moment later it settles back.
    await page.clock.runFor(800)
    await expect(card).not.toHaveAttribute('data-tapped')
    await expect(card).toHaveCSS('translate', 'none')
  })
})

test('radio choices in the order form light up under the pointer', async ({
  page,
}) => {
  await page.goto('./')
  await page.getByRole('button', { name: t.cart.open }).click()
  const choice = page
    .getByRole('dialog', { name: t.cart.title })
    .locator('label')
    .filter({ has: page.getByRole('radio') })
    .first()

  await choice.hover()
  await expect(choice).toHaveCSS(
    'background-color',
    await tokenColor(page, 'main-soft'),
  )
})

test('visitors who ask for less motion get still cards that only glow, and a pill that jumps', async ({
  page,
}) => {
  // playwright.config.js asks for reduced motion in every test.
  await page.goto('./')
  const card = page
    .getByRole('region', { name: t.highlights.title })
    .locator('.card')
    .first()

  await card.hover()
  await expect.poll(() => glowOpacity(card)).toBe('1')
  await expect(card).toHaveCSS('translate', 'none')
  await expect(card).toHaveCSS('rotate', 'none')
  await expect(card.locator('[class*="card-active:"]')).toHaveCSS(
    'animation-name',
    'none',
  )
  await expect(filterPill(filterRow(page))).toHaveCSS(
    'transition-duration',
    '0s',
  )
})
