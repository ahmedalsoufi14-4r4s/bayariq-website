import { expect, test } from '@playwright/test'
import { openSite, products, store, texts } from './helpers.js'

const LANGUAGES = ['ar', 'en']
const WIDTHS = [360, 1280]

// Only these two are saved to screenshots/ for a visual check.
const SCREENSHOTS = ['ar-360', 'en-1280']

for (const language of LANGUAGES) {
  for (const width of WIDTHS) {
    test(`${language} at ${width}px: right direction, no console errors, no sideways scrolling, no placeholder text`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 })
      const errors = await openSite(page, language)
      await page.waitForLoadState('networkidle')

      const html = page.locator('html')
      await expect(html).toHaveAttribute('lang', language)
      await expect(html).toHaveAttribute(
        'dir',
        language === 'ar' ? 'rtl' : 'ltr',
      )
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        store[`name_${language}`],
      )

      const hasSidewaysScroll = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      )
      expect(hasSidewaysScroll).toBe(false)
      expect(errors).toEqual([])

      // Missing details must show as "coming soon" or be hidden, never as a raw tag.
      await expect(page.locator('body')).not.toContainText('NEEDS-AHMED')
      await expect(page.locator('body')).not.toContainText('TODO')

      const name = `${language}-${width}`
      if (SCREENSHOTS.includes(name)) {
        await page.screenshot({
          path: `screenshots/${name}.png`,
          fullPage: true,
        })
      }
    })
  }
}

// One product that can be added and, if there is one, one out-of-stock product with a disabled button.
const PRODUCTS_TO_CHECK = [
  products.find((product) => product.inStock),
  products.find((product) => !product.inStock),
].filter(Boolean)

for (const width of WIDTHS) {
  test(`at ${width}px the sticky header stays on top of product cards scrolled under it`, async ({
    page,
  }) => {
    // A short window lets even the last row of cards scroll up under the header.
    await page.setViewportSize({ width, height: 400 })
    await page.goto('./')

    for (const product of PRODUCTS_TO_CHECK) {
      const addButton = page.locator('#products').getByRole('button', {
        name: `${texts.ar.cart.add}: ${product.name_ar}`,
      })

      // Scroll until the middle of the button sits behind the middle of the header,
      // then ask the browser which element is drawn on top at that point.
      const result = await addButton.evaluate((button) => {
        const header = document.querySelector('header')
        const headerBox = header.getBoundingClientRect()
        const headerMiddle = headerBox.top + headerBox.height / 2
        const buttonBox = button.getBoundingClientRect()
        window.scrollBy(0, buttonBox.top + buttonBox.height / 2 - headerMiddle)

        const box = button.getBoundingClientRect()
        const x = box.left + box.width / 2
        const y = box.top + box.height / 2
        return {
          isUnderHeader: y > headerBox.top && y < headerBox.bottom,
          isHeaderOnTop: header.contains(document.elementFromPoint(x, y)),
        }
      })

      expect(result.isUnderHeader).toBe(true)
      expect(result.isHeaderOnTop, product.name_en).toBe(true)
    }
  })
}

// True when the dialog (or its dark backdrop) is what the browser draws at the middle of the header.
function coversHeader(dialog) {
  return dialog.evaluate((dialogElement) => {
    const headerBox = document.querySelector('header').getBoundingClientRect()
    const dialogBox = dialogElement.getBoundingClientRect()
    const x = dialogBox.left + dialogBox.width / 2
    const y = headerBox.top + headerBox.height / 2
    return dialogElement.contains(document.elementFromPoint(x, y))
  })
}

for (const width of WIDTHS) {
  test(`at ${width}px the product dialog and the cart drawer open above the sticky header`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('./')
    const t = texts.ar
    const product = products[0]

    await page
      .locator('#products')
      .getByRole('button', { name: product.name_ar, exact: true })
      .click()
    const productDialog = page.getByRole('dialog', { name: product.name_ar })
    await expect(productDialog).toBeVisible()
    expect(await coversHeader(productDialog)).toBe(true)
    await page.keyboard.press('Escape')

    await page.getByRole('button', { name: t.cart.open }).click()
    const cartDrawer = page.getByRole('dialog', { name: t.cart.title })
    await expect(cartDrawer).toBeVisible()
    expect(await coversHeader(cartDrawer)).toBe(true)
  })
}
