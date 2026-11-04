// 5 -> "5 ر.س" and 4.5 -> "4.50 ر.س". The currency label comes from the language file.
export function formatPrice(price, currency) {
  const amount = Number.isInteger(price) ? String(price) : price.toFixed(2)
  return `${amount} ${currency}`
}
