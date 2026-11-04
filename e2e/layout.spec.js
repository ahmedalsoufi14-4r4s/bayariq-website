import { expect, test } from '@playwright/test'
import { openSite, store } from './helpers.js'

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
