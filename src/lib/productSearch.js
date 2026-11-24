// with { type: 'json' } lets Node.js import it too: the Playwright tests use this file.
import searchWords from '../data/searchWords.json' with { type: 'json' }

// Arabic diacritics (tashkeel, U+064B to U+065F), superscript alef (U+0670) and tatweel (U+0640).
const DIACRITICS = /[\u064B-\u065F\u0670\u0640]/g

// Makes text easy to compare: lower case, no diacritics, single spaces,
// and one form for Arabic letters that people often type differently.
export function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(DIACRITICS, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim()
}

// searchWords.json turns a word people type into the word the product names use:
// "milk" -> "حليب" (the names are only in Arabic for now), "أرز" -> "رز".
const NAME_WORDS = new Map(
  Object.entries(searchWords).map(([typed, inNames]) => [
    normalizeText(typed),
    normalizeText(inNames),
  ]),
)

// The words of a search, normalized and as the product names write them.
export function getSearchWords(query) {
  return normalizeText(query)
    .split(' ')
    .filter((word) => word !== '')
    .map((word) => NAME_WORDS.get(word) ?? word)
}

// Gets a list of products ready for the search: searchText is the normalized name. It is made
// once, when the products load, so each letter typed only has to compare texts.
export function prepareProducts(products) {
  return products.map((product) => ({
    ...product,
    searchText: normalizeText(product.name),
  }))
}

// Keeps the products whose name has every word of the search, in any order, and puts the ones
// where each word starts a word of the name first: "بيض" (eggs) before "ابيض" (white). The
// Arabic article does not count: "مراعي" starts "المراعي".
// An empty search keeps them all.
export function filterProducts(products, query) {
  const words = getSearchWords(query)
  const found = products.filter((product) =>
    words.every((word) => product.searchText.includes(word)),
  )
  const best = []
  const others = []
  for (const product of found) {
    const text = ` ${product.searchText}`
    const isBest = words.every(
      (word) => text.includes(` ${word}`) || text.includes(` ال${word}`),
    )
    if (isBest) best.push(product)
    else others.push(product)
  }
  return [...best, ...others]
}

// One list of every product loaded so far: the featured ones first, then the categories in the
// order they were loaded, so a category that arrives later never moves the products before it.
// byCategory is { dairy: [products], frozen: [products], ... }.
export function joinProducts(featured, byCategory) {
  const others = Object.values(byCategory)
    .flat()
    .filter((product) => !product.featured)
  return [...featured, ...others]
}
