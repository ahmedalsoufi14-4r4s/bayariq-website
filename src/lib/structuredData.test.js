import { describe, expect, it } from 'vitest'
import { buildStoreJsonLd } from './structuredData.js'

const store = {
  name_ar: 'متجر تجريبي',
  name_en: 'Test Store',
  website: 'https://example.com/shop/',
  phone: 'NEEDS-AHMED',
  openingHours: 'NEEDS-AHMED',
  address_ar: 'حي تجريبي، جدة',
  mapsUrl: 'NEEDS-AHMED',
}

describe('buildStoreJsonLd', () => {
  it('describes the store as a schema.org GroceryStore', () => {
    const data = buildStoreJsonLd(store)

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('GroceryStore')
    expect(data.name).toBe('متجر تجريبي')
    expect(data.alternateName).toBe('Test Store')
    expect(data.url).toBe('https://example.com/shop/')
    expect(data.image).toBe('https://example.com/shop/og-image.png')
    expect(data.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: 'حي تجريبي، جدة',
      addressLocality: 'جدة',
      addressCountry: 'SA',
    })
  })

  it('leaves out details that are still placeholders', () => {
    const data = buildStoreJsonLd(store)

    expect(data).not.toHaveProperty('telephone')
    expect(data).not.toHaveProperty('openingHours')
    expect(data).not.toHaveProperty('hasMap')
    expect(JSON.stringify(data)).not.toContain('NEEDS-AHMED')
  })

  it('adds the phone, opening hours and map link once they are filled in', () => {
    const data = buildStoreJsonLd({
      ...store,
      phone: '+966120000000',
      openingHours: ['Sa-Th 07:00-23:00', 'Fr 16:00-23:00'],
      mapsUrl: 'https://maps.app.goo.gl/example',
    })

    expect(data.telephone).toBe('+966120000000')
    expect(data.openingHours).toEqual(['Sa-Th 07:00-23:00', 'Fr 16:00-23:00'])
    expect(data.hasMap).toBe('https://maps.app.goo.gl/example')
  })
})
