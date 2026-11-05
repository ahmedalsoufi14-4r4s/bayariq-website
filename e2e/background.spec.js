import { expect, test } from '@playwright/test'

// Everything that moves in the background: the circles behind the page and in the hero, the
// layered waves at the edges of the navy bands, and the star pattern and tiles in the hero.
const MOVING = '.circle, .wave-layer, .stars-pan, .tile-bob'

// Where each element is drawn right now: its box, moved and stretched by its animations.
function boxes(locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect()
      return { x, y, width, height }
    }),
  )
}

// How far a box has moved or changed size since before, in pixels.
function distance(before, after) {
  return Math.max(
    Math.abs(after.x - before.x),
    Math.abs(after.y - before.y),
    Math.abs(after.width - before.width),
    Math.abs(after.height - before.height),
  )
}

// The length of each animation on an element, in seconds: "9s, 7s" gives [9, 7].
function durations(locator) {
  return locator.evaluate((element) =>
    getComputedStyle(element).animationDuration.split(',').map(parseFloat),
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

test.describe('with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('the waves and the circles visibly move within 3 seconds, without touching the page', async ({
    page,
  }) => {
    await page.goto('./')
    const waves = page.locator('.wave-layer')
    const circles = page.locator('.circle')
    // Three layers in each of the four waves: under the hero, around the offers, over the footer.
    await expect(waves).toHaveCount(12)
    await expect(circles).not.toHaveCount(0)

    for (const movers of [waves, circles]) {
      const before = await boxes(movers)
      // Every single one has moved by more than 20px.
      await expect
        .poll(
          async () => {
            const after = await boxes(movers)
            return Math.min(
              ...after.map((box, index) => distance(before[index], box)),
            )
          },
          { timeout: 3000 },
        )
        .toBeGreaterThan(20)
    }
  })

  test('the waves slide in 6 to 12 s, the circles loop in 10 to 20 s, and the hero moves faster', async ({
    page,
  }) => {
    await page.goto('./')

    for (const layer of await page.locator('.wave-layer').all()) {
      const [slide] = await durations(layer)
      expect(slide).toBeGreaterThanOrEqual(6)
      expect(slide).toBeLessThanOrEqual(12)
    }

    // 4 to 6 navy and saffron circles behind the page, some of them growing and shrinking.
    const pageCircles = page.locator('.circle:not(#home .circle)')
    const count = await pageCircles.count()
    expect(count).toBeGreaterThanOrEqual(4)
    expect(count).toBeLessThanOrEqual(6)
    const styles = await pageCircles.evaluateAll((circles) =>
      circles.map((circle) => circle.getAttribute('style')),
    )
    expect(styles.some((style) => style.includes('--circle-main'))).toBe(true)
    expect(styles.some((style) => style.includes('--circle-accent'))).toBe(true)
    await expect(page.locator('.circle-grow')).not.toHaveCount(0)

    // A swing goes there and back, so one loop takes twice its time.
    let slowestHeroSwing = 0
    for (const circle of await page.locator('#home .circle').all()) {
      const [x, y] = await durations(circle)
      slowestHeroSwing = Math.max(slowestHeroSwing, x, y)
    }
    for (const circle of await pageCircles.all()) {
      const [x, y] = await durations(circle)
      for (const swing of [x, y]) {
        expect(swing * 2).toBeGreaterThanOrEqual(10)
        expect(swing * 2).toBeLessThanOrEqual(20)
      }
      expect(Math.max(x, y)).toBeGreaterThan(slowestHeroSwing)
    }
  })

  test('the whole background stops while the tab is hidden, and moves again after', async ({
    page,
  }) => {
    await page.goto('./')
    const moving = page.locator(MOVING)

    await setTabHidden(page, true)
    for (const element of await moving.all()) {
      await expect(element).toHaveCSS(
        'animation-play-state',
        /^paused(, paused)*$/,
      )
    }
    const before = await boxes(moving)
    // Nothing to wait for when checking that nothing moves, so this waits half a second.
    await page.waitForTimeout(500)
    const after = await boxes(moving)
    after.forEach((box, index) => {
      expect(distance(before[index], box)).toBeLessThan(0.5)
    })

    await setTabHidden(page, false)
    for (const element of await moving.all()) {
      await expect(element).toHaveCSS(
        'animation-play-state',
        /^running(, running)*$/,
      )
    }
  })
})

test('visitors who ask for less motion get a still background', async ({
  page,
}) => {
  // playwright.config.js asks for reduced motion in every test.
  await page.goto('./')

  for (const element of await page.locator(MOVING).all()) {
    await expect(element).toHaveCSS('animation-name', 'none')
  }
})
