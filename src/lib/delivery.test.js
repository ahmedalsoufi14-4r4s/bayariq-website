import { describe, expect, it } from 'vitest'
import store from '../data/store.json'
import {
  findNearestDeliveringBranch,
  formatDistance,
  formatFees,
  getDeliveryFee,
  getDistanceKm,
  getLocationUrl,
  getMaxKm,
  getMissingAmount,
  getZone,
  isFreeDelivery,
  reachesMinimum,
} from './delivery.js'

// The same rules as the store's today, written here so the tests keep their meaning.
const delivery = {
  zones: [
    { maxKm: 3, fee: 5 },
    { maxKm: 5, fee: 10 },
  ],
  minimumOrder: 50,
  freeFrom: 200,
}

// One degree of latitude is about 111.2 km, so this is `km` north of a place.
function north(place, km) {
  return {
    latitude: place.latitude + km / 111.195,
    longitude: place.longitude,
  }
}

const shop = { latitude: 21.45, longitude: 39.39 }

describe('getDistanceKm', () => {
  it('is 0 for the same place', () => {
    expect(getDistanceKm(shop, shop)).toBe(0)
  })

  it('measures in a straight line, in both directions', () => {
    expect(getDistanceKm(shop, north(shop, 4))).toBeCloseTo(4, 2)
    expect(getDistanceKm(north(shop, 4), shop)).toBeCloseTo(4, 2)
  })

  it('knows how far apart Jeddah and Makkah are', () => {
    const jeddah = { latitude: 21.5433, longitude: 39.1728 }
    const makkah = { latitude: 21.4225, longitude: 39.8262 }
    const distance = getDistanceKm(jeddah, makkah)
    expect(distance).toBeGreaterThan(68)
    expect(distance).toBeLessThan(70)
  })
})

describe('getZone', () => {
  it.each([
    [0, 5],
    [2.9, 5],
    [3, 5],
    [3.01, 10],
    [5, 10],
  ])('%s km costs %s SAR', (distanceKm, fee) => {
    expect(getZone(distanceKm, delivery).fee).toBe(fee)
  })

  it('is null outside the delivery area', () => {
    expect(getZone(5.01, delivery)).toBe(null)
    expect(getMaxKm(delivery)).toBe(5)
  })
})

describe('minimum order and free delivery', () => {
  it('delivers from 50 SAR', () => {
    expect(reachesMinimum(49.99, delivery)).toBe(false)
    expect(reachesMinimum(50, delivery)).toBe(true)
  })

  it('is free from 200 SAR', () => {
    expect(isFreeDelivery(199.99, delivery)).toBe(false)
    expect(isFreeDelivery(200, delivery)).toBe(true)
  })

  it('says how much is missing, without floating point leftovers', () => {
    expect(getMissingAmount(49.9, 50)).toBe(0.1)
    expect(getMissingAmount(120, 200)).toBe(80)
    expect(getMissingAmount(250, 200)).toBe(0)
  })
})

describe('getDeliveryFee', () => {
  it('follows the zone', () => {
    expect(getDeliveryFee({ total: 60, distanceKm: 2, delivery })).toBe(5)
    expect(getDeliveryFee({ total: 60, distanceKm: 4, delivery })).toBe(10)
  })

  it('is 0 for an order with free delivery', () => {
    expect(getDeliveryFee({ total: 200, distanceKm: 4, delivery })).toBe(0)
  })

  it('without a location is only known when delivery is free', () => {
    expect(getDeliveryFee({ total: 60, distanceKm: null, delivery })).toBe(null)
    expect(getDeliveryFee({ total: 200, distanceKm: null, delivery })).toBe(0)
  })

  it('does not exist too far away, even for a big order', () => {
    expect(getDeliveryFee({ total: 500, distanceKm: 6, delivery })).toBe(null)
  })
})

describe('findNearestDeliveringBranch', () => {
  const near = { id: 'near', ...north(shop, 1), delivers: true }
  const far = { id: 'far', ...north(shop, 4), delivers: true }
  const pickupOnly = { id: 'pickup-only', ...shop, delivers: false }

  it('picks the nearest branch that delivers', () => {
    expect(
      findNearestDeliveringBranch(shop, [far, pickupOnly, near], delivery),
    ).toBe(near)
  })

  it('is null when every branch is too far', () => {
    const place = north(shop, 30)
    expect(findNearestDeliveringBranch(place, [near, far], delivery)).toBe(null)
  })
})

describe('formatFees and formatDistance', () => {
  it('names the possible fees in each language', () => {
    expect(formatFees(delivery, 'ar', 'ر.س')).toBe('5 أو 10 ر.س')
    expect(formatFees(delivery, 'en', 'SAR')).toBe('5 or 10 SAR')
  })

  it('rounds a distance to one decimal, with Western digits', () => {
    expect(formatDistance(2.1234, 'ar')).toBe('2.1')
    expect(formatDistance(4, 'en')).toBe('4')
  })
})

describe('getLocationUrl', () => {
  it('is a Google Maps link with the coordinates', () => {
    expect(
      getLocationUrl({ latitude: 21.4452077, longitude: 39.3938651 }),
    ).toBe('https://www.google.com/maps?q=21.445208,39.393865')
  })
})

describe('the rules in store.json', () => {
  it('are the ones the family confirmed', () => {
    expect(store.delivery).toMatchObject(delivery)
  })

  it('every branch has coordinates to measure from', () => {
    for (const branch of store.branches) {
      expect(branch.latitude).toBeTypeOf('number')
      expect(branch.longitude).toBeTypeOf('number')
    }
  })
})
