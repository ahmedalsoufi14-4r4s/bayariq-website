// The delivery rules. All their numbers come from "delivery" in store.json:
//   zones         [{ maxKm: 3, fee: 5 }, { maxKm: 5, fee: 10 }], nearest zone first
//   minimumOrder  the smallest order that can be delivered, in SAR
//   freeFrom      orders from this total are delivered for free
// Distances are in kilometers, as the crow flies, and places are { latitude, longitude }.

const EARTH_RADIUS_KM = 6371

function toRadians(degrees) {
  return (degrees * Math.PI) / 180
}

// The straight-line distance between two places on the globe (the haversine formula).
export function getDistanceKm(from, to) {
  const latitudeStep = toRadians(to.latitude - from.latitude)
  const longitudeStep = toRadians(to.longitude - from.longitude)
  const a =
    Math.sin(latitudeStep / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(longitudeStep / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}

// The first zone that reaches this far, or null when it is outside the delivery area.
export function getZone(distanceKm, delivery) {
  return delivery.zones.find((zone) => distanceKm <= zone.maxKm) ?? null
}

// How far the store delivers: the edge of the last zone.
export function getMaxKm(delivery) {
  return delivery.zones.at(-1).maxKm
}

export function reachesMinimum(total, delivery) {
  return total >= delivery.minimumOrder
}

export function isFreeDelivery(total, delivery) {
  return total >= delivery.freeFrom
}

// What is still missing to reach an amount, like the minimum order. Never less than 0, and
// rounded to 2 decimals, because 50 - 49.9 is 0.10000000000000142 in JavaScript.
export function getMissingAmount(total, amount) {
  return Math.max(Math.round((amount - total) * 100) / 100, 0)
}

// The delivery fee of an order: 0 when delivery is free, or null when the place is too far
// (see getZone). Without a location (distanceKm is null) it is only known when it is free.
export function getDeliveryFee({ total, distanceKm, delivery }) {
  const isFree = isFreeDelivery(total, delivery)
  if (distanceKm === null) return isFree ? 0 : null
  const zone = getZone(distanceKm, delivery)
  if (!zone) return null
  return isFree ? 0 : zone.fee
}

// The nearest branch that can deliver to this place, or null when all are too far.
export function findNearestDeliveringBranch(place, branches, delivery) {
  const reachable = branches
    .filter((branch) => branch.delivers === true)
    .map((branch) => ({ branch, distanceKm: getDistanceKm(place, branch) }))
    .filter(({ distanceKm }) => getZone(distanceKm, delivery))
    .sort((a, b) => a.distanceKm - b.distanceKm)
  return reachable[0]?.branch ?? null
}

// The possible fees in words: "5 أو 10 ر.س" or "5 or 10 SAR". Intl.ListFormat joins them the way
// each language writes "or".
export function formatFees(delivery, language, currency) {
  const fees = delivery.zones.map((zone) => String(zone.fee))
  const list = new Intl.ListFormat(language, { type: 'disjunction' })
  return `${list.format(fees)} ${currency}`
}

// 2.1234 -> "2.1": a distance is only about right anyway (a straight line, not the road).
// The "-u-nu-latn" part asks for Western digits in Arabic too, like the prices.
export function formatDistance(distanceKm, language) {
  return new Intl.NumberFormat(`${language}-u-nu-latn`, {
    maximumFractionDigits: 1,
  }).format(distanceKm)
}

// A Google Maps link to a place, for the WhatsApp message. Six decimals are about 10 cm.
export function getLocationUrl({ latitude, longitude }) {
  return `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`
}
