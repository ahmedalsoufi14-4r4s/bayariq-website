import { BRANCH_TOPICS, TOPICS, findProducts } from './chatQuestions.js'
import { formatDate, getActiveOffers } from './offers.js'
import { isPlaceholder } from './placeholder.js'
import { fillIn } from './text.js'

// Builds the chat helper's answers, using only the site's data files: store.json, offers.json
// and products.json. A detail that is still NEEDS-AHMED (or missing) is never shown: the answer
// says it is coming soon. See chatQuestions.js for the question objects.
//
// context is { store, offers, products, t, language, now }: the three data files, the texts of
// the current language (ar.json or en.json), 'ar' or 'en', and today's date for the offers.

// At most this many products in one answer. The products section shows them all.
export const MAX_PRODUCTS = 5

// The chips under the greeting and under a reply that did not understand: one per topic.
const TOPIC_CHIPS = TOPICS.map((topic) => ({ topic }))

// The chip under every final answer: it brings the topic chips back.
const MORE_QUESTIONS = [{ topic: 'menu' }]

// Reads a bilingual field, like LanguageProvider's localize: ('address', 'ar') -> address_ar.
function localize(item, field, language) {
  return item[`${field}_${language}`]
}

// True when a detail is filled in: not a NEEDS-AHMED placeholder and not empty.
function isKnown(value) {
  return (
    value !== undefined &&
    value !== null &&
    value !== '' &&
    !isPlaceholder(value)
  )
}

// Keeps a phone number in its own left-to-right run inside Arabic text, so "012 345 6789"
// never shows its groups in reverse order. The two marks around it are invisible.
function leftToRight(text) {
  return `⁦${text}⁩`
}

// "فرع الحمدانية" or "Al Hamdaniyah branch", like on the branch cards.
function branchLabel(branch, t, language) {
  return fillIn(t.contact.branch, {
    district: localize(branch, 'district', language),
  })
}

// A button to message the branch on WhatsApp, only when it has a real number.
function whatsAppLinks(branch, name, t) {
  if (!isKnown(branch.whatsapp)) return []
  return [
    {
      type: 'whatsapp',
      href: `https://wa.me/${branch.whatsapp}`,
      label: fillIn(t.chat.messageBranch, { branch: name }),
    },
  ]
}

// "Which branch?" with one chip per branch. For "branches" it first says how many there are.
function askForBranch(topic, { store, t }) {
  const text =
    topic === 'branches'
      ? fillIn(t.chat.branchList, { count: store.branches.length })
      : t.chat.whichBranch
  return {
    text,
    chips: store.branches.map((branch) => ({ topic, branchId: branch.id })),
  }
}

function hoursAnswer(branch, name, { t, language }) {
  const links = whatsAppLinks(branch, name, t)
  if (!Array.isArray(branch.hours) || branch.hours.length === 0) {
    return { text: fillIn(t.chat.hoursComingSoon, { branch: name }), links }
  }
  return {
    text: fillIn(t.chat.hours, { branch: name }),
    list: branch.hours.map(
      (row) =>
        `${localize(row, 'days', language)}: ${localize(row, 'time', language)}`,
    ),
    links,
  }
}

function locationAnswer(branch, name, { t, language }) {
  const address = localize(branch, 'address', language)
  const mapLinks = isKnown(branch.mapsUrl)
    ? [{ type: 'map', href: branch.mapsUrl, label: t.contact.openInMaps }]
    : []
  return {
    text: isKnown(address)
      ? fillIn(t.chat.address, { branch: name, address })
      : fillIn(t.chat.addressComingSoon, { branch: name }),
    links: [...mapLinks, ...whatsAppLinks(branch, name, t)],
  }
}

// "delivers" is true or false in store.json; anything else means it is not known yet.
function deliveryAnswer(branch, name, { t, language }) {
  const links = whatsAppLinks(branch, name, t)
  if (branch.delivers === true) {
    const details = localize(branch, 'delivery', language)
    return {
      text: fillIn(t.chat.delivers, { branch: name }),
      note: isKnown(details) ? details : undefined,
      links,
    }
  }
  if (branch.delivers === false) {
    return { text: fillIn(t.chat.noDelivery, { branch: name }), links }
  }
  return { text: fillIn(t.chat.deliveryComingSoon, { branch: name }), links }
}

