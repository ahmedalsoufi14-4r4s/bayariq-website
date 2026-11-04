import { describe, expect, it } from 'vitest'
import { formatDate, getActiveOffers } from './offers.js'

const offers = [
  { id: 'december', validUntil: '2026-12-31' },
  { id: 'november', validUntil: '2026-11-30' },
  { id: 'october', validUntil: '2026-10-31' },
]
const ids = (list) => list.map((offer) => offer.id)

describe('getActiveOffers', () => {
  it('hides expired offers and shows the soonest ending first', () => {
    const now = new Date(2026, 10, 4)
    expect(ids(getActiveOffers(offers, now))).toEqual(['november', 'december'])
  })

  it('keeps an offer until the end of its last day', () => {
    const lastMinute = new Date(2026, 10, 30, 23, 59)
    const nextMorning = new Date(2026, 11, 1, 0, 1)
    expect(ids(getActiveOffers(offers, lastMinute))).toEqual([
      'november',
      'december',
    ])
    expect(ids(getActiveOffers(offers, nextMorning))).toEqual(['december'])
  })

  it('does not reorder the original list', () => {
    getActiveOffers(offers, new Date(2026, 0, 1))
    expect(ids(offers)).toEqual(['december', 'november', 'october'])
  })
})

describe('formatDate', () => {
  it('formats a date in English', () => {
    expect(formatDate('2026-11-30', 'en-GB')).toBe('30 November 2026')
  })

  it('formats a date in Arabic with the Gregorian calendar and Western digits', () => {
    const text = formatDate('2026-11-30', 'ar-SA-u-ca-gregory-nu-latn')
    expect(text).toContain('30')
    expect(text).toContain('نوفمبر')
    expect(text).toContain('2026')
  })
})
