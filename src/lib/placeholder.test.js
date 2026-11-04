import { describe, expect, it } from 'vitest'
import { isPlaceholder } from './placeholder.js'

describe('isPlaceholder', () => {
  it('spots values tagged NEEDS-AHMED', () => {
    expect(isPlaceholder('NEEDS-AHMED')).toBe(true)
    expect(isPlaceholder('NEEDS-AHMED: full address')).toBe(true)
  })

  it('accepts real values of any type', () => {
    expect(isPlaceholder('966500000000')).toBe(false)
    expect(isPlaceholder(true)).toBe(false)
    expect(isPlaceholder([{ days_en: 'Daily' }])).toBe(false)
  })
})
