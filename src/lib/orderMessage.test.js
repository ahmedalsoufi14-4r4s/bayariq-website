import { describe, expect, it } from 'vitest'
import { buildOrderMessage, buildWhatsAppUrl } from './orderMessage.js'

const labels = {
  greeting: 'Hello, I would like to order:',
  branch: 'Branch:',
  items: 'Items:',
  extraItems: 'Other items not on the list:',
  total: 'Estimated total:',
  pricedOnly: '(priced items only)',
  name: 'Name:',
  district: 'District:',
  method: 'Order type:',
  pickup: 'Pickup from the store',
  delivery: 'Delivery',
  time: 'Preferred time:',
  notes: 'Notes:',
}

const milk = {
  name_ar: 'حليب',
  name_en: 'Milk',
  unit_ar: '1 لتر',
  unit_en: '1 L',
  price: 4.5,
}
const bread = {
  name_ar: 'خبز',
  name_en: 'Bread',
  unit_ar: 'كيس',
  unit_en: 'Bag',
  price: null,
}

const fullCustomer = {
  name: ' Sara ',
  district: 'Al Hamdaniyah',
  method: 'delivery',
  time: 'After 5 pm',
  notes: 'Ring the bell',
}
const shortCustomer = {
  name: 'Sara',
  district: '',
  method: 'pickup',
  time: ' ',
  notes: '',
}

describe('buildOrderMessage', () => {
  it('lists the items, the extra items, the total and the customer details', () => {
    const message = buildOrderMessage({
      lines: [
        { product: milk, quantity: 2 },
        { product: bread, quantity: 1 },
      ],
      extraItems: ' Toothpaste ',
      customer: fullCustomer,
      branch: 'Kilo 14 branch',
      language: 'en',
      labels,
      currency: 'SAR',
    })

    expect(message).toBe(
      [
        'Hello, I would like to order:',
        '',
        'Items:',
        '- Milk (1 L) × 2 = 9 SAR',
        '- Bread (Bag) × 1',
        '',
        'Other items not on the list:',
        'Toothpaste',
        '',
        'Estimated total: 9 SAR (priced items only)',
        '',
        'Branch: Kilo 14 branch',
        'Name: Sara',
        'District: Al Hamdaniyah',
        'Order type: Delivery',
        'Preferred time: After 5 pm',
        'Notes: Ring the bell',
      ].join('\n'),
    )
  })

  it('uses the product names of the chosen language', () => {
    const message = buildOrderMessage({
      lines: [{ product: milk, quantity: 1 }],
      extraItems: '',
      customer: shortCustomer,
      branch: 'Al Hamdaniyah branch',
      language: 'ar',
      labels,
      currency: 'ر.س',
    })

    expect(message).toContain('- حليب (1 لتر) × 1 = 4.50 ر.س')
  })

  it('leaves out the total when nothing has a price, and empty optional fields', () => {
    const message = buildOrderMessage({
      lines: [{ product: bread, quantity: 3 }],
      extraItems: '',
      customer: shortCustomer,
      branch: 'Al Hamdaniyah branch',
      language: 'en',
      labels,
      currency: 'SAR',
    })

    expect(message).toBe(
      [
        'Hello, I would like to order:',
        '',
        'Items:',
        '- Bread (Bag) × 3',
        '',
        'Branch: Al Hamdaniyah branch',
        'Name: Sara',
        'Order type: Pickup from the store',
      ].join('\n'),
    )
  })

  it('works with only extra items and an empty cart', () => {
    const message = buildOrderMessage({
      lines: [],
      extraItems: 'Toothpaste',
      customer: shortCustomer,
      branch: 'Al Hamdaniyah branch',
      language: 'en',
      labels,
      currency: 'SAR',
    })

    expect(message).not.toContain('Items:')
    expect(message).toContain('Other items not on the list:\nToothpaste')
  })
})

describe('buildWhatsAppUrl', () => {
  it('puts the encoded message after the number', () => {
    expect(buildWhatsAppUrl('966500000000', 'Hi\nA & B')).toBe(
      'https://wa.me/966500000000?text=Hi%0AA%20%26%20B',
    )
  })

  it('keeps Arabic text intact after decoding', () => {
    const url = new URL(
      buildWhatsAppUrl('966500000000', 'السلام عليكم\nحليب × 2'),
    )
    expect(url.searchParams.get('text')).toBe('السلام عليكم\nحليب × 2')
  })
})
