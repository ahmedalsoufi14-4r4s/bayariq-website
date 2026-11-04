import { describe, expect, it } from 'vitest'
import { fillIn } from './text.js'

describe('fillIn', () => {
  it('fills each gap with its value', () => {
    expect(fillIn('فرع {district}', { district: 'الحمدانية' })).toBe(
      'فرع الحمدانية',
    )
    expect(
      fillIn('{district} branch, {city}', {
        district: 'Kilo 14',
        city: 'Jeddah',
      }),
    ).toBe('Kilo 14 branch, Jeddah')
  })

  it('leaves a gap without a value as it is', () => {
    expect(fillIn('Hello {name}', {})).toBe('Hello {name}')
  })
})
