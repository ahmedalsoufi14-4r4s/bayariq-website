// Looks for product names with a pack count, like "رز 4 * 10 كجم" (4 bags of 10 kg), whose price
// looks like the price of one piece, and lists them in price-check.md. It changes nothing on the
// site: the family checks the list. Run it with `npm run price-check`.
//
// How it decides: it works out the price per kilo, liter or piece twice, once as if the price
// were for one piece (10 kg) and once as if it were for the whole pack (40 kg), and compares both
// with the usual price of similar products. A price that is far too low for the whole pack, but
// normal for one piece, goes on the list.
import { readFileSync, writeFileSync } from 'node:fs'
import { markdownText } from './markdown.js'

// A whole-pack price counts as far too low below one third of the usual price.
const TOO_LOW = 1 / 3
// Fewer similar products than this say too little about the usual price.
const MIN_SIMILAR = 5
// Up to this many pieces, a customer could really expect the whole pack for the price.
const SMALL_PACK = 12

// The units in product names, each with what it measures and how many kg, liters or pieces it is.
const UNITS = [
  { pattern: /^(كجم|كيلو|كغ|كغم|ك)(?![ء-ي])/, kind: 'kg', size: 1 },
  { pattern: /^(جم|جرام|غم|غرام|غ|ج)(?![ء-ي])/, kind: 'kg', size: 0.001 },
  { pattern: /^(لتر)(?![ء-ي])/, kind: 'liter', size: 1 },
  { pattern: /^(مل|ملي)(?![ء-ي])/, kind: 'liter', size: 0.001 },
  {
    pattern:
      /^(خيط|كيس|اكياس|ظرف|منديل|مناديل|حبة|حبات|حبه|قطعة|قطع|رول|فوطة|فوط|ورقة|علبة|كبسولة|كبسولات|باكت|حفاضة|حفاظة|حفاض)/,
    kind: 'piece',
    size: 1,
  },
]

// "6 * 6 * 70", with or without spaces around the stars.
const PACK_COUNT = /\d+(?:\.\d+)?(?:\s*[*×]\s*\d+(?:\.\d+)?)+/
// Offers and free extras have their own arithmetic, so they are left out.
const OFFER = /\+|مجان|عرض/

function readJson(path) {
  return JSON.parse(
    readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'),
  )
}

function findUnit(text) {
  return UNITS.find((unit) => unit.pattern.test(text.trim()))
}

// "رز 4 * 10 كجم" -> { count: 4, size: 10, kind: 'kg' }, or null without a pack count.
// A name that ends in plain numbers, like tissues "6 * 6 * 70", counts pieces.
function readPack(name) {
  const match = name.match(PACK_COUNT)
  if (!match || OFFER.test(name)) return null
  const numbers = match[0].split(/[*×]/).map(Number)
  const rest = name.slice(match.index + match[0].length)
  const endsInNumbers = numbers.length > 2 && rest.trim() === ''
  const unit =
    findUnit(rest) ?? (endsInNumbers ? { kind: 'piece', size: 1 } : null)
  if (!unit) return null
  const last = numbers.pop()
  const count = numbers.reduce((product, number) => product * number, 1)
  return count > 1 ? { count, size: last * unit.size, kind: unit.kind } : null
}

// The size of a product without a pack count: "سكر 5 كجم" -> { size: 5, kind: 'kg' }, or null.
function readSize(name) {
  if (/[*×]/.test(name)) return null
  const matches = [...name.matchAll(/(\d+(?:\.\d+)?)\s*([ء-ي]+)/g)]
  for (const match of matches.reverse()) {
    const unit = findUnit(match[2])
    if (unit) return { size: Number(match[1]) * unit.size, kind: unit.kind }
  }
  return null
}

// The keys that group similar products: the same first word in the same category, then the
// whole category.
function similarKeys(product, kind) {
  const firstWord = product.name.split(' ')[0]
  return [
    `${product.category} ${kind} ${firstWord}`,
    `${product.category} ${kind}`,
  ]
}

function median(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

const categories = readJson('public/data/catalog.json').categories
const products = categories.flatMap((category) =>
  readJson(`public/data/${category.dataFile}`),
)

// The usual prices: key -> the prices per kg, liter or piece of the products without a pack count.
const pricesByKey = {}
for (const product of products) {
  const size = readSize(product.name)
  if (!size?.size) continue
  for (const key of similarKeys(product, size.kind)) {
    pricesByKey[key] ??= []
    pricesByKey[key].push(product.price / size.size)
  }
}

function usualPrice(product, kind) {
  const key = similarKeys(product, kind).find(
    (item) => pricesByKey[item]?.length >= MIN_SIMILAR,
  )
  return key && median(pricesByKey[key])
}

// How far apart two prices are: 2 and 4 are as far apart as 10 and 20.
function distance(a, b) {
  return Math.abs(Math.log(a / b))
}

const rows = products.flatMap((product) => {
  const pack = readPack(product.name)
  const usual = pack && usualPrice(product, pack.kind)
  if (!usual) return []
  const forOne = product.price / pack.size
  const forAll = forOne / pack.count
  const looksLikeOne =
    forAll < usual * TOO_LOW &&
    distance(forOne, usual) < distance(forAll, usual)
  return looksLikeOne ? [{ product, pack, usual, forAll }] : []
})

function amount(number) {
  return number < 0.1 ? number.toFixed(3) : number.toFixed(2)
}

function table(list) {
  const lines = categories.flatMap((category) =>
    list
      .filter((row) => row.product.category === category.id)
      .map(
        ({ product, pack, usual, forAll }) =>
          `| ${product.id} | ${markdownText(product.name)} | ${category.name.ar} | ${product.price} | ${pack.count} | ${amount(forAll)} / ${pack.kind} | ${amount(usual)} / ${pack.kind} |`,
      ),
  )
  return `| Id | Name | Category | Price (SAR) | Pieces in the pack | Price if it is for the whole pack | Usual price |
| --- | --- | --- | --- | --- | --- | --- |
${lines.join('\n')}`
}

const smallPacks = rows.filter((row) => row.pack.count <= SMALL_PACK)
const cartons = rows.filter((row) => row.pack.count > SMALL_PACK)

writeFileSync(
  new URL('../price-check.md', import.meta.url),
  `# Pack counts with a price that looks like one piece

${rows.length} products on the site have a pack count in their name, and a price that looks like the price of one piece. Nothing is hidden: this list is for the family to check. For each one, either the price is for one piece (then the pack count should leave the name, so customers don't expect the whole pack), or the price is wrong.

## 1. Check these first: ${smallPacks.length} packs of 2 to ${SMALL_PACK} pieces

A customer could really expect the whole pack for this price.

${table(smallPacks)}

## 2. Cartons: ${cartons.length} products with more than ${SMALL_PACK} pieces

The name most likely describes the shop's carton (for example 12 boxes of 24 biscuits) and the price is for one piece.

${table(cartons)}
`,
)

console.log(
  `price-check.md: ${smallPacks.length} small packs and ${cartons.length} cartons`,
)
