import { readdirSync, readFileSync, statSync } from 'node:fs'
import { catalog, categories, categoryProducts, products } from './helpers.js'
import { expect, test } from './test.js'

// Checks of the product files the site loads (public/data/, made by `npm run products`).
// They read files only and open no page.

function readJson(path) {
  return JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url)))
}

const posProducts = readJson('data/supermarket.json')
const hidden = readJson('data/hidden-products.json')
const attaraIds = readJson('data/attara-moves.json')
const featuredIds = readJson('data/featured-products.json')
const allProducts = categories.flatMap((category) =>
  categoryProducts(category.id),
)
const idsOnSite = new Set(allProducts.map((product) => product.id))

// Every file under a folder of the project, for searching them all.
function filesUnder(path) {
  const folder = new URL(`../${path}/`, import.meta.url)
  return readdirSync(folder, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `${entry.parentPath}/${entry.name}`)
}

test('the catalog and the category files agree with categories.json', () => {
  expect(catalog.categories.map((category) => category.id)).toEqual(
    categories.map((category) => category.id),
  )
  for (const [index, category] of catalog.categories.entries()) {
    expect(category.name).toEqual({
      ar: categories[index].name_ar,
      en: categories[index].name_en,
    })
    expect(categoryProducts(category.id)).toHaveLength(category.count)
  }
  expect(catalog.productCount).toBe(allProducts.length)
})

test('every product appears once, with a name, a price and a unit', () => {
  expect(idsOnSite.size).toBe(allProducts.length)
  // One expect for all of them: an expect for each of 16,000 products takes minutes.
  const incomplete = allProducts.filter(
    (product) =>
      product.name.trim() === '' ||
      !(product.price > 0) ||
      !['piece', 'kg'].includes(product.unit),
  )
  expect(incomplete).toEqual([])
})

test('no single file is big: the 2 MB list is never loaded at once', () => {
  const files = filesUnder('public/data')
  // One per category, the catalog and the photo credits.
  expect(files).toHaveLength(categories.length + 2)
  for (const file of files) {
    expect(statSync(file).size, file).toBeLessThan(400 * 1024)
  }
})

test('the 200 products of the review sheet are hidden', () => {
  const review = [...hidden.sameNameDifferentPrices, ...hidden.veryHighPrice]
  expect(hidden.sameNameDifferentPrices).toHaveLength(129)
  expect(hidden.veryHighPrice).toHaveLength(71)
  expect(new Set(review).size).toBe(200)
  expect(review.filter((id) => idsOnSite.has(id))).toEqual([])
})

test('every other supermarket product is on the site', () => {
  const hiddenIds = new Set(Object.values(hidden).flat())
  const missing = posProducts.filter(
    (product) => !hiddenIds.has(product.id) && !idsOnSite.has(product.id),
  )
  expect(missing).toEqual([])
})

test('the 18 featured products are on the site, and first in their categories', () => {
  expect(featuredIds).toHaveLength(18)
  expect(products.map((product) => product.id)).toEqual(featuredIds)
  for (const category of categories) {
    const list = categoryProducts(category.id)
    const featured = products.filter((item) => item.category === category.id)
    expect(list.slice(0, featured.length)).toEqual(featured)
    expect(list.slice(featured.length).some((item) => item.featured)).toBe(
      false,
    )
  }
})

test('the Attara moves are in the Attara category, without false matches, and listed in attara-moves.md', () => {
  const attara = categoryProducts('spices')
  const moved = attara.filter((product) => attaraIds.includes(product.id))
  expect(moved).toHaveLength(attaraIds.length)
  for (const product of moved) {
    expect(product.name, product.id).not.toMatch(
      /شامبو|صابون|ايس ?كريم|شوكولا|بسكويت|لوزين|كاكاو|نسكافيه|حلاوة|زبدة/,
    )
  }

  const list = readFileSync(
    new URL('../attara-moves.md', import.meta.url),
    'utf8',
  )
  const nameOf = Object.fromEntries(categories.map((c) => [c.id, c.name_ar]))
  for (const product of posProducts) {
    if (!attaraIds.includes(product.id)) continue
    expect(list).toContain(`| ${product.id} | `)
    expect(list).toContain(nameOf[product.category])
  }
})

test('price-check.md lists pack counts priced like one piece, and hides nothing', () => {
  const list = readFileSync(
    new URL('../price-check.md', import.meta.url),
    'utf8',
  )
  const ids = [...list.matchAll(/^\| (\d+) \|/gm)].map((match) => match[1])
  expect(ids.length).toBeGreaterThan(100)
  // "رز ابو بنت امريكي 4 * 10 كجم" at 71 SAR is the price of one 10 kg bag.
  expect(list).toContain('رز ابو بنت امريكي 4 \\* 10 كجم')
  expect(ids.filter((id) => !idsOnSite.has(id))).toEqual([])
})

test('Nafhat Bun is nowhere on the site: not in the data, the texts or the built files', () => {
  const files = [
    ...filesUnder('public/data'),
    ...filesUnder('src/data'),
    ...filesUnder('src/i18n'),
    ...filesUnder('dist').filter((file) => /\.(html|js|json|css)$/.test(file)),
  ]
  expect(files.length).toBeGreaterThan(categories.length * 2)
  for (const file of files) {
    expect(readFileSync(file, 'utf8'), file).not.toMatch(/نفحة بن|nafhat|"nb-/i)
  }
  // Its products are kept, but outside the deployed folder.
  expect(readJson('extras/nafhat-bun/nafhat-bun.json')).toHaveLength(2734)
})
