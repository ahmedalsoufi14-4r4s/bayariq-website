import { isPlaceholder } from './placeholder.js'

// True when the branch has a real WhatsApp number, so orders can go to it.
export function takesWhatsAppOrders(branch) {
  return Boolean(branch) && !isPlaceholder(branch.whatsapp)
}

// Says why "Send order" cannot be used yet, as a key of the "order" texts,
// or null when the order is ready to go to the chosen branch.
export function getSendHintKey({ branches, branch, hasOrder }) {
  if (!branches.some(takesWhatsAppOrders)) return 'whatsappComingSoon'
  if (!hasOrder) return 'emptyHint'
  if (!branch) return 'chooseBranch'
  if (!takesWhatsAppOrders(branch)) return 'branchWhatsappComingSoon'
  return null
}
