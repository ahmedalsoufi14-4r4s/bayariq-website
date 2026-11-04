import { expect, test } from '@playwright/test'
import { openSite, texts } from './helpers.js'

const t = texts.ar
const WHITE = 'rgb(255, 255, 255)'

function themeButton(page) {
  return page.getByRole('button', { name: t.darkMode })
}

test('with no saved choice, the site follows the device setting', async ({
  page,
}) => {
  const html = page.locator('html')

  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('./')
  await expect(html).toContainClass('dark')
  await expect(themeButton(page)).toHaveAttribute('aria-pressed', 'true')

  await page.emulateMedia({ colorScheme: 'light' })
  await page.reload()
  await expect(html).not.toContainClass('dark')
  await expect(themeButton(page)).toHaveAttribute('aria-pressed', 'false')
})

test('the button switches the theme, and the saved choice beats the device setting', async ({
  page,
}) => {
  const html = page.locator('html')
  const body = page.locator('body')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('./')
  await expect(body).toHaveCSS('background-color', WHITE)

  await themeButton(page).click()
  await expect(html).toContainClass('dark')
  await expect(themeButton(page)).toHaveAttribute('aria-pressed', 'true')
  await expect(body).not.toHaveCSS('background-color', WHITE)
  await page.reload()
  await expect(html).toContainClass('dark')

  await themeButton(page).click()
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.reload()
  await expect(html).not.toContainClass('dark')
})

test('dark mode in Arabic at 360px: no console errors and no sideways scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.emulateMedia({ colorScheme: 'dark' })
  const errors = await openSite(page, 'ar')
  await page.waitForLoadState('networkidle')

  await expect(page.locator('html')).toContainClass('dark')
  const hasSidewaysScroll = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  )
  expect(hasSidewaysScroll).toBe(false)
  expect(errors).toEqual([])

  await page.screenshot({ path: 'screenshots/ar-360-dark.png', fullPage: true })
})
