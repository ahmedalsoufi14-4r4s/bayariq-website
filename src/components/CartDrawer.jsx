import { useEffect, useRef } from 'react'
import CartAnnouncer from '../cart/CartAnnouncer.jsx'
import { useCart } from '../cart/CartContext.js'
import { useLanguage } from '../i18n/LanguageContext.js'
import { getEstimatedTotal } from '../lib/cart.js'
import { formatPrice } from '../lib/price.js'
import EmptyState from './EmptyState.jsx'
import { CartIcon, CloseIcon, MinusIcon, PlusIcon } from './Icons.jsx'
import OrderForm from './OrderForm.jsx'

const STEP_BUTTON =
  'flex size-9 items-center justify-center rounded-full border border-gray-300 hover:border-emerald-700 dark:border-gray-700 dark:hover:border-emerald-400'

// The cart opens as a full-height panel on the end side (left in Arabic, right in English).
// Like the product details, it is a <dialog> opened with showModal().
// The "drawer" class makes it slide in (see index.css).
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
      className="drawer my-0 ms-auto me-0 h-dvh max-h-none w-full max-w-md bg-white p-0 text-gray-900 backdrop:bg-black/50 dark:bg-gray-900 dark:text-gray-100 dark:backdrop:bg-black/70"
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
            className="-m-2 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="mt-4">
            {/* close() runs first, then the link scrolls the page to the products. */}
            <EmptyState Icon={CartIcon} text={t.cart.empty}>
              <a
                href="#products"
                onClick={close}
                className="rounded-full bg-emerald-700 px-5 py-2 text-white hover:bg-emerald-800"
              >
                {t.cart.browse}
              </a>
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-800">
            {lines.map(({ product, quantity }) => {
              const name = localize(product, 'name')
              return (
                <li
                  key={product.id}
                  className="flex items-start justify-between gap-3 py-3"
                >
                  <div>
                    <p>{name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {localize(product, 'unit')} ·{' '}
                      {product.price === null
                        ? t.products.priceOnRequest
                        : formatPrice(product.price * quantity, t.currency)}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(product)}
                      aria-label={`${t.cart.remove} ${name}`}
                      className="mt-1 text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
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
                    <span className="w-6 text-center">{quantity}</span>
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
          <p className="mt-4 flex justify-between font-bold">
            <span>{t.cart.total}</span>
            <span>{formatPrice(getEstimatedTotal(lines), t.currency)}</span>
          </p>
        )}
        {hasUnpricedItems && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t.cart.unpricedNote}
          </p>
        )}

        {(lines.length > 0 || extraItems !== '') && (
          <button
            type="button"
            onClick={clear}
            className="mt-3 text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
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
