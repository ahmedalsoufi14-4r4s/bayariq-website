import { useRef, useState } from 'react'
import CategoryFilter from '../components/CategoryFilter.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { AlertIcon, CloseIcon, SearchIcon } from '../components/Icons.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductDialog from '../components/ProductDialog.jsx'
import ProductSkeletons from '../components/ProductSkeletons.jsx'
import { reveal } from '../components/reveal.js'
import SectionHeading from '../components/SectionHeading.jsx'
import { BUTTON_OUTLINE, ICON_BUTTON } from '../components/styles.js'
import { useLanguage } from '../i18n/LanguageContext.js'
import { useProductList } from '../products/useProductList.js'

// How many pulsing boxes show while products load.
const SKELETON_COUNT = 8

// Which products show, and loading them, is in useProductList.js. This draws them.
function Products() {
  const { t } = useLanguage()
  const {
    category,
    query,
    visible,
    total,
    hasMore,
    isLoading,
    hasFailed,
    chooseCategory,
    search,
    showAll,
    showMore,
    tryAgain,
  } = useProductList()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const searchRef = useRef(null)
  const isSearching = query.trim() !== ''

  // The clear button disappears with the text, so focus goes back to the search box.
  function clearSearch() {
    search('')
    searchRef.current.focus()
  }

  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="mx-auto max-w-6xl px-4 py-16"
    >
      <SectionHeading id="products-title">{t.products.title}</SectionHeading>

      {/* The search box and the category buttons, shown together in the first-visit tour. */}
      <div data-tour="browse">
        <div className="relative mt-6">
          <label htmlFor="product-search" className="sr-only">
            {t.products.searchLabel}
          </label>
          {/* On focus the border turns green and a soft ring fades in around it.
            peer marks the input, so the icon after it can react to its focus (peer-focus:). */}
          <input
            ref={searchRef}
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => search(event.target.value)}
            placeholder={t.products.searchPlaceholder}
            className="peer w-full rounded-full border border-line bg-surface py-3 ps-11 pe-14 shadow-sm transition duration-200 ease-out hover:border-muted focus:border-main-ink focus:ring-4 focus:ring-main-ink/15"
          />
          <SearchIcon className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted transition duration-200 ease-out peer-focus:text-main-ink motion-safe:peer-focus:scale-110" />
          {/* inset-y-0 and my-auto center the button without translate, which animate-appear uses. */}
          {query !== '' && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label={t.products.clearSearch}
              className={`${ICON_BUTTON} absolute inset-y-0 end-1 my-auto text-muted hover:bg-main-soft hover:text-ink motion-safe:animate-appear`}
            >
              <CloseIcon className="size-5 transition duration-300 ease-out motion-safe:group-hover:rotate-90" />
            </button>
          )}
        </div>

        <CategoryFilter selected={category} onSelect={chooseCategory} />
      </div>

      {/* aria-live makes screen readers read the new count after each change. aria-busy makes
          them wait while a search still loads categories and the count keeps growing.
          A new key makes React draw a new number, so it rolls in on every change. */}
      {/* text-ink, not text-muted: this line sits right on the page, over the moving
          circles, and the darker text stays AA wherever they are (e2e/design.spec.js). */}
      <p
        aria-live="polite"
        aria-busy={isLoading}
        className="mt-4 text-sm text-ink"
      >
        {isLoading && !isSearching ? (
          t.products.loading
        ) : (
          <>
            {t.products.results}{' '}
            <span key={total} className="inline-block motion-safe:animate-roll">
              {total}
            </span>
            {isLoading && ` · ${t.products.searching}`}
          </>
        )}
      </p>

      {visible.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => (
            // Cards fade in as they scroll into view. Cards that arrive together, like a row,
            // start one after another (see reveal.js), and so do the cards a filter brings back.
            <li key={product.id} ref={reveal} className="reveal">
              <ProductCard product={product} onOpen={setSelectedProduct} />
            </li>
          ))}
        </ul>
      )}

      {visible.length === 0 && isLoading && (
        <ProductSkeletons count={SKELETON_COUNT} />
      )}

      {visible.length === 0 && !isLoading && !hasFailed && (
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

      {/* When a file does not load (for example offline), what has loaded stays on the page. */}
      {hasFailed && (
        <div role="alert" className="mt-4">
          <EmptyState Icon={AlertIcon} text={t.products.loadFailed}>
            <button
              type="button"
              onClick={tryAgain}
              className={`${BUTTON_OUTLINE} px-5 py-2`}
            >
              {t.products.tryAgain}
            </button>
          </EmptyState>
        </div>
      )}

      {hasMore && !hasFailed && visible.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={showMore}
            className={`${BUTTON_OUTLINE} px-8 py-3`}
          >
            {t.products.showMore}
          </button>
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
