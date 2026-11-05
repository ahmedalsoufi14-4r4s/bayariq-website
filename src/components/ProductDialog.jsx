import { useEffect, useRef } from 'react'
import CartAnnouncer from '../cart/CartAnnouncer.jsx'
import { useCart } from '../cart/CartContext.js'
import categories from '../data/categories.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { formatPrice } from '../lib/price.js'
import { CloseIcon, PlusIcon } from './Icons.jsx'
import ProductImage from './ProductImage.jsx'
import { BUTTON_ACCENT, ICON_BUTTON } from './styles.js'

// Product details in the browser's built-in <dialog>. Opened with showModal(), it keeps
// keyboard focus inside, dims the page behind it and closes with the Escape key.
function ProductDialog({ product, onClose }) {
  const { t, localize } = useLanguage()
  const { add, getQuantity } = useCart()
  const dialogRef = useRef(null)

  useEffect(() => {
    if (product) dialogRef.current.showModal()
  }, [product])

  // close() fires the dialog's "close" event, which calls onClose.
  function close() {
    dialogRef.current.close()
  }

  // A click on the dark backdrop lands on the <dialog> itself, not on its content.
  function handleClick(event) {
    if (event.target === dialogRef.current) close()
  }

  let details = []
  if (product) {
    const category = categories.find((item) => item.id === product.category)
    details = [
      // A category id with a typo in products.json leaves the category row out instead of crashing.
      ...(category ? [[t.products.category, localize(category, 'name')]] : []),
      [t.products.unit, localize(product, 'unit')],
      [
        t.products.price,
        product.price === null
          ? t.products.priceOnRequest
          : formatPrice(product.price, t.currency),
      ],
      [
        t.products.availability,
        product.inStock ? t.products.inStock : t.products.outOfStock,
      ],
    ]
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleClick}
      aria-labelledby="product-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/50 dark:backdrop:bg-black/70"
    >
      {product && (
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 id="product-dialog-title" className="text-xl font-bold">
              {localize(product, 'name')}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label={t.products.close}
              className={`${ICON_BUTTON} -m-2.5 hover:bg-main-soft`}
            >
              <CloseIcon className="size-6 transition duration-300 ease-out motion-safe:group-hover:rotate-90" />
            </button>
          </div>

          <ProductImage
            product={product}
            className="mx-auto mt-4 max-w-48 rounded-xl"
          />

          <dl className="mt-4 space-y-2">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-4 border-b border-line pb-2"
              >
                <dt className="text-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={() => add(product)}
            disabled={!product.inStock}
            className={`${BUTTON_ACCENT} mt-5 w-full px-5 py-3`}
          >
            <PlusIcon className="size-5" />
            {t.cart.add}
          </button>
          {getQuantity(product.id) > 0 && (
            <p className="mt-2 text-center text-sm font-bold text-main-ink">
              {t.cart.inCart} {getQuantity(product.id)}
            </p>
          )}
          <CartAnnouncer />
        </div>
      )}
    </dialog>
  )
}

export default ProductDialog
