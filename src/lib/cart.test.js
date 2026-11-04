import { describe, expect, it } from 'vitest'
import {
  addItem,
  getCartLines,
  getEstimatedTotal,
  getItemCount,
  removeItem,
  setQuantity,
} from './cart.js'

const milk = { id: 'milk', price: 4.5 }
const bread = { id: 'bread', price: null }
const rice = { id: 'rice', price: 32.95 }
const products = [milk, bread, rice]

describe('addItem', () => {
  it('adds a new product with quantity 1, then counts up', () => {
    const once = addItem({}, 'milk')
    expect(once).toEqual({ milk: 1 })
    expect(addItem(once, 'milk')).toEqual({ milk: 2 })
  })

  it('does not change the old cart', () => {
    const items = { milk: 1 }
    addItem(items, 'milk')
    expect(items).toEqual({ milk: 1 })
  })
})

describe('setQuantity and removeItem', () => {
  it('sets a new quantity', () => {
    expect(setQuantity({ milk: 1 }, 'milk', 5)).toEqual({ milk: 5 })
  })

  it('removes the product at quantity 0', () => {
    expect(setQuantity({ milk: 1, rice: 2 }, 'milk', 0)).toEqual({ rice: 2 })
  })

  it('removes a product', () => {
    expect(removeItem({ milk: 1, rice: 2 }, 'rice')).toEqual({ milk: 1 })
  })
})

describe('getCartLines', () => {
  it('keeps the order and skips unknown products and bad quantities', () => {
    const lines = getCartLines(
      { rice: 1, gone: 3, milk: 2, bread: 0 },
      products,
    )
    expect(lines).toEqual([
      { product: rice, quantity: 1 },
      { product: milk, quantity: 2 },
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
