// Arabic diacritics (tashkeel, U+064B to U+065F), superscript alef (U+0670) and tatweel (U+0640).
const DIACRITICS = /[ً-ٰٟـ]/g

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

// Keeps the products in the chosen category ('all' for every category)
// whose Arabic or English name contains the search text.
export function filterProducts(products, category, query) {
  const search = normalizeText(query)

  return products.filter((product) => {
    const inCategory = category === 'all' || product.category === category
    const matchesSearch =
      normalizeText(product.name_ar).includes(search) ||
      normalizeText(product.name_en).includes(search)
    return inCategory && matchesSearch
  })
}
