import { describe, expect, it } from 'vitest'
import searchWords from '../data/searchWords.json'
import {
  filterProducts,
  joinProducts,
  normalizeText,
  prepareProducts,
} from './productSearch.js'

describe('normalizeText', () => {
  it('removes Arabic diacritics and tatweel', () => {
    expect(normalizeText('حَلِيبٌ')).toBe('حليب')
    expect(normalizeText('عـسـل')).toBe('عسل')
  })

  it('turns أ إ آ into ا', () => {
    expect(normalizeText('أرز إبريق آيس')).toBe('ارز ابريق ايس')
  })

  it('turns ة into ه and ى into ي', () => {
    expect(normalizeText('قهوة حلوى')).toBe('قهوه حلوي')
  })

  it('lower-cases, trims and keeps single spaces', () => {
    expect(normalizeText('  Fresh   MILK ')).toBe('fresh milk')
  })
})

describe('normalizeText: digits', () => {
  it('keeps Arabic digits', () => {
    expect(normalizeText('كيلو ١٤')).toBe('كيلو ١٤')
  })
})

describe('filterProducts', () => {
  const products = prepareProducts([
    { id: 'sugar', name: 'سكر ابيض ناعم' },
    { id: 'eggs', name: 'بيض غذاء البركة' },
    { id: 'rice', name: 'أرز بسمتي' },
    { id: 'coffee', name: 'قهوة عربية المرسال' },
    { id: 'milk', name: 'حليب المراعي طازج' },
  ])
  const ids = (list) => list.map((product) => product.id)

  it('keeps every product, in order, for an empty search', () => {
    expect(ids(filterProducts(products, '  '))).toEqual([
      'sugar',
      'eggs',
      'rice',
      'coffee',
      'milk',
    ])
  })

  it('finds names however the Arabic letters are typed', () => {
    expect(ids(filterProducts(products, 'ارز'))).toEqual(['rice'])
    expect(ids(filterProducts(products, 'قهوه'))).toEqual(['coffee'])
    expect(ids(filterProducts(products, 'حَليب'))).toEqual(['milk'])
  })

  it('needs every word, in any order', () => {
    expect(ids(filterProducts(products, 'طازج حليب'))).toEqual(['milk'])
    expect(ids(filterProducts(products, 'حليب عربية'))).toEqual([])
  })

  it('puts names with a word that starts with the search first', () => {
    // "بيض" (eggs) is also inside "ابيض" (white).
    expect(ids(filterProducts(products, 'بيض'))).toEqual(['eggs', 'sugar'])
  })

  it('does not mind the Arabic article', () => {
    const list = prepareProducts([
      { id: 'article', name: 'حليب المراعي' },
      { id: 'bare', name: 'حليب مراعي' },
    ])
    expect(ids(filterProducts(list, 'حليب مراعي'))).toEqual(['article', 'bare'])
  })

  it('understands common English words, in any letter case', () => {
    expect(ids(filterProducts(products, 'MILK'))).toEqual(['milk'])
    expect(ids(filterProducts(products, 'Almarai milk'))).toEqual(['milk'])
  })
})

describe('searchWords.json', () => {
  it('gives every typed word a word of the names', () => {
    for (const [typed, inNames] of Object.entries(searchWords)) {
      expect(typed.trim()).not.toBe('')
      expect(inNames).toMatch(/^[ء-ي ]+$/)
    }
  })
})

describe('joinProducts', () => {
  it('puts the featured products first, then the categories in the order they loaded, each product once', () => {
    const milk = { id: 'milk', featured: true }
    const laban = { id: 'laban' }
    const soap = { id: 'soap' }
    expect(
      joinProducts([milk], { cleaning: [soap], dairy: [milk, laban] }),
    ).toEqual([milk, soap, laban])
  })
})
