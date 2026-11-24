import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.js'
import {
  addItem,
  getCartLines,
  getItemCount,
  getQuantity,
  removeItem,
  setQuantity,
} from '../lib/cart.js'
import { useProducts } from '../products/ProductsContext.js'
import { CartContext } from './CartContext.js'

// GitHub Pages sites of the same user share one localStorage, so the key has a unique prefix.
const STORAGE_KEY = 'bayariq-cart'
const EMPTY_CART = { items: [], extraItems: '' }

// The saved cart looks like { items: [{ product, quantity }], extraItems: 'toothpaste' }.
// localStorage throws when the browser blocks storage, and JSON.parse throws on broken data.
// Carts saved by the first version of the site kept their items in another shape: those start empty.
function getSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    const items = Array.isArray(saved?.items)
      ? saved.items.filter((item) => item?.product?.id)
      : []
    return { ...EMPTY_CART, ...saved, items }
  } catch {
    return EMPTY_CART
  }
}

function CartProvider({ children }) {
  const { t } = useLanguage()
  const { byCategory, loadCategory } = useProducts()
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

  const lines = getCartLines(cart.items, byCategory)

  // Opening the cart loads the categories of its products, so a cart saved days ago shows
  // today's prices (see getCartLines). When loading fails, the saved prices stay.
  function openCart() {
    setIsOpen(true)
    const categoryIds = new Set(cart.items.map((item) => item.product.category))
    for (const id of categoryIds) loadCategory(id).catch(() => {})
  }

  function add(product) {
    setCart((current) => ({
      ...current,
      items: addItem(current.items, product),
    }))
    const quantity = getQuantity(cart.items, product.id) + 1
    setAnnouncement(`${t.cart.added} ${product.name} (${quantity})`)
  }

  function changeQuantity(product, quantity) {
    setCart((current) => ({
      ...current,
      items: setQuantity(current.items, product.id, quantity),
    }))
    setAnnouncement(
      quantity > 0
        ? `${t.cart.quantityChanged} ${product.name} (${quantity})`
        : `${t.cart.removed} ${product.name}`,
    )
  }

  function remove(product) {
    setCart((current) => ({
      ...current,
      items: removeItem(current.items, product.id),
    }))
    setAnnouncement(`${t.cart.removed} ${product.name}`)
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
    getQuantity: (productId) => getQuantity(cart.items, productId),
    add,
    changeQuantity,
    remove,
    setExtraItems,
    clear,
    isOpen,
    openCart,
    closeCart: () => setIsOpen(false),
    announcement,
  }

  return <CartContext value={value}>{children}</CartContext>
}

export default CartProvider
