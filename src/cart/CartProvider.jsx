import { useEffect, useState } from 'react'
import products from '../data/products.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import {
  addItem,
  getCartLines,
  getItemCount,
  removeItem,
  setQuantity,
} from '../lib/cart.js'
import { CartContext } from './CartContext.js'

// GitHub Pages sites of the same user share one localStorage, so the key has a unique prefix.
const STORAGE_KEY = 'bayariq-cart'
const EMPTY_CART = { items: {}, extraItems: '' }

// The saved cart looks like { items: { 'fresh-milk': 2 }, extraItems: 'toothpaste' }.
// localStorage throws when the browser blocks storage, and JSON.parse throws on broken data.
function getSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return { ...EMPTY_CART, ...saved }
  } catch {
    return EMPTY_CART
  }
}

function CartProvider({ children }) {
  const { t, localize } = useLanguage()
  const [cart, setCart] = useState(getSavedCart)
  const [isOpen, setIsOpen] = useState(false)
  // Read out by screen readers after each change (see CartAnnouncer.jsx).
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Storage is blocked: the cart still works, it is just not remembered.
    }
  }, [cart])

  const lines = getCartLines(cart.items, products)

  function getQuantity(productId) {
    return cart.items[productId] ?? 0
  }

  function add(product) {
    setCart((current) => ({
      ...current,
      items: addItem(current.items, product.id),
    }))
    const name = localize(product, 'name')
    setAnnouncement(`${t.cart.added} ${name} (${getQuantity(product.id) + 1})`)
  }

  function changeQuantity(product, quantity) {
    setCart((current) => ({
      ...current,
      items: setQuantity(current.items, product.id, quantity),
    }))
    const name = localize(product, 'name')
    setAnnouncement(
      quantity > 0
        ? `${t.cart.quantityChanged} ${name} (${quantity})`
        : `${t.cart.removed} ${name}`,
    )
  }

  function remove(product) {
    setCart((current) => ({
      ...current,
      items: removeItem(current.items, product.id),
    }))
    setAnnouncement(`${t.cart.removed} ${localize(product, 'name')}`)
  }

  function setExtraItems(text) {
    setCart((current) => ({ ...current, extraItems: text }))
  }

  function clear() {
    setCart(EMPTY_CART)
    setAnnouncement(t.cart.cleared)
  }

  const value = {
    lines,
    count: getItemCount(lines),
    extraItems: cart.extraItems,
    getQuantity,
    add,
    changeQuantity,
    remove,
    setExtraItems,
    clear,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    announcement,
  }

  return <CartContext value={value}>{children}</CartContext>
}

export default CartProvider
