import { useState } from 'react'
import CategoryFilter from '../components/CategoryFilter.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SearchIcon } from '../components/Icons.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductDialog from '../components/ProductDialog.jsx'
import { reveal } from '../components/reveal.js'
import SectionHeading from '../components/SectionHeading.jsx'
import { BUTTON_OUTLINE } from '../components/styles.js'
import products from '../data/products.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { filterProducts } from '../lib/productSearch.js'

// NEEDS-AHMED: products.json and categories.json hold sample items until the real list arrives.
function Products() {
  const { t } = useLanguage()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Not stored in state: worked out again on every render from the filter and the search text.
  const visibleProducts = filterProducts(products, category, query)

  function showAll() {
    setCategory('all')
    setQuery('')
  }

  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="mx-auto max-w-6xl px-4 py-16"
    >
      <SectionHeading id="products-title">{t.products.title}</SectionHeading>

      <div className="relative mt-6">
        <label htmlFor="product-search" className="sr-only">
          {t.products.searchLabel}
        </label>
        <SearchIcon className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.products.searchPlaceholder}
          className="w-full rounded-full border border-line bg-surface py-3 ps-11 pe-4 shadow-sm transition focus:border-main-ink"
        />
      </div>

      <CategoryFilter selected={category} onSelect={setCategory} />

      {/* aria-live makes screen readers read the new count after each change. */}
      <p aria-live="polite" className="mt-4 text-sm text-muted">
        {t.products.results} {visibleProducts.length}
      </p>

      {visibleProducts.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            // Cards fade in as they scroll into view. Cards that arrive together, like a row,
            // start one after another (see reveal.js), and so do the cards a filter brings back.
            <li key={product.id} ref={reveal} className="reveal">
              <ProductCard product={product} onOpen={setSelectedProduct} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <EmptyState Icon={SearchIcon} text={t.products.noResults}>
            <button
              type="button"
              onClick={showAll}
              className={`${BUTTON_OUTLINE} px-5 py-2`}
            >
              {t.products.showAll}
            </button>
          </EmptyState>
        </div>
      )}

      <ProductDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  )
}

export default Products
