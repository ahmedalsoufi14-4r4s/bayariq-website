import { describe, expect, it } from 'vitest'
import store from '../data/store.json'
import {
  getCallUrl,
  getMapEmbedUrl,
  getSendHintKey,
  takesWhatsAppOrders,
  withActiveBranches,
} from './branches.js'

const ready = { id: 'ready', whatsapp: '966500000000' }
const notReady = { id: 'not-ready', whatsapp: 'NEEDS-AHMED' }

describe('withActiveBranches', () => {
  it('keeps only the branches that are turned on, and the rest of the store', () => {
    const on = { id: 'on', active: true }
    const off = { id: 'off', active: false }
    expect(withActiveBranches({ name: 'Store', branches: [on, off] })).toEqual({
      name: 'Store',
      branches: [on],
    })
  })
})

describe('the branches on the site', () => {
  it('are the three active ones, each with its own WhatsApp number', () => {
    // vite.config.js already leaves the hidden branches out of this import, like on the site.
    expect(store.branches.map(({ id, whatsapp }) => [id, whatsapp])).toEqual([
      ['al-mahamid', '966535320640'],
      ['kilo-14', '966535327437'],
      ['al-hamdaniyah', '966535325463'],
    ])
    expect(JSON.stringify(store)).not.toMatch(/الحرازات|Harazat|التوفيق/)
  })

  it('have the same WhatsApp number as their phone', () => {
    for (const branch of store.branches) {
      expect(branch.phone.replace(/\D/g, '')).toBe(branch.whatsapp)
    }
  })
})

describe('getCallUrl', () => {
  it('takes the spaces out of the number', () => {
    expect(getCallUrl('+966 53 532 0640')).toBe('tel:+966535320640')
  })
})

describe('getMapEmbedUrl', () => {
  it('is a Google map of the coordinates, in the language of the site', () => {
    expect(getMapEmbedUrl({ latitude: 21.5, longitude: 39.2 }, 'ar')).toBe(
      'https://www.google.com/maps?q=21.5,39.2&z=16&hl=ar&output=embed',
    )
  })
})

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

  it('says when delivery is chosen for a place that is too far away', () => {
    expect(
      getSendHintKey({
        branches: [ready],
        branch: ready,
        hasOrder: true,
        isOutsideArea: true,
      }),
    ).toBe('outsideAreaHint')
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
