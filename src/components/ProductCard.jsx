import { useCart } from '../cart/CartContext.js'
import { useLanguage } from '../i18n/LanguageContext.js'
import { formatPrice } from '../lib/price.js'
import { PlusIcon } from './Icons.jsx'
import ProductImage from './ProductImage.jsx'

function ProductCard({ product, onOpen }) {
  const { t, localize } = useLanguage()
  const { add, getQuantity } = useCart()
  const name = localize(product, 'name')
  const quantity = getQuantity(product.id)

  return (
    // isolate keeps the z-10 below inside this card, so the button can never cover the sticky header.
    <article className="relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-emerald-700 hover:shadow-md motion-safe:hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-400">
      <ProductImage product={product} />

      <div className="absolute start-2 top-2 flex flex-wrap gap-1 text-xs">
        {product.featured && (
          <span className="rounded-full bg-emerald-700 px-2 py-1 text-white">
            {t.products.featured}
          </span>
        )}
        {!product.inStock && (
          <span className="rounded-full bg-gray-700 px-2 py-1 text-white">
            {t.products.outOfStock}
          </span>
        )}
      </div>

      {quantity > 0 && (
        <span className="absolute end-2 top-2 rounded-full bg-white px-2 py-1 text-xs text-emerald-700 shadow dark:bg-gray-900 dark:text-emerald-400">
          {t.cart.inCart} {quantity}
        </span>
      )}

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-bold">
          {/* after:absolute after:inset-0 stretches this button over the whole card,
              so a tap anywhere on the card opens the details. */}
          <button
            type="button"
            onClick={() => onOpen(product)}
            className="text-start after:absolute after:inset-0"
          >
            {name}
          </button>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {localize(product, 'unit')}
        </p>
        <p className="mt-auto pt-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
          {product.price === null
            ? t.products.priceOnRequest
            : formatPrice(product.price, t.currency)}
        </p>
        {/* relative z-10 lifts this button above the card-wide details button. */}
        <button
          type="button"
          onClick={() => add(product)}
          disabled={!product.inStock}
          aria-label={`${t.cart.add}: ${name}`}
          className="relative z-10 mt-2 flex items-center justify-center gap-1 rounded-full bg-emerald-700 px-3 py-2 text-sm text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        >
          <PlusIcon className="size-4" />
          {t.cart.add}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
