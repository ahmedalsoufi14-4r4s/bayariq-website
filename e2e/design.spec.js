import { expect, test } from '@playwright/test'
import {
  categories,
  findLowContrastText,
  products,
  recordLayoutShifts,
  texts,
  tokenColor,
  totalLayoutShift,
  waitForFonts,
} from './helpers.js'

const t = texts.ar
const THEMES = ['light', 'dark']
const inStockProduct = products.find((product) => product.inStock)
const featuredProduct = products.find((product) => product.featured)

function addButton(page, product) {
  return page
    .locator('#products')
    .getByRole('button', { name: `${t.cart.add}: ${product.name_ar}` })
}

function productCard(page, product) {
  return page.locator('#products article').filter({
    has: page.getByRole('heading', { name: product.name_ar, exact: true }),
  })
}

// The color in the middle of each moving circle that locator finds (--circle-color, see
// src/components/Circle.jsx), written the way the browser writes colors, so the checker can paint it.
function circleColors(locator) {
  return locator.evaluateAll((circles) =>
    circles.map((circle) => {
      const probe = document.createElement('div')
      probe.style.backgroundColor = 'var(--circle-color)'
      circle.append(probe)
      const color = getComputedStyle(probe).backgroundColor
      probe.remove()
      return color
    }),
  )
}

for (const theme of THEMES) {
  test.describe(`${theme} mode`, () => {
    test.use({ colorScheme: theme })

    test('60-30-10: off-white (or dark) page, navy bands, saffron only on the key actions', async ({
      page,
    }) => {
      await page.goto('./')
      const canvas = await tokenColor(page, 'canvas')
      const main = await tokenColor(page, 'main')
      const accent = await tokenColor(page, 'accent')

      await expect(page.locator('body')).toHaveCSS('background-color', canvas)
      for (const navyArea of ['header', '#home', '#offers', 'footer']) {
        await expect(page.locator(navyArea)).toHaveCSS('background-color', main)
      }

      // Saffron: Add to cart, the active filter, the "featured" badge and the cart count.
      await expect(addButton(page, inStockProduct)).toHaveCSS(
        'background-color',
        accent,
      )
      const filter = page.getByRole('group', {
        name: t.products.categoriesLabel,
      })
      await expect(
        filter.getByRole('button', { name: t.products.all }),
      ).toHaveCSS('background-color', accent)
      await expect(
        filter.getByRole('button', { name: categories[0].name_ar }),
      ).not.toHaveCSS('background-color', accent)
      if (featuredProduct) {
        await expect(
          productCard(page, featuredProduct).getByText(t.products.featured),
        ).toHaveCSS('background-color', accent)
      }
      await addButton(page, inStockProduct).click()
      await expect(
        page.locator('header').getByText('1', { exact: true }),
      ).toHaveCSS('background-color', accent)
    })

    test('all visible text passes AA contrast, on the page and in the dialogs', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 360, height: 800 })
      await page.goto('./')
      expect(await findLowContrastText(page)).toEqual([])

      await page
        .locator('#products')
        .getByRole('button', { name: products[0].name_ar, exact: true })
        .click()
      expect(await findLowContrastText(page)).toEqual([])
      await page.keyboard.press('Escape')

      await addButton(page, inStockProduct).click()
      await page.getByRole('button', { name: t.cart.open }).click()
      await expect(
        page.getByRole('dialog', { name: t.cart.title }),
      ).toBeVisible()
      expect(await findLowContrastText(page)).toEqual([])
      await page.keyboard.press('Escape')

      // The chat panel with a product answer: bubbles, chips, a product row and its buttons.
      await page.getByRole('button', { name: t.chat.open }).click()
      const chat = page.getByRole('dialog', { name: t.chat.title })
      await chat
        .getByRole('textbox', { name: t.chat.inputLabel })
        .fill(inStockProduct.name_ar)
      await chat.getByRole('button', { name: t.chat.send }).click()
      await expect(
        chat.getByText(t.chat.products, { exact: true }),
      ).toBeVisible()
      expect(await findLowContrastText(page)).toEqual([])
    })

    test('the moving circles never bring text below AA, even with all of them behind it at once', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 360, height: 800 })
      await page.goto('./')
      const heroCircles = page.locator('#home .circle')
      const pageCircles = page.locator('.circle:not(#home .circle)')
      await expect(heroCircles).not.toHaveCount(0)
      await expect(pageCircles).not.toHaveCount(0)

      // The worst moment that could ever happen: the strongest middle part of every circle
      // right behind the same text, on the page and in the hero.
      expect(
        await findLowContrastText(page, {
          body: await circleColors(pageCircles),
          '#home': await circleColors(heroCircles),
        }),
      ).toEqual([])
    })
  })
}

test('categories and highlights use one set of SVG icons, never emoji', async ({
  page,
}) => {
  await page.goto('./')
  const filter = page.getByRole('group', { name: t.products.categoriesLabel })

  for (const category of categories) {
    await expect(
      filter.getByRole('button', { name: category.name_ar }).locator('svg'),
    ).toHaveCount(1)
  }
  await expect(
    page.getByRole('region', { name: t.highlights.title }).locator('li svg'),
  ).toHaveCount(3)
  expect(await page.locator('body').innerText()).not.toMatch(
    /\p{Emoji_Presentation}/u,
  )
})

