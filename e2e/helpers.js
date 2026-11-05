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
