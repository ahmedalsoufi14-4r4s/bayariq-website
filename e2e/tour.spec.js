import { expect, test } from '@playwright/test'
import {
  findLowContrastText,
  openSite,
  products,
  texts,
  tourSteps,
  waitForFonts,
} from './helpers.js'

const t = texts.ar

// Every other test starts as a returning visitor (playwright.config.js). These start with
// empty storage: a first visit, so the tour opens by itself.
test.use({ storageState: { cookies: [], origins: [] } })

// The steps the tour shows: "Add to cart" only when a product is in stock.
const steps = tourSteps.filter(
  (step) => step.id !== 'add' || products.some((product) => product.inStock),
)
const SPOTLIGHT_PADDING = 8

function tour(page, language = 'ar') {
  return page.getByRole('dialog', { name: texts[language].tour.label })
}

function tooltip(page) {
  return page.locator('.tour-tooltip')
}

function spotlight(page) {
  return page.locator('.tour-spotlight')
}

function counter(page, current, language = 'ar') {
  return tour(page, language).getByText(`${current} / ${steps.length}`, {
    exact: true,
  })
}

// "Next", or "Start shopping" on the last step.
function nextButton(page, index, language = 'ar') {
  const { tour: tourTexts } = texts[language]
  const name = index === steps.length - 1 ? tourTexts.done : tourTexts.next
  return tour(page, language).getByRole('button', { name, exact: true })
}

// True when the spotlight sits exactly around the element, with its padding.
async function spotlightIsOn(page, target) {
  const [spot, box] = await Promise.all([
    spotlight(page).boundingBox(),
    target.boundingBox(),
  ])
  const expected = {
    x: box.x - SPOTLIGHT_PADDING,
    y: box.y - SPOTLIGHT_PADDING,
    width: box.width + SPOTLIGHT_PADDING * 2,
    height: box.height + SPOTLIGHT_PADDING * 2,
  }
  return ['x', 'y', 'width', 'height'].every(
    (side) => Math.abs(spot[side] - expected[side]) < 1,
  )
}

// Waits until nothing in the element is still sliding or fading in.
function waitUntilStill(locator) {
  return expect
    .poll(() =>
      locator.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    )
    .toBe(0)
}

test('the tour opens by itself on the first visit, and never again', async ({
  page,
}) => {
  await page.goto('./')
  await expect(tour(page)).toBeVisible()
  await expect(counter(page, 1)).toBeVisible()
  await expect(tour(page).getByRole('heading')).toHaveText(
    t.tour.steps[steps[0].id].title,
  )
  // Screen readers hear the step: the dialog is described by it, and new steps are read out.
  await expect(tour(page)).toHaveAccessibleDescription(
    new RegExp(t.tour.steps[steps[0].id].title),
  )
  await expect(page.locator('#tour-step')).toHaveAttribute(
    'aria-live',
    'polite',
  )

  // It is remembered as soon as it starts, so even a reload before the end does not bring it back.
  expect(
    await page.evaluate(() => localStorage.getItem('bayariq-tour-seen')),
  ).toBe('yes')
  await page.reload()
  await waitForFonts(page)
  await expect(tour(page)).toHaveCount(0)
})

for (const width of [360, 1280]) {
  test(`at ${width}px each step puts the spotlight on its element, on screen, with its text`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('./')

    for (const [index, step] of steps.entries()) {
      await expect(counter(page, index + 1)).toBeVisible()
      await expect(tour(page).getByRole('heading')).toHaveText(
        t.tour.steps[step.id].title,
      )
      await expect(
        tour(page).getByText(t.tour.steps[step.id].text),
      ).toBeVisible()

      const target = page.locator(step.target).first()
      await expect.poll(() => spotlightIsOn(page, target), step.id).toBe(true)
      const box = await target.boundingBox()
      expect(box.y, step.id).toBeGreaterThanOrEqual(0)
      expect(box.y + box.height, step.id).toBeLessThanOrEqual(800)

      await nextButton(page, index).click()
    }
    await expect(tour(page)).toBeHidden()
  })
}

test('Next and Back move between steps, Skip ends the tour, and the page is given back', async ({
  page,
}) => {
  await page.goto('./')
  const back = tour(page).getByRole('button', { name: t.tour.back })
  await expect(nextButton(page, 0)).toBeFocused()
  await expect(back).toHaveCount(0)

  await nextButton(page, 0).click()
  await expect(counter(page, 2)).toBeVisible()
  await back.click()
  await expect(counter(page, 1)).toBeVisible()
  await expect(nextButton(page, 0)).toBeFocused()

  // Further down the page, then Skip: the page scrolls back to where it was.
  await nextButton(page, 0).click()
  await nextButton(page, 1).click()
  await expect(counter(page, 3)).toBeVisible()
  await tour(page).getByRole('button', { name: t.tour.skip }).click()
  await expect(tour(page)).toBeHidden()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)

  // Focus is back on the page: the first Tab reaches the skip link, as on any visit.
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: t.skipToContent })).toBeFocused()
})