test('icons and decorations are hidden from screen readers', async ({
  page,
}) => {
  await page.goto('./')
  const visibleToScreenReaders = await page.evaluate(
    () =>
      [...document.querySelectorAll('svg')].filter(
        (svg) => !svg.closest('[aria-hidden="true"]'),
      ).length,
  )

  expect(visibleToScreenReaders).toBe(0)
})

test.describe('with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('cards fade and rise in when they scroll into view', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('./')
    const lastCard = page.locator('#products li').last()

    await expect(lastCard).toHaveCSS('opacity', '0')
    await lastCard.scrollIntoViewIfNeeded()
    await expect(lastCard).toHaveAttribute('data-revealed', 'true')
    await expect(lastCard).toHaveCSS('animation-name', 'reveal')
    await expect(lastCard).toHaveCSS('opacity', '1')
  })

  test('product cards that come into view together start one after another', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('./')
    const cards = page.locator('#products li')

    await cards.first().scrollIntoViewIfNeeded()
    await expect(cards.nth(3)).toHaveAttribute('data-revealed', 'true')
    const delays = await cards.evaluateAll((items) =>
      items
        .slice(0, 4)
        .map((item) =>
          parseFloat(item.style.getPropertyValue('--reveal-delay')),
        ),
    )

    for (let index = 1; index < delays.length; index++) {
      expect(delays[index]).toBeGreaterThan(delays[index - 1])
    }
    expect(Math.max(...delays)).toBeLessThanOrEqual(240)
  })

  test('cards and buttons react to hover and press, and the cart count pops', async ({
    page,
  }) => {
    await page.goto('./')
    const button = addButton(page, inStockProduct)
    await button.scrollIntoViewIfNeeded()
    // Wait until the card has finished fading in, so it does not rise away from under the mouse.
    const listItem = page.locator('#products li').filter({
      has: page.getByRole('button', {
        name: `${t.cart.add}: ${inStockProduct.name_ar}`,
      }),
    })
    await expect(listItem).toHaveAttribute('data-revealed', 'true')
    await expect
      .poll(() => listItem.evaluate((item) => item.getAnimations().length))
      .toBe(0)

    await button.hover()
    await expect(productCard(page, inStockProduct)).toHaveCSS(
      'translate',
      '0px -6px',
    )
    await expect(button).toHaveCSS('translate', '0px -2px')
    await page.mouse.down()
    await expect(button).toHaveCSS('scale', '0.97')
    await page.mouse.up()

    await expect(
      page.locator('header').getByText('1', { exact: true }),
    ).toHaveCSS('animation-name', 'pop')
  })

  test('the product dialog fades and rises in', async ({ page }) => {
    await page.goto('./')
    await page
      .locator('#products')
      .getByRole('button', { name: products[0].name_ar, exact: true })
      .click()

    const dialog = page.getByRole('dialog', { name: products[0].name_ar })
    await expect(dialog).toHaveCSS('transition-property', /opacity, translate/)
    await expect(dialog).toHaveCSS('opacity', '1')
  })

  test('the animations never shift the layout', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('./')
    // This test is about the animations, so it starts measuring once the web font is in.
    // A font that arrives late is checked on its own in e2e/layout.spec.js.
    await waitForFonts(page)
    await recordLayoutShifts(page)

    // Scroll down the whole page so every section and card animates in.
    const pageHeight = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < pageHeight; y += 400) {
      await page.mouse.wheel(0, 400)
      await page.waitForTimeout(50)
    }
    await expect(page.locator('#contact li').last()).toHaveCSS('opacity', '1')

    expect(await totalLayoutShift(page)).toBeLessThan(0.01)
  })
})

test('visitors who ask for less motion see every card at once, and nothing moves', async ({
  page,
}) => {
  // playwright.config.js asks for reduced motion in every test.
  await page.goto('./')
  const button = addButton(page, inStockProduct)

  await expect(page.locator('#products li').last()).toHaveCSS('opacity', '1')
  await button.hover()
  await expect(button).toHaveCSS('translate', 'none')
  await page.mouse.down()
  await expect(button).toHaveCSS('scale', 'none')
  await page.mouse.up()
  await expect(
    page.locator('header').getByText('1', { exact: true }),
  ).toHaveCSS('animation-name', 'none')
})

// Two extra screenshots for a visual check, next to the usual ones from layout.spec.js and theme.spec.js.
// The sticky header is hidden in the products one, so it does not cover the cards.
test('screenshot: the hero in Arabic at 1280px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('./')
  await page.locator('#home').screenshot({ path: 'screenshots/hero.png' })
})

test.describe('dark mode screenshot', () => {
  test.use({ colorScheme: 'dark' })

  test('screenshot: the products grid in dark mode at 1280px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('./')
    await page.locator('#products').screenshot({
      path: 'screenshots/products-dark.png',
      style: 'header { visibility: hidden; }',
    })
  })
})
