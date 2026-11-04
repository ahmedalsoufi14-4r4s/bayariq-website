import { describe, expect, it } from 'vitest'
import { getSendHintKey, takesWhatsAppOrders } from './branches.js'

const ready = { id: 'ready', whatsapp: '966500000000' }
const notReady = { id: 'not-ready', whatsapp: 'NEEDS-AHMED' }

describe('takesWhatsAppOrders', () => {
  it('is true only for a branch with a real WhatsApp number', () => {
    expect(takesWhatsAppOrders(ready)).toBe(true)
    expect(takesWhatsAppOrders(notReady)).toBe(false)
    expect(takesWhatsAppOrders(undefined)).toBe(false)
  })
})

describe('getSendHintKey', () => {
  it('says WhatsApp orders are coming soon while no branch has a number', () => {
    expect(
      getSendHintKey({
        branches: [notReady],
        branch: notReady,
        hasOrder: true,
      }),
    ).toBe('whatsappComingSoon')
  })

  it('asks for something to order before anything else', () => {
    expect(
      getSendHintKey({
        branches: [ready, notReady],
        branch: ready,
        hasOrder: false,
      }),
    ).toBe('emptyHint')
  })

  it('asks the customer to choose a branch', () => {
    expect(
      getSendHintKey({
        branches: [ready, notReady],
        branch: undefined,
        hasOrder: true,
      }),
    ).toBe('chooseBranch')
  })

  it('says when the chosen branch does not take WhatsApp orders yet', () => {
    expect(
      getSendHintKey({
        branches: [ready, notReady],
        branch: notReady,
        hasOrder: true,
      }),
    ).toBe('branchWhatsappComingSoon')
  })

  it('gives no hint when the order can go to the chosen branch', () => {
    expect(
      getSendHintKey({
        branches: [ready, notReady],
        branch: ready,
        hasOrder: true,
      }),
    ).toBe(null)
  })
})
