import { isPlaceholder } from './placeholder.js'

// The store without its hidden branches ("active": false in store.json), so a branch can be
// turned off and on again without losing its details. vite.config.js uses it to keep hidden
// branches out of the site, and the scripts and tests use it too.
export function withActiveBranches(store) {
  return {
    ...store,
    branches: store.branches.filter((branch) => branch.active),
  }
}

// True when the branch has a real WhatsApp number, so orders can go to it.
export function takesWhatsAppOrders(branch) {
  return Boolean(branch) && !isPlaceholder(branch.whatsapp)
}

// "+966 53 532 0640" -> "tel:+966535320640", the link that starts a phone call.
export function getCallUrl(phone) {
  return `tel:${phone.replace(/\s/g, '')}`
}

// The address of a small Google map with a pin on the branch, for the <iframe> on its card.
// language ('ar' or 'en') sets the language of the map's own buttons.
export function getMapEmbedUrl(branch, language) {
  const place = `${branch.latitude},${branch.longitude}`
  return `https://www.google.com/maps?q=${place}&z=16&hl=${language}&output=embed`
}

// Says why "Send order" cannot be used yet, as a key of the "order" texts,
// or null when the order is ready to go to the chosen branch.
// isOutsideArea is true when delivery is chosen and the customer's location is too far away.
export function getSendHintKey({ branches, branch, hasOrder, isOutsideArea }) {
  if (!branches.some(takesWhatsAppOrders)) return 'whatsappComingSoon'
  if (!hasOrder) return 'emptyHint'
  if (!branch) return 'chooseBranch'
  if (!takesWhatsAppOrders(branch)) return 'branchWhatsappComingSoon'
  if (isOutsideArea) return 'outsideAreaHint'
  return null
}
