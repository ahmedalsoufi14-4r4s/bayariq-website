import { useEffect, useRef } from 'react'
import CartAnnouncer from '../cart/CartAnnouncer.jsx'
import { useCart } from '../cart/CartContext.js'
import { useLanguage } from '../i18n/LanguageContext.js'
import { getEstimatedTotal } from '../lib/cart.js'
import { formatPrice } from '../lib/price.js'
import { CloseIcon, MinusIcon, PlusIcon } from './Icons.jsx'
import OrderForm from './OrderForm.jsx'

const STEP_BUTTON =
  'flex size-9 items-center justify-center rounded-full border border-gray-300 hover:border-emerald-700'

// The cart opens as a full-height panel on the end side (left in Arabic, right in English).
// Like the product details, it is a <dialog> opened with showModal().
function CartDrawer() {
  const { t, localize } = useLanguage()
  const {
    lines,
    extraItems,
    isOpen,
    closeCart,
    changeQuantity,
    remove,
    clear,
  } = useCart()
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  // close() fires the dialog's "close" event, which calls closeCart.
  function close() {
    dialogRef.current.close()
  }

  // A click on the dark backdrop lands on the <dialog> itself, not on its content.
  function handleClick(event) {
    if (event.target === dialogRef.current) close()
  }

  const hasPricedItems = lines.some((line) => line.product.price !== null)
  const hasUnpricedItems = lines.some((line) => line.product.price === null)

  return (
    <dialog
      ref={dialogRef}
      onClose={closeCart}
      onClick={handleClick}
      aria-labelledby="cart-title"
      className="my-0 ms-auto me-0 h-dvh max-h-none w-full max-w-md bg-white p-0 text-gray-900 backdrop:bg-black/50"
    >
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 id="cart-title" className="text-xl font-bold">
            {t.cart.title}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label={t.cart.close}
            className="-m-2 rounded-full p-2 hover:bg-gray-100"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-gray-50 p-4 text-gray-600">
            {t.cart.empty}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-200">
            {lines.map(({ product, quantity }) => {
              const name = localize(product, 'name')
              return (
                <li
                  key={product.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-gray-600">
                      {localize(product, 'unit')} ·{' '}
                      {product.price === null
                        ? t.products.priceOnRequest
                        : formatPrice(product.price * quantity, t.currency)}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(product)}
                      aria-label={`${t.cart.remove} ${name}`}
                      className="mt-1 text-sm text-gray-600 underline hover:text-gray-900"
                    >
                      {t.cart.remove}
                    </button>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeQuantity(product, quantity - 1)}
                      aria-label={`${t.cart.decrease} ${name}`}
                      className={STEP_BUTTON}
                    >
                      <MinusIcon className="size-4" />
                    </button>
                    <span className="w-6 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(product, quantity + 1)}
                      aria-label={`${t.cart.increase} ${name}`}
                      className={STEP_BUTTON}
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {hasPricedItems && (
          <p className="mt-4 flex justify-between font-semibold">
            <span>{t.cart.total}</span>
            <span>{formatPrice(getEstimatedTotal(lines), t.currency)}</span>
          </p>
        )}
        {hasUnpricedItems && (
          <p className="mt-2 text-sm text-gray-600">{t.cart.unpricedNote}</p>
        )}

        {(lines.length > 0 || extraItems !== '') && (
          <button
            type="button"
            onClick={clear}
            className="mt-3 text-sm text-gray-600 underline hover:text-gray-900"
          >
            {t.cart.clear}
          </button>
        )}

        <OrderForm />
        <CartAnnouncer />
      </div>
    </dialog>
  )
}

export default CartDrawer
