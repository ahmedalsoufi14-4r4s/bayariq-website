import { describe, expect, it } from 'vitest'
import { filterProducts, normalizeText } from './productSearch.js'

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

describe('filterProducts', () => {
  const products = [
    {
      id: 'rice',
      name_ar: 'أرز بسمتي',
      name_en: 'Basmati rice',
      category: 'pantry',
    },
    {
      id: 'coffee',
      name_ar: 'قهوة عربية',
      name_en: 'Arabic coffee',
      category: 'pantry',
    },
    {
      id: 'milk',
      name_ar: 'حليب طازج',
      name_en: 'Fresh milk',
      category: 'dairy',
    },
  ]
  const ids = (list) => list.map((product) => product.id)

  it('returns every product for "all" and an empty search', () => {
    expect(ids(filterProducts(products, 'all', ''))).toEqual([
      'rice',
      'coffee',
      'milk',
    ])
  })

  it('keeps only the chosen category', () => {
    expect(ids(filterProducts(products, 'pantry', ''))).toEqual([
      'rice',
      'coffee',
    ])
  })

  it('finds Arabic names however the letters are typed', () => {
    expect(ids(filterProducts(products, 'all', 'ارز'))).toEqual(['rice'])
    expect(ids(filterProducts(products, 'all', 'قهوه'))).toEqual(['coffee'])
    expect(ids(filterProducts(products, 'all', 'حَليب'))).toEqual(['milk'])
  })

  it('finds English names in any letter case', () => {
    expect(ids(filterProducts(products, 'all', 'MILK'))).toEqual(['milk'])
  })

  it('applies the category and the search together', () => {
    expect(ids(filterProducts(products, 'dairy', 'ارز'))).toEqual([])
  })
})
