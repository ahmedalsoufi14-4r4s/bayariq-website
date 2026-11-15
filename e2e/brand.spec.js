import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { openSite, products, store, texts, tokenColor } from './helpers.js'

const t = texts.ar
const inStockProduct = products.find((product) => product.inStock)
const outOfStockProduct = products.find((product) => !product.inStock)

// The exact logo colors from src/index.css (--color-logo-green and --color-logo-red).
const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
function logoColor(name) {
  return css.match(new RegExp(`--color-logo-${name}: (#[0-9a-f]{6});`))[1]
}

test('the favicon draws the logo mark in the exact logo colors', () => {
  const favicon = readFileSync(
    new URL('../public/favicon.svg', import.meta.url),
    'utf8',
  )
  expect(favicon).toContain(`fill="${logoColor('green')}"`)
  expect(favicon).toContain(`fill="${logoColor('red')}"`)
})

for (const theme of ['light', 'dark']) {
  test.describe(`${theme} mode`, () => {
    test.use({ colorScheme: theme })

    test('the header shows the logo mark on a white plate, in the exact logo colors', async ({
      page,
    }) => {
      await page.goto('./')
      // The mark is hidden from screen readers, so the link's name is the store name.
      const plate = page
        .locator('header')
        .getByRole('link', { name: store.name_ar, exact: true })
        .locator('span')
        .first()
      const mark = plate.locator('svg')

      await expect(plate).toHaveCSS(
        'background-color',
        await tokenColor(page, 'logo-paper'),
      )
      await expect(mark).toHaveAttribute('aria-hidden', 'true')
      await expect(mark.locator('[class*="fill-logo-green"]')).toHaveCSS(
        'fill',
        await tokenColor(page, 'logo-green'),
      )
      await expect(mark.locator('[class*="fill-logo-red"]').first()).toHaveCSS(
        'fill',
        await tokenColor(page, 'logo-red'),
      )
    })

    test('the footer shows the full logo on a white plate, twice its size for sharp screens', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto('./')
      const logo = page.locator('footer').getByRole('img', {
        name: t.footer.logoAlt,
      })
      // Photos are lazy-loaded: the logo loads once it is scrolled into view.
      await logo.evaluate((image) => image.scrollIntoView())

      await expect(logo).toHaveAttribute('src', /logo\.webp$/)
      await expect(logo).toHaveAttribute('loading', 'lazy')
      await expect(logo.locator('..')).toHaveCSS(
        'background-color',
        await tokenColor(page, 'logo-paper'),
      )
      await expect
        .poll(() =>
          logo.evaluate((image) => image.complete && image.naturalWidth),
        )
        .toBe(640)
      const { width } = await logo.boundingBox()
      expect(width).toBe(320)
    })

    test('red never sits right on green: red things in green bands have a white ring, and the menu, focus and title bar turn white there', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto('./')
      const onMain = await tokenColor(page, 'on-main')
      const whiteRing = new RegExp(
        `${onMain.replace(/[()]/g, '\\$&')} 0px 0px 0px 2px`,
      )

      // The first Tab lands on the skip link in the green header: its outline is white.
      await page.keyboard.press('Tab')
      await expect(page.locator(':focus')).toHaveCSS('outline-color', onMain)

      await page
        .locator('#products')
        .getByRole('button', {
          name: `${t.cart.add}: ${inStockProduct.name_ar}`,
        })
        .click()
      const redOnGreen = [
        page.locator('#home').getByRole('link', { name: t.hero.browse }),
        page.locator('#home .tile-bob[class*="bg-accent"]'),
        page.locator('header').getByText('1', { exact: true }),
        page.getByRole('button', { name: t.chat.open }),
      ]
      for (const element of redOnGreen) {
        await expect(element).toHaveCSS(
          'background-color',
          await tokenColor(page, 'accent'),
        )
        await expect(element).toHaveCSS('box-shadow', whiteRing)
      }

      // The bar under a section title: red on the white page, white in the green offers band.
      const bar = (id) =>
        page
          .locator(`#${id}`)
          .evaluate(
            (title) => getComputedStyle(title, '::after').backgroundColor,
          )
      expect(await bar('products-title')).toBe(await tokenColor(page, 'accent'))
      expect(await bar('offers-title')).toBe(onMain)
    })
  })
}

for (const language of ['ar', 'en']) {
  test(`at 360px in ${language === 'ar' ? 'Arabic' : 'English'} the store name shows in full next to the mark, never cut off`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await openSite(page, language)
    const name = page
      .locator('header')
      .getByRole('link', { name: store[`name_${language}`], exact: true })
      .locator('span')
      .last()
    // line-clamp cuts the text with "…" when it needs more lines than it may show: then the
    // text inside is taller than the box.
    await expect
      .poll(() =>
        name.evaluate(
          (element) => element.scrollHeight <= element.clientHeight,
        ),
      )
      .toBe(true)
  })
}

test('warnings and statuses show an icon with their text, never color alone', async ({
  page,
}) => {
  await openSite(page, 'ar')
  if (outOfStockProduct) {
    const badge = page
      .locator('#products article')
      .filter({
        has: page.getByRole('heading', {
          name: outOfStockProduct.name_ar,
          exact: true,
        }),
      })
      .getByText(t.products.outOfStock)
    await expect(badge.locator('svg')).toHaveCount(1)
  }

  // Why "send order" is off: an icon and the reason in words.
  await page.getByRole('button', { name: t.cart.open }).click()
  const hint = page.locator('#send-hint')
  await expect(hint).toHaveText(/\S/)
  await expect(hint.locator('svg')).toHaveCount(1)
})