test('the keyboard alone goes through the tour, and Escape skips it', async ({
  page,
}) => {
  await page.goto('./')
  await expect(nextButton(page, 0)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(counter(page, 2)).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(counter(page, 3)).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(tour(page)).toBeHidden()
  await page.reload()
  await waitForFonts(page)
  await expect(tour(page)).toHaveCount(0)
})

for (const language of ['ar', 'en']) {
  test(`at 360px in ${language === 'ar' ? 'Arabic' : 'English'} every tooltip fits on screen, with 44px buttons`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await openSite(page, language)
    await expect(page.locator('html')).toHaveAttribute(
      'dir',
      language === 'ar' ? 'rtl' : 'ltr',
    )
    const tourTexts = texts[language].tour

    for (const [index, step] of steps.entries()) {
      await expect(counter(page, index + 1, language)).toBeVisible()
      await expect(tour(page, language).getByRole('heading')).toHaveText(
        tourTexts.steps[step.id].title,
      )
      const box = await tooltip(page).boundingBox()
      expect(box.x, step.id).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width, step.id).toBeLessThanOrEqual(360)
      expect(box.y, step.id).toBeGreaterThanOrEqual(0)
      expect(box.y + box.height, step.id).toBeLessThanOrEqual(800)

      for (const button of await tour(page, language)
        .getByRole('button')
        .all()) {
        const size = await button.boundingBox()
        expect(size.height, await button.textContent()).toBeGreaterThanOrEqual(
          44,
        )
      }
      await nextButton(page, index, language).click()
    }
  })
}

test('"take the tour again" in the chat restarts the tour, and focus comes back to the chat button', async ({
  page,
}) => {
  await page.goto('./')
  await expect(tour(page)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(tour(page)).toBeHidden()

  const chatButton = page.getByRole('button', { name: t.chat.open })
  await chatButton.click()
  const chat = page.getByRole('dialog', { name: t.chat.title })
  await chat.getByRole('button', { name: t.tour.again }).click()
  await expect(tour(page)).toBeVisible()
  await expect(counter(page, 1)).toBeVisible()
  await expect(chat).toBeHidden()

  await page.keyboard.press('Escape')
  await expect(tour(page)).toBeHidden()
  await expect(chatButton).toBeFocused()
})

test('the footer link restarts the tour, and afterwards the page is back at the footer', async ({
  page,
}) => {
  await page.goto('./')
  await expect(tour(page)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(tour(page)).toBeHidden()

  const link = page
    .locator('footer')
    .getByRole('button', { name: t.tour.again })
  await link.click()
  await expect(counter(page, 1)).toBeVisible()
  for (const index of steps.keys()) {
    await nextButton(page, index).click()
  }
  await expect(tour(page)).toBeHidden()
  await expect(link).toBeFocused()
  await expect(link).toBeInViewport()
})

test('visitors who ask for less motion get a spotlight and tooltip that jump, with no animation', async ({
  page,
}) => {
  // playwright.config.js asks for reduced motion in every test.
  await page.goto('./')
  await nextButton(page, 0).click()
  await expect(counter(page, 2)).toBeVisible()
  for (const element of [tour(page), spotlight(page), tooltip(page)]) {
    await expect(element).toHaveCSS('transition-duration', '0s')
  }
  await expect(tooltip(page).locator('.card > div > div')).toHaveCSS(
    'animation-name',
    'none',
  )
})

test.describe('with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('the spotlight and the tooltip glide between steps, and react to the pointer', async ({
    page,
  }) => {
    await page.goto('./')
    await expect(tour(page)).toBeVisible()
    await expect(spotlight(page)).toHaveAttribute('data-ready', 'true')
    await expect(spotlight(page)).toHaveCSS(
      'transition-property',
      'translate, width, height, border-radius',
    )
    await expect(spotlight(page)).toHaveCSS('transition-duration', '0.3s')
    await expect(tooltip(page)).toHaveCSS('transition-property', 'translate')

    // The tooltip is a card: it lifts under the pointer.
    await waitUntilStill(tour(page))
    const card = tooltip(page).locator('.card')
    await card.hover()
    await expect(card).toHaveCSS('translate', '0px -6px')

    // The spotlight's second ring glows under the pointer.
    await spotlight(page).hover()
    await expect
      .poll(() =>
        spotlight(page).evaluate(
          (element) => getComputedStyle(element, '::after').opacity,
        ),
      )
      .toBe('1')
  })
})

for (const theme of ['light', 'dark']) {
  test.describe(`${theme} mode`, () => {
    test.use({ colorScheme: theme })

    test('every step of the tour passes AA contrast', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 })
      await page.goto('./')
      for (const index of steps.keys()) {
        await expect(counter(page, index + 1)).toBeVisible()
        expect(await findLowContrastText(page)).toEqual([])
        await nextButton(page, index).click()
      }
    })
  })
}

// Screenshots for a visual check (screenshots/ is git-ignored).
test('screenshot: the tour in Arabic at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await openSite(page, 'ar')
  const index = steps.findIndex((step) => step.id === 'add')
  for (const step of steps.keys()) {
    if (step === index) break
    await nextButton(page, step).click()
  }
  await expect(counter(page, index + 1)).toBeVisible()
  await page.screenshot({ path: 'screenshots/tour-ar-360.png' })
})

test('screenshot: the tour in English at 1280px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await openSite(page, 'en')
  await nextButton(page, 0, 'en').click()
  await nextButton(page, 1, 'en').click()
  await expect(counter(page, 3, 'en')).toBeVisible()
  await page.screenshot({ path: 'screenshots/tour-en-1280.png' })
})

test.describe('dark mode screenshot', () => {
  test.use({ colorScheme: 'dark' })

  test('screenshot: the last step in dark mode at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('./')
    for (const index of steps.keys()) {
      if (index === steps.length - 1) break
      await nextButton(page, index).click()
    }
    await expect(counter(page, steps.length)).toBeVisible()
    await page.screenshot({ path: 'screenshots/tour-dark-360.png' })
  })
})
