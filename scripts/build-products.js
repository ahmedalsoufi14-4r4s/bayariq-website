// Turns the POS data in data/ into the files the site loads from public/data/:
//   public/data/catalog.json              the categories with their counts, and the featured products
//   public/data/products/<category>.json  the products of one category, featured ones first
// It also writes attara-moves.md, the list of products moved into the Attara category.
// Run it with `npm run products` after changing anything in data/ or src/data/categories.json.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { markdownText } from './markdown.js'

// The category that the "attara" products move into (its id in the POS data is "spices").
const ATTARA = 'spices'

function projectFile(path) {
  return new URL(`../${path}`, import.meta.url)
}

function readJson(path) {
  return JSON.parse(readFileSync(projectFile(path), 'utf8'))
}

// No spaces or line breaks, so the files stay small.
function writeJson(path, data) {
  writeFileSync(projectFile(path), JSON.stringify(data))
}

const posCatalog = readJson('data/catalog.json')
const posProducts = readJson('data/supermarket.json')
const categories = readJson('src/data/categories.json')
const featuredIds = readJson('data/featured-products.json')
const attaraIds = new Set(readJson('data/attara-moves.json'))
// The lists of hidden ids, all in one set: { reason: [ids], ... } -> Set(ids).
const hiddenIds = new Set(
  Object.values(readJson('data/hidden-products.json')).flat(),
)

// The products the site shows: without the hidden ones, the attara ones in their new category,
// and the featured ones marked.
const products = posProducts
  .filter((product) => !hiddenIds.has(product.id))
  .map((product) => ({
    ...product,
    ...(attaraIds.has(product.id) && { category: ATTARA }),
    ...(featuredIds.includes(product.id) && { featured: true }),
  }))

// Featured products in the order of data/featured-products.json.
const featured = featuredIds
  .map((id) => products.find((product) => product.id === id))
  .filter(Boolean)

// Old files go first, so a category that no longer exists leaves nothing behind.
rmSync(projectFile('public/data'), { recursive: true, force: true })
mkdirSync(projectFile('public/data/products'), { recursive: true })

const catalogCategories = categories.map((category) => {
  const inCategory = products.filter((item) => item.category === category.id)
  const dataFile = `products/${category.id}.json`
  writeJson(`public/data/${dataFile}`, [
    ...featured.filter((item) => item.category === category.id),
    ...inCategory.filter((item) => !item.featured),
  ])
  return {
    id: category.id,
    name: { ar: category.name_ar, en: category.name_en },
    count: inCategory.length,
    dataFile,
  }
})

writeJson('public/data/catalog.json', {
  updatedAt: posCatalog.updatedAt,
  currency: posCatalog.currency,
  pricesIncludeVat: posCatalog.pricesIncludeVat,
  productCount: products.length,
  categories: catalogCategories,
  featured,
})

// attara-moves.md: every product that really moved, for Ahmed and the family to check.
const categoryName = Object.fromEntries(
  categories.map((category) => [category.id, category.name_ar]),
)
const moved = posProducts.filter(
  (product) => attaraIds.has(product.id) && !hiddenIds.has(product.id),
)
writeFileSync(
  projectFile('attara-moves.md'),
  `# Products moved into the Attara category

${moved.length} products moved into "${categoryName[ATTARA]}". To undo one, delete its id from \`data/attara-moves.json\` and run \`npm run products\`.

| Id | Name | Old category |
| --- | --- | --- |
${moved
  .map(
    (product) =>
      `| ${product.id} | ${markdownText(product.name)} | ${categoryName[product.category]} |`,
  )
  .join('\n')}
`,
)

const missing = featuredIds.filter(
  (id) => !featured.some((product) => product.id === id),
)
console.log(`Products on the site: ${products.length}`)
console.log(`Hidden: ${posProducts.length - products.length}`)
console.log(`Moved into Attara: ${moved.length}`)
console.log(
  `Featured: ${featured.length}. Skipped: ${missing.join(', ') || 'none'}`,
)
