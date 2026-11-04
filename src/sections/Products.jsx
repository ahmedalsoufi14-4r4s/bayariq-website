import { useState } from 'react'
import CategoryFilter from '../components/CategoryFilter.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { SearchIcon } from '../components/Icons.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductDialog from '../components/ProductDialog.jsx'
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
      <h2 id="products-title" className="text-2xl font-bold md:text-3xl">
        {t.products.title}
      </h2>

      <div className="relative mt-6">
        <label htmlFor="product-search" className="sr-only">
          {t.products.searchLabel}
        </label>
        <SearchIcon className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.products.searchPlaceholder}
          className="w-full rounded-full border border-gray-300 bg-white py-3 ps-11 pe-4 focus:border-emerald-700 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-emerald-400"
        />
      </div>

      <CategoryFilter selected={category} onSelect={setCategory} />

      {/* aria-live makes screen readers read the new count after each change. */}
      <p
        aria-live="polite"
        className="mt-4 text-sm text-gray-600 dark:text-gray-400"
      >
        {t.products.results} {visibleProducts.length}
      </p>

      {visibleProducts.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <li key={product.id}>
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
              className="rounded-full border border-emerald-700 px-5 py-2 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950"
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
