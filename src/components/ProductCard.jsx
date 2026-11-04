import { useLanguage } from '../i18n/LanguageContext.js'
import { formatPrice } from '../lib/price.js'
import ProductImage from './ProductImage.jsx'

function ProductCard({ product, onOpen }) {
  const { t, localize } = useLanguage()

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white hover:border-emerald-700">
      <ProductImage product={product} />

      <div className="absolute start-2 top-2 flex flex-wrap gap-1 text-xs font-medium">
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

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-semibold">
          {/* after:absolute after:inset-0 stretches this button over the whole card,
              so a tap anywhere on the card opens the details. */}
          <button
            type="button"
            onClick={() => onOpen(product)}
            className="text-start after:absolute after:inset-0"
          >
            {localize(product, 'name')}
          </button>
        </h3>
        <p className="text-sm text-gray-600">{localize(product, 'unit')}</p>
        <p className="mt-auto pt-2 text-sm font-semibold text-emerald-700">
          {product.price === null
            ? t.products.priceOnRequest
            : formatPrice(product.price, t.currency)}
        </p>
      </div>
    </article>
  )
}

export default ProductCard
