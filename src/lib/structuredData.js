import { isPlaceholder } from './placeholder.js'

// Builds the schema.org description that search engines read (JSON-LD):
// the store as an Organization, and each branch as a GroceryStore that belongs to it.
// vite.config.js puts it into index.html at build time, so it always matches store.json.
// Details that are still NEEDS-AHMED are left out instead of being published.
export function buildStoreJsonLd(store) {
  const organizationId = `${store.website}#organization`
  const image = `${store.website}og-image.png`

  const organization = {
    '@type': 'Organization',
    '@id': organizationId,
    name: store.name_ar,
    alternateName: store.name_en,
    url: store.website,
    image,
  }

  const branches = store.branches.map((branch) => {
    const data = {
      '@type': 'GroceryStore',
      '@id': `${store.website}#${branch.id}`,
      name: `${branch.name_ar} - ${branch.district_ar}`,
      alternateName: `${branch.name_en} - ${branch.district_en}`,
      parentOrganization: { '@id': organizationId },
      url: store.website,
      image,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'جدة',
        addressCountry: 'SA',
      },
    }

    if (!isPlaceholder(branch.address_ar)) {
      data.address.streetAddress = branch.address_ar
    }
    if (!isPlaceholder(branch.phone)) data.telephone = branch.phone
    // Short form search engines understand, for example ["Sa-Th 07:00-23:00"].
    if (!isPlaceholder(branch.openingHours)) {
      data.openingHours = branch.openingHours
    }
    if (!isPlaceholder(branch.mapsUrl)) data.hasMap = branch.mapsUrl

    return data
  })

  // @graph holds several linked descriptions in one block.
  return {
    '@context': 'https://schema.org',
    '@graph': [organization, ...branches],
  }
}
