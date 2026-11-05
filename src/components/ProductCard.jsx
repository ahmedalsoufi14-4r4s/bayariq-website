import { useCart } from '../cart/CartContext.js'
import { useLanguage } from '../i18n/LanguageContext.js'
import { formatPrice } from '../lib/price.js'
import { PlusIcon } from './Icons.jsx'
import ProductImage from './ProductImage.jsx'
import { BUTTON_ACCENT, CARD } from './styles.js'

function ProductCard({ product, onOpen }) {
  const { t, localize } = useLanguage()
  const { add, getQuantity } = useCart()
  const name = localize(product, 'name')
  const quantity = getQuantity(product.id)

  return (
    // isolate keeps the z-10 below inside this card, so the button can never cover the sticky header.
    // group lets the picture react when the pointer is anywhere on the card (group-hover: in ProductImage.jsx).
    // The card lifts and glows like every card (CARD). The picture is clipped by its own box,
    // so its zoom stays inside the card's rounded top corners.
    <article className={`group isolate flex h-full flex-col ${CARD}`}>
      <div className="overflow-hidden rounded-t-2xl">
        <ProductImage product={product} />
      </div>

      <div className="absolute start-2 top-2 flex flex-wrap gap-1 text-xs">
        {product.featured && (
          <span className="rounded-full bg-accent px-2 py-1 font-bold text-on-accent">
            {t.products.featured}
          </span>
        )}
        {!product.inStock && (
          <span className="rounded-full bg-ink px-2 py-1 text-surface">
            {t.products.outOfStock}
          </span>
        )}
      </div>

      {/* A small confirmation: it slides in when the product is added, and again on each change. */}
      {quantity > 0 && (
        <span
          key={quantity}
          className="absolute end-2 top-2 rounded-full bg-surface px-2 py-1 text-xs font-bold text-main-ink shadow motion-safe:animate-appear"
        >
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
        <p className="text-sm text-muted">{localize(product, 'unit')}</p>
        <p className="mt-auto pt-2 font-bold text-main-ink">
          {product.price === null
            ? t.products.priceOnRequest
            : formatPrice(product.price, t.currency)}
        </p>
        {/* relative z-10 lifts this button above the card-wide details button. */}
        <button
          type="button"
          data-tour="add"
          onClick={() => add(product)}
          disabled={!product.inStock}
          aria-label={`${t.cart.add}: ${name}`}
          className={`${BUTTON_ACCENT} relative z-10 mt-2 px-3 py-2 text-sm`}
        >
          <PlusIcon className="size-4" />
          {t.cart.add}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
