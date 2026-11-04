// Turns a Date into "YYYY-MM-DD" in the visitor's local time.
function toLocalISODate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// Keeps offers until the end of their validUntil day, soonest ending first.
// "YYYY-MM-DD" strings sort like dates, so plain string comparison works.
export function getActiveOffers(offers, now) {
  const today = toLocalISODate(now)

  return offers
    .filter((offer) => offer.validUntil >= today)
    .sort((a, b) => a.validUntil.localeCompare(b.validUntil))
}

// "2026-11-30" -> "30 November 2026" (en-GB) or "30 نوفمبر 2026" (Arabic).
export function formatDate(isoDate, locale) {
  // new Date('2026-11-30') means midnight UTC, which is still the 29th in some time zones,
  // so we build the date from its parts in local time instead.
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
