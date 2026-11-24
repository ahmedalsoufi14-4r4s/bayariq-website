import { describe, expect, it } from 'vitest'
import {
  addItem,
  getCartLines,
  getEstimatedTotal,
  getItemCount,
  getQuantity,
  removeItem,
  setQuantity,
} from './cart.js'

const milk = {
  id: '1030757',
  name: 'حليب',
  category: 'dairy',
  price: 4.5,
  unit: 'piece',
}
const bread = {
  id: '0040876',
  name: 'خبز',
  category: 'sweets',
  price: null,
  unit: 'piece',
}
const rice = {
  id: '1090253',
  name: 'رز',
  category: 'tea-coffee',
  price: 32.95,
  unit: 'kg',
}

describe('addItem', () => {
  it('adds a new product with quantity 1, then counts up', () => {
    const once = addItem([], milk)
    expect(once).toEqual([{ product: milk, quantity: 1 }])
    expect(addItem(once, milk)).toEqual([{ product: milk, quantity: 2 }])
  })

  it('keeps the order the products were added in', () => {
    const items = addItem(addItem(addItem([], rice), bread), milk)
    expect(items.map((item) => item.product.id)).toEqual([
      rice.id,
      bread.id,
      milk.id,
    ])
  })

  it('copies only what the cart needs', () => {
    const [item] = addItem([], { ...milk, searchText: 'حليب', featured: true })
    expect(item.product).toEqual(milk)
  })

  it('does not change the old cart', () => {
    const items = addItem([], milk)
    addItem(items, milk)
    expect(items).toEqual([{ product: milk, quantity: 1 }])
  })
})

describe('getQuantity, setQuantity and removeItem', () => {
  const items = addItem(addItem([], milk), rice)

  it('reads the quantity, 0 for a product that is not in the cart', () => {
    expect(getQuantity(items, milk.id)).toBe(1)
    expect(getQuantity(items, 'other')).toBe(0)
  })

  it('sets a new quantity', () => {
    expect(getQuantity(setQuantity(items, milk.id, 5), milk.id)).toBe(5)
  })

  it('removes the product at quantity 0', () => {
    expect(setQuantity(items, milk.id, 0)).toEqual([
      { product: rice, quantity: 1 },
    ])
  })

  it('removes a product', () => {
    expect(removeItem(items, rice.id)).toEqual([{ product: milk, quantity: 1 }])
  })
})

describe('getCartLines', () => {
  const items = addItem(addItem([], rice), milk)

  it('shows the saved products while their categories have not loaded', () => {
    expect(getCartLines(items, {})).toEqual([
      { product: rice, quantity: 1 },
      { product: milk, quantity: 1 },
    ])
  })

  it('uses today’s price once the category has loaded', () => {
    const cheaperMilk = { ...milk, price: 4 }
    const [, line] = getCartLines(items, { dairy: [cheaperMilk] })
    expect(line.product.price).toBe(4)
  })

  it('leaves out a product that is no longer in its category', () => {
    expect(getCartLines(items, { dairy: [] })).toEqual([
      { product: rice, quantity: 1 },
    ])
  })
})

describe('getItemCount and getEstimatedTotal', () => {
  const lines = [
    { product: milk, quantity: 2 },
    { product: bread, quantity: 1 },
    { product: rice, quantity: 3 },
  ]

  it('counts every unit', () => {
    expect(getItemCount(lines)).toBe(6)
  })

  it('adds up priced products only and rounds to 2 decimals', () => {
    expect(getEstimatedTotal(lines)).toBe(107.85)
  })

  it('is 0 when nothing has a price', () => {
    expect(getEstimatedTotal([{ product: bread, quantity: 4 }])).toBe(0)
  })
})
