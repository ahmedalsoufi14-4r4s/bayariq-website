import { useState } from 'react'
import CategoryFilter from '../components/CategoryFilter.jsx'
import { SearchIcon } from '../components/Icons.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductDialog from '../components/ProductDialog.jsx'
import products from '../data/products.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { filterProducts } from '../lib/productSearch.js'

function Products() {
  const { t } = useLanguage()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Not stored in state: worked out again on every render from the filter and the search text.
  const visibleProducts = filterProducts(products, category, query)

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
        <SearchIcon className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-gray-500" />
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.products.searchPlaceholder}
          className="w-full rounded-full border border-gray-300 bg-white py-3 ps-11 pe-4 focus:border-emerald-700"
        />
      </div>

      <CategoryFilter selected={category} onSelect={setCategory} />

      {/* aria-live makes screen readers read the new count after each change. */}
      <p aria-live="polite" className="mt-4 text-sm text-gray-600">
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
        <p className="mt-4 rounded-2xl bg-gray-50 p-6 text-center text-gray-600">
          {t.products.noResults}
        </p>
      )}

      <ProductDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  )
}

export default Products
