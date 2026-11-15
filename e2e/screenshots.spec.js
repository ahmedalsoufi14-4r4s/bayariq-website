import { expect, test } from '@playwright/test'
import { openSite, products, texts, waitForFonts } from './helpers.js'

// The design check from CLAUDE.md ("Checks before finishing"): the whole page, the open chat
// and one tour step, on a phone in Arabic and on a desktop in English, in light and dark
// mode. screenshots/ is git-ignored; look at them after every design change. Is the 60-30-10
// split visible, and is saffron rare and on the right things?
const SCREENS = [
  { width: 360, language: 'ar' },
  { width: 1280, language: 'en' },
]

for (const theme of ['light', 'dark']) {
  test.describe(`${theme} mode`, () => {
    test.use({ colorScheme: theme })

    for (const { width, language } of SCREENS) {
      const name = `${language}-${width}-${theme}`
      const t = texts[language]

      test(`screenshots: page, chat and tour step, ${name}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 800 })
        await openSite(page, language)
        await waitForFonts(page)
        await page.screenshot({
          path: `screenshots/page-${name}.png`,
          fullPage: true,
        })

        // The chat with a product answer: bubbles, a found product and chips.
        await page.getByRole('button', { name: t.chat.open }).click()
        const chat = page.getByRole('dialog', { name: t.chat.title })
        await chat
          .getByRole('textbox', { name: t.chat.inputLabel })
          .fill(products[0][`name_${language}`])
        await chat.getByRole('button', { name: t.chat.send }).click()
        await expect(
          chat.getByText(t.chat.products, { exact: true }),
        ).toBeVisible()
        await page.screenshot({ path: `screenshots/chat-${name}.png` })
        await page.keyboard.press('Escape')

        // The third tour step (the search and the category buttons), started from the footer.
        await page.getByRole('button', { name: t.tour.again }).click()
        const tour = page.getByRole('dialog', { name: t.tour.label })
        for (let step = 0; step < 2; step++) {
          await tour.getByRole('button', { name: t.tour.next }).click()
        }
        await expect(tour.getByText(/^3 \//)).toBeVisible()
        await page.screenshot({ path: `screenshots/tour-${name}.png` })
      })
    }
  })
}