function contactAnswer(branch, name, { t }) {
  const hasPhone = isKnown(branch.phone)
  const links = whatsAppLinks(branch, name, t)
  if (!hasPhone && links.length === 0) {
    return { text: fillIn(t.chat.contactComingSoon, { branch: name }) }
  }
  if (hasPhone) {
    links.push({
      type: 'call',
      href: `tel:${branch.phone}`,
      label: fillIn(t.chat.callBranch, { branch: name }),
    })
  }
  return {
    text: fillIn(t.chat.contact, { branch: name }),
    list: hasPhone
      ? [fillIn(t.chat.phone, { phone: leftToRight(branch.phone) })]
      : undefined,
    links,
  }
}

// The steps of the cart and the order form, and a note while no branch has WhatsApp yet.
function orderAnswer({ store, t }) {
  const takesOrders = store.branches.some((branch) => isKnown(branch.whatsapp))
  return {
    text: t.chat.orderIntro,
    steps: t.chat.orderSteps.map((step) =>
      fillIn(step, { send: t.order.send }),
    ),
    note: takesOrders ? undefined : t.order.whatsappComingSoon,
    showCart: true,
  }
}

// Only offers that have not ended, soonest ending first (like the offers section).
function offersAnswer({ offers, t, language, now }) {
  const activeOffers = getActiveOffers(offers, now)
  if (activeOffers.length === 0) return { text: t.chat.noOffers }
  return {
    text: t.chat.offers,
    list: activeOffers.map((offer) =>
      fillIn(t.chat.offerLine, {
        title: localize(offer, 'title', language),
        date: formatDate(offer.validUntil, t.dateLocale),
      }),
    ),
  }
}

// A product that is not on the list can still be ordered: the cart has a box for it.
function productsAnswer(query, { products, t }) {
  const found = findProducts(query ?? '', products)
  if (found.length === 0) {
    return {
      text: fillIn(t.chat.noProducts, { extraItems: t.order.extraItems }),
      showCart: true,
    }
  }
  return {
    text: t.chat.products,
    products: found.slice(0, MAX_PRODUCTS),
    note: found.length > MAX_PRODUCTS ? t.chat.moreProducts : undefined,
  }
}

// The answer to a question about a topic, or null for greetings, thanks and the like.
function topicAnswer(question, branch, context) {
  const name = branch && branchLabel(branch, context.t, context.language)
  switch (question.topic) {
    case 'hours':
      return hoursAnswer(branch, name, context)
    case 'branches':
      return locationAnswer(branch, name, context)
    case 'delivery':
      return deliveryAnswer(branch, name, context)
    case 'contact':
      return contactAnswer(branch, name, context)
    case 'order':
      return orderAnswer(context)
    case 'offers':
      return offersAnswer(context)
    case 'products':
      return productsAnswer(question.query, context)
    default:
      return null
  }
}

// The answer to one question. It has a text, and can also have:
//   list or steps: rows under the text, as bullets or as numbered steps
//   note: a smaller line after them
//   links: buttons that open WhatsApp, a phone call or Google Maps: { type, href, label }
//   products: products to show with an "Add to cart" button
//   showCart: true for an "Open the cart" button
//   chips: the questions the visitor can tap next
export function buildAnswer(question, context) {
  const { store, t } = context
  const branch = store.branches.find((item) => item.id === question.branchId)

  if (BRANCH_TOPICS.includes(question.topic) && !branch) {
    return askForBranch(question.topic, context)
  }

  const answer = topicAnswer(question, branch, context)
  if (answer) return { ...answer, chips: MORE_QUESTIONS }

  // A greeting, a thank you, "other questions", or a question the helper did not understand:
  // a short reply and the topic chips again.
  const text = ['greeting', 'menu', 'thanks'].includes(question.topic)
    ? t.chat[question.topic]
    : t.chat.unknown
  return { text, chips: TOPIC_CHIPS }
}

// The words on a chip, and in the visitor's bubble after tapping it:
// the branch for a branch chip ("فرع الحمدانية"), otherwise the topic ("أوقات العمل").
export function getQuestionLabel(question, { store, t, language }) {
  const branch = store.branches.find((item) => item.id === question.branchId)
  if (branch) return branchLabel(branch, t, language)
  if (question.topic === 'menu') return t.chat.moreQuestions
  return t.chat.topics[question.topic]
}
