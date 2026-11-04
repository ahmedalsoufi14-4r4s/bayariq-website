import { isPlaceholder } from './placeholder.js'

// Builds the schema.org GroceryStore description that search engines read (JSON-LD).
// vite.config.js puts it into index.html at build time, so it always matches store.json.
// Details that are still NEEDS-AHMED are left out instead of being published.
export function buildStoreJsonLd(store) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    name: store.name_ar,
    alternateName: store.name_en,
    url: store.website,
    image: `${store.website}og-image.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address_ar,
      addressLocality: 'جدة',
      addressCountry: 'SA',
    },
  }

  if (!isPlaceholder(store.phone)) data.telephone = store.phone
  // Short form search engines understand, for example ["Sa-Th 07:00-23:00"].
  if (!isPlaceholder(store.openingHours)) data.openingHours = store.openingHours
  if (!isPlaceholder(store.mapsUrl)) data.hasMap = store.mapsUrl

  return data
}
