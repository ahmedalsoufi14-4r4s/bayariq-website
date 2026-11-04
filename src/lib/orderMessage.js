import { getEstimatedTotal } from './cart.js'
import { formatPrice } from './price.js'

// Builds the WhatsApp order text in the current language.
// labels are the "order.message" texts from ar.json or en.json.
// branch is the chosen branch as text, like "فرع الحمدانية", in case branches share a number.
// Empty optional fields (district, time, notes) are left out.
export function buildOrderMessage({
  lines,
  extraItems,
  customer,
  branch,
  language,
  labels,
  currency,
}) {
  const message = [labels.greeting]

  if (lines.length > 0) {
    message.push('', labels.items)
    for (const { product, quantity } of lines) {
      const name = product[`name_${language}`]
      const unit = product[`unit_${language}`]
      const price =
        product.price === null
          ? ''
          : ` = ${formatPrice(product.price * quantity, currency)}`
      message.push(`- ${name} (${unit}) × ${quantity}${price}`)
    }
  }

  if (extraItems.trim() !== '') {
    message.push('', labels.extraItems, extraItems.trim())
  }

  if (lines.some((line) => line.product.price !== null)) {
    const total = formatPrice(getEstimatedTotal(lines), currency)
    const note = lines.some((line) => line.product.price === null)
      ? ` ${labels.pricedOnly}`
      : ''
    message.push('', `${labels.total} ${total}${note}`)
  }

  message.push('', `${labels.branch} ${branch}`)
  message.push(`${labels.name} ${customer.name.trim()}`)
  if (customer.district.trim() !== '') {
    message.push(`${labels.district} ${customer.district.trim()}`)
  }
  message.push(`${labels.method} ${labels[customer.method]}`)
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
