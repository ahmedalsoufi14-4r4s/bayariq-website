import { expect, test } from '@playwright/test'
import { store, texts } from './helpers.js'

test('language button switches between Arabic and English and remembers the choice', async ({
  page,
}) => {
  await page.goto('./')
  const html = page.locator('html')
  await expect(html).toHaveAttribute('dir', 'rtl')

  await page.getByRole('button', { name: texts.ar.switchLanguage }).click()
  await expect(html).toHaveAttribute('lang', 'en')
  await expect(html).toHaveAttribute('dir', 'ltr')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    store.name_en,
  )

  await page.reload()
  await expect(html).toHaveAttribute('lang', 'en')

  await page.getByRole('button', { name: texts.en.switchLanguage }).click()
  await expect(html).toHaveAttribute('lang', 'ar')
  await expect(html).toHaveAttribute('dir', 'rtl')
})

test('skip link appears on the first Tab and points to the main content', async ({
  page,
}) => {
  await page.goto('./')
  await page.keyboard.press('Tab')

  const skipLink = page.getByRole('link', { name: texts.ar.skipToContent })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toHaveAttribute('href', '#main')

  // sr-only keeps the link 1px wide until it gets focus.
  const box = await skipLink.boundingBox()
  expect(box.width).toBeGreaterThan(1)
})
