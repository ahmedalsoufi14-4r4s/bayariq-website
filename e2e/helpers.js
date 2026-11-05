import { readFileSync } from 'node:fs'

function readJson(relativePath) {
  return JSON.parse(
    readFileSync(new URL(relativePath, import.meta.url), 'utf8'),
  )
}

// The tests read the same data and texts as the site, so they keep passing when the content changes.
export const store = readJson('../src/data/store.json')
export const categories = readJson('../src/data/categories.json')
export const products = readJson('../src/data/products.json')
export const offers = readJson('../src/data/offers.json')
export const tourSteps = readJson('../src/data/tour.json')
export const texts = {
  ar: readJson('../src/i18n/ar.json'),
  en: readJson('../src/i18n/en.json'),
}

// Same key as in src/i18n/LanguageProvider.jsx.
const LANGUAGE_KEY = 'bayariq-language'

// Opens the home page in the given language.
// Returns a list that collects every console error and uncaught page error.
export async function openSite(page, language) {
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  await page.addInitScript(
    ([key, value]) => localStorage.setItem(key, value),
    [LANGUAGE_KEY, language],
  )
  await page.goto('./')
  return errors
}

// A color token from src/index.css (for example "main"), as the browser writes colors: "rgb(20, 40, 75)".
export function tokenColor(page, name) {
  return page.evaluate((token) => {
    const probe = document.createElement('div')
    probe.style.color = `var(--color-${token})`
    document.body.append(probe)
    const color = getComputedStyle(probe).color
    probe.remove()
    return color
  }, name)
}

// Waits until every web font has loaded and the page has been drawn with it (two frames).
export function waitForFonts(page) {
  return page.evaluate(async () => {
    await document.fonts.ready
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    )
  })
}

// Starts recording layout shifts: content that moves without the visitor doing anything.
// Each shift keeps the elements that moved, so totalLayoutShift() can print what moved.
// With fromPageStart, it also counts the shifts since the page started loading.
export function recordLayoutShifts(page, { fromPageStart = false } = {}) {
  return page.evaluate((buffered) => {
    const position = (rect) =>
      `x ${Math.round(rect.x)} y ${Math.round(rect.y)} (${Math.round(rect.width)}×${Math.round(rect.height)})`
    window.layoutShifts = []
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue
        window.layoutShifts.push({
          value: entry.value,
          time: Math.round(entry.startTime),
          sources: entry.sources.map(({ node, previousRect, currentRect }) => {
            const element =
              node?.nodeType === Node.TEXT_NODE ? node.parentElement : node
            const name = element
              ? `<${element.tagName.toLowerCase()}> "${element.textContent.trim().slice(0, 30)}"`
              : '(removed element)'
            return `${name}: ${position(previousRect)} → ${position(currentRect)}`
          }),
        })
      }
    }).observe({ type: 'layout-shift', buffered })
  }, fromPageStart)
}

// Prints each recorded shift with what moved (before → after) and returns their total,
// the same score as Lighthouse's Cumulative Layout Shift. Under 0.01 means nothing visibly jumps.
export async function totalLayoutShift(page) {
  const shifts = await page.evaluate(() => window.layoutShifts)
  for (const shift of shifts) {
    console.log(`layout shift ${shift.value.toFixed(4)} at ${shift.time} ms`)
    for (const source of shift.sources) console.log(`  ${source}`)
  }
  return shifts.reduce((sum, shift) => sum + shift.value, 0)
}

// Finds visible text that fails WCAG AA: 4.5:1, or 3:1 for large text (24 px, or 18.66 px bold).
// For each piece of text it paints the backgrounds behind it and then the text color on a
// one-pixel canvas, so see-through colors (like text-on-main/80) are measured as they look.
// Disabled buttons are left out, because AA does not cover them.
// backdrops adds colors that float between a solid background and the text, like the moving
// circles: { body: [colors], '#home': [colors] } paints them right after the page's or the
// hero's own background, for all the text in front of it.
export function findLowContrastText(page, backdrops = {}) {
  return page.evaluate((backdropsBySelector) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })

    function paint(colors) {
      context.clearRect(0, 0, 1, 1)
      for (const color of colors) {
        context.fillStyle = color
        context.fillRect(0, 0, 1, 1)
      }
      return [...context.getImageData(0, 0, 1, 1).data]
    }

    // The backgrounds behind an element: from the nearest solid one up to the element itself.
    function backgroundLayers(element) {
      const layers = []
      for (let node = element; node; node = node.parentElement) {
        const color = getComputedStyle(node).backgroundColor
        layers.unshift(color)
        if (paint([color])[3] === 255) {
          for (const [selector, colors] of Object.entries(
            backdropsBySelector,
          )) {
            if (node.matches(selector)) layers.splice(1, 0, ...colors)
          }
          break
        }
      }
      return layers
    }

    function luminance([red, green, blue]) {
      const [r, g, b] = [red, green, blue].map((value) => {
        const channel = value / 255
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const failures = []
    for (const element of document.body.querySelectorAll('*')) {
      const hasText = [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
      )
      if (!hasText || element.closest(':disabled')) continue
      const box = element.getBoundingClientRect()
      const isVisible =
        box.width > 1 &&
        box.height > 1 &&
        element.checkVisibility({
          opacityProperty: true,
          visibilityProperty: true,
        })
      if (!isVisible) continue

      const style = getComputedStyle(element)
      const layers = backgroundLayers(element)
      const background = luminance(paint(layers))
      const text = luminance(paint([...layers, style.color]))
      const ratio =
        (Math.max(background, text) + 0.05) /
        (Math.min(background, text) + 0.05)
      const size = parseFloat(style.fontSize)
      const isLarge =
        size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700)
      if (ratio < (isLarge ? 3 : 4.5)) {
        failures.push(`${element.textContent.trim()} (${ratio.toFixed(2)}:1)`)
      }
    }
    return failures
  }, backdrops)
}
