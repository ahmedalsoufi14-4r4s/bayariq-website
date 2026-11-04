import { readFileSync } from 'node:fs'

function readJson(relativePath) {
  return JSON.parse(
    readFileSync(new URL(relativePath, import.meta.url), 'utf8'),
  )
}

// The tests read the same data and texts as the site, so they keep passing when the content changes.
export const store = readJson('../src/data/store.json')
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
