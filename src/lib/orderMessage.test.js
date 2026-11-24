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
  deliveryFee: 'Delivery fee:',
  freeDelivery: 'Free',
  feeToConfirm: '{fees} depending on distance (the branch confirms)',
  distance: 'Distance to the branch: about {distance} km',
  totalWithDelivery: 'Total with delivery:',
  location: 'My location on the map:',
  time: 'Preferred time:',
  notes: 'Notes:',
}

const units = { piece: 'piece', kg: 'kg' }
const milk = { name: 'حليب طازج 1 لتر', unit: 'piece', price: 4.5 }
const sweets = { name: 'حلويات', unit: 'kg', price: null }

// Product names sit between two invisible marks that keep them right to left.
const name = (product) => `\u2068${product.name}\u2069`

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
        { product: sweets, quantity: 1 },
      ],
      extraItems: ' Toothpaste ',
      customer: fullCustomer,
      branch: 'Kilo 14 branch',
      delivery: null,
      language: 'en',
      labels,
      units,
      currency: 'SAR',
    })

    expect(message).toBe(
      [
        'Hello, I would like to order:',
        '',
        'Items:',
        `- ${name(milk)} (piece) × 2 = 9 SAR`,
        `- ${name(sweets)} (kg) × 1`,
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

  it('uses the texts and the currency of the chosen language', () => {
    const message = buildOrderMessage({
      lines: [{ product: milk, quantity: 1 }],
      extraItems: '',
      customer: shortCustomer,
      branch: 'فرع الحمدانية',
      delivery: null,
      language: 'ar',
      labels,
      units: { piece: 'حبة', kg: 'كجم' },
      currency: 'ر.س',
    })

    expect(message).toContain(`- ${name(milk)} (حبة) × 1 = 4.50 ر.س`)
  })

  it('leaves out the total when nothing has a price, and empty optional fields', () => {
    const message = buildOrderMessage({
      lines: [{ product: sweets, quantity: 3 }],
      extraItems: '',
      customer: shortCustomer,
      branch: 'Al Hamdaniyah branch',
      delivery: null,
      language: 'en',
      labels,
      units,
      currency: 'SAR',
    })

    expect(message).toBe(
      [
        'Hello, I would like to order:',
        '',
        'Items:',
        `- ${name(sweets)} (kg) × 3`,
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
      delivery: null,
      language: 'en',
      labels,
      units,
      currency: 'SAR',
    })

    expect(message).not.toContain('Items:')
    expect(message).toContain('Other items not on the list:\nToothpaste')
  })
})

describe('buildOrderMessage: delivery', () => {
  // 20 milks are 90 SAR.
  function deliveryMessage(delivery) {
    return buildOrderMessage({
      lines: [{ product: milk, quantity: 20 }],
      extraItems: '',
      customer: fullCustomer,
      branch: 'Kilo 14 branch',
      delivery: { fees: '5 or 10 SAR', ...delivery },
      language: 'en',
      labels,
      units,
      currency: 'SAR',
    }).split('\n')
  }

  it('without a location, leaves the fee to the branch', () => {
    const message = deliveryMessage({
      fee: null,
      distanceKm: null,
      locationUrl: null,
    })
    expect(message).toContain(
      'Delivery fee: 5 or 10 SAR depending on distance (the branch confirms)',
    )
    expect(message.join('\n')).not.toContain('My location')
    expect(message.join('\n')).not.toContain('Total with delivery')
  })

  it('with a location, gives the fee, the total with it, the distance and the map link', () => {
    const message = deliveryMessage({
      fee: 10,
      distanceKm: 4.26,
      locationUrl: 'https://www.google.com/maps?q=21.5,39.2',
    })
    const start = message.indexOf('Order type: Delivery')
    expect(message.slice(start, start + 5)).toEqual([
      'Order type: Delivery',
      'Delivery fee: 10 SAR',
      'Total with delivery: 100 SAR',
      'Distance to the branch: about 4.3 km',
      'My location on the map: https://www.google.com/maps?q=21.5,39.2',
    ])
  })

  it('says when delivery is free', () => {
    const message = deliveryMessage({
      fee: 0,
      distanceKm: null,
      locationUrl: null,
    })
    expect(message).toContain('Delivery fee: Free')
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
