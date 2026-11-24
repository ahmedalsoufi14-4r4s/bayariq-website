import { describe, expect, it } from 'vitest'
import { buildStoreJsonLd } from './structuredData.js'

const placeholderBranch = {
  id: 'north',
  active: true,
  name_ar: 'متجر تجريبي',
  name_en: 'Test Store',
  district_ar: 'الشمال',
  district_en: 'North',
  phone: 'NEEDS-AHMED',
  openingHours: 'NEEDS-AHMED',
  address_ar: 'NEEDS-AHMED',
  mapsUrl: 'NEEDS-AHMED',
  latitude: 21.5,
  longitude: 39.2,
}

const store = {
  name_ar: 'أسواق تجريبية',
  name_en: 'Test Markets',
  website: 'https://example.com/shop/',
  branches: [
    placeholderBranch,
    {
      ...placeholderBranch,
      id: 'south',
      name_ar: 'متجر آخر',
      name_en: 'Other Store',
      district_ar: 'الجنوب',
      district_en: 'South',
      phone: '+966120000000',
      openingHours: ['Sa-Th 07:00-23:00', 'Fr 16:00-23:00'],
      address_ar: 'شارع تجريبي',
      mapsUrl: 'https://maps.app.goo.gl/example',
    },
    { ...placeholderBranch, id: 'closed', active: false },
  ],
}

describe('buildStoreJsonLd', () => {
  const data = buildStoreJsonLd(store)
  const [organization, north, south] = data['@graph']

  it('describes the store as an Organization', () => {
    expect(data['@context']).toBe('https://schema.org')
    expect(organization).toEqual({
      '@type': 'Organization',
      '@id': 'https://example.com/shop/#organization',
      name: 'أسواق تجريبية',
      alternateName: 'Test Markets',
      url: 'https://example.com/shop/',
      image: 'https://example.com/shop/og-image.png',
    })
  })

  it('describes each branch as a GroceryStore that belongs to the Organization', () => {
    expect(data['@graph']).toHaveLength(3)
    expect(north['@type']).toBe('GroceryStore')
    expect(north['@id']).toBe('https://example.com/shop/#north')
    expect(north.name).toBe('متجر تجريبي - فرع الشمال')
    expect(north.alternateName).toBe('Test Store - North branch')
    expect(north.parentOrganization).toEqual({ '@id': organization['@id'] })
    expect(south.name).toBe('متجر آخر - فرع الجنوب')
  })

  it('leaves out a branch that is not active', () => {
    expect(JSON.stringify(data)).not.toContain('closed')
  })

  it('gives each branch its coordinates', () => {
    expect(north.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 21.5,
      longitude: 39.2,
    })
  })

  it('leaves out branch details that are still placeholders', () => {
    expect(north).not.toHaveProperty('telephone')
    expect(north).not.toHaveProperty('openingHours')
    expect(north).not.toHaveProperty('hasMap')
    expect(north.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'جدة',
      addressCountry: 'SA',
    })
    expect(JSON.stringify(north)).not.toContain('NEEDS-AHMED')
  })

  it('adds the phone, opening hours, address and map link once they are filled in', () => {
    expect(south.telephone).toBe('+966120000000')
    expect(south.openingHours).toEqual(['Sa-Th 07:00-23:00', 'Fr 16:00-23:00'])
    expect(south.address.streetAddress).toBe('شارع تجريبي')
    expect(south.hasMap).toBe('https://maps.app.goo.gl/example')
  })
})
