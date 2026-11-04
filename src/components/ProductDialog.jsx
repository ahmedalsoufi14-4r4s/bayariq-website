import { useEffect, useRef } from 'react'
import categories from '../data/categories.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { formatPrice } from '../lib/price.js'
import { CloseIcon } from './Icons.jsx'
import ProductImage from './ProductImage.jsx'

// Product details in the browser's built-in <dialog>. Opened with showModal(), it keeps
// keyboard focus inside, dims the page behind it and closes with the Escape key.
function ProductDialog({ product, onClose }) {
  const { t, localize } = useLanguage()
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
      [t.products.category, localize(category, 'name')],
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
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-0 text-gray-900 backdrop:bg-black/50"
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
              className="-m-2 rounded-full p-2 hover:bg-gray-100"
            >
              <CloseIcon className="size-6" />
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
                className="flex justify-between gap-4 border-b border-gray-200 pb-2"
              >
                <dt className="text-gray-600">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </dialog>
  )
}

export default ProductDialog
