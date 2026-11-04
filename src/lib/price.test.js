import { describe, expect, it } from 'vitest'
import { formatPrice } from './price.js'

describe('formatPrice', () => {
  it('shows whole prices without decimals', () => {
    expect(formatPrice(5, 'ر.س')).toBe('5 ر.س')
  })

  it('shows other prices with two decimals', () => {
    expect(formatPrice(4.5, 'SAR')).toBe('4.50 SAR')
  })
})
