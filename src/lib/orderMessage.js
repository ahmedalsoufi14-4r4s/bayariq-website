import { getEstimatedTotal } from './cart.js'
import { formatDistance } from './delivery.js'
import { formatPrice } from './price.js'
import { fillIn } from './text.js'

// Keeps an Arabic product name in its own right-to-left run, so an English line around it stays
// left to right. The two marks around it are invisible.
function isolate(text) {
  return `\u2068${text}\u2069`
}

// The delivery lines: the fee (or the possible fees, when the branch has to confirm it), the total
// with the fee, the distance, and the link to the customer's place on Google Maps.
// delivery is { fee, fees, distanceKm, locationUrl }: fee is null when it is not known yet, and
// distanceKm and locationUrl are null when the customer did not share their location.
function deliveryLines({ delivery, total, language, labels, currency }) {
  const { fee, fees, distanceKm, locationUrl } = delivery
  const lines = []

  if (fee === null) {
    lines.push(`${labels.deliveryFee} ${fillIn(labels.feeToConfirm, { fees })}`)
  } else if (fee === 0) {
    lines.push(`${labels.deliveryFee} ${labels.freeDelivery}`)
  } else {
    lines.push(`${labels.deliveryFee} ${formatPrice(fee, currency)}`)
    lines.push(
      `${labels.totalWithDelivery} ${formatPrice(total + fee, currency)}`,
    )
  }
  if (distanceKm !== null) {
    const distance = formatDistance(distanceKm, language)
    lines.push(fillIn(labels.distance, { distance }))
  }
  if (locationUrl) lines.push(`${labels.location} ${locationUrl}`)
  return lines
}

// Builds the WhatsApp order text in the current language.
// labels are the "order.message" texts from ar.json or en.json, and units the "products.units".
// branch is the chosen branch as text, like "فرع الحمدانية", in case branches share a number.
// delivery is null for pickup (see deliveryLines above).
// Empty optional fields (district, time, notes) are left out.
export function buildOrderMessage({
  lines,
  extraItems,
  customer,
  branch,
  delivery,
  language,
  labels,
  units,
  currency,
}) {
  const message = [labels.greeting]

  if (lines.length > 0) {
    message.push('', labels.items)
    for (const { product, quantity } of lines) {
      const price =
        product.price === null
          ? ''
          : ` = ${formatPrice(product.price * quantity, currency)}`
      message.push(
        `- ${isolate(product.name)} (${units[product.unit]}) × ${quantity}${price}`,
      )
    }
  }

  if (extraItems.trim() !== '') {
    message.push('', labels.extraItems, extraItems.trim())
  }

  const total = getEstimatedTotal(lines)
  if (lines.some((line) => line.product.price !== null)) {
    const note = lines.some((line) => line.product.price === null)
      ? ` ${labels.pricedOnly}`
      : ''
    message.push('', `${labels.total} ${formatPrice(total, currency)}${note}`)
  }

  message.push('', `${labels.branch} ${branch}`)
  message.push(`${labels.name} ${customer.name.trim()}`)
  if (customer.district.trim() !== '') {
    message.push(`${labels.district} ${customer.district.trim()}`)
  }
  message.push(`${labels.method} ${labels[customer.method]}`)
  if (delivery) {
    message.push(
      ...deliveryLines({ delivery, total, language, labels, currency }),
    )
  }
  if (customer.time.trim() !== '') {
    message.push(`${labels.time} ${customer.time.trim()}`)
  }
  if (customer.notes.trim() !== '') {
    message.push(`${labels.notes} ${customer.notes.trim()}`)
  }

  return message.join('\n')
}

// encodeURIComponent turns spaces, new lines and Arabic letters into a safe link.
export function buildWhatsAppUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
