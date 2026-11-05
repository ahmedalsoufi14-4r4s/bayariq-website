import { filterProducts, normalizeText } from './productSearch.js'

// The chat helper (src/components/ChatBot.jsx) works out what a visitor asks here, and
// chatAnswers.js answers it. Both are plain functions with no React, so a smarter helper
// (an AI, for example) could replace them later without touching the chat panel.
//
// A question is an object: { topic }, plus branchId when it is about one branch and query
// when it looks for a product. For example:
//   { topic: 'hours', branchId: 'al-hamdaniyah' }   or   { topic: 'products', query: 'حليب' }

// The topics of the quick-question chips, in the order they show.
export const TOPICS = [
  'hours',
  'branches',
  'delivery',
  'order',
  'offers',
  'contact',
]

// Topics about one branch. The helper asks which branch first, unless the question names one.
// "branches" without a branch lists them all; with a branch it gives that branch's location.
export const BRANCH_TOPICS = ['hours', 'branches', 'delivery', 'contact']

// Each word list is one string with spaces between the words, so it is short to read and edit.
// The words are normalized like the product search, so "أوقات" also matches "اوقات".
function wordList(text) {
  return text.split(' ').map(normalizeText)
}

// Words that point to each topic, in Arabic and English. They also match inside longer
// words: "توصيل" matches "التوصيل". When a question has words of several topics, the topic
// with the most matching words wins, and on a tie the one higher in this list:
// "متى يوصل الطلب؟" has a delivery, an hours and an order word, and is about delivery.
const TOPIC_WORDS = {
  delivery: wordList('توصيل توصل يوصل دليفري ديليفري شحن deliver shipping'),
  offers: wordList(
    'عرض عروض خصم خصومات تخفيض تنزيلات offer deal discount sale promo',
  ),
  hours: wordList(
    'ساعات أوقات وقت دوام فتح مفتوح تقفل يقفل إغلاق يغلق تسكر يسكر متى hour open close when',
  ),
  order: wordList('طلب أشتري شراء سلة order buy cart purchase'),
  contact: wordList(
    'رقم أرقام جوال هاتف تلفون اتصل اتصال تواصل واتس contact phone call number whatsapp mobile',
  ),
  branches: wordList(
    'فرع فروع موقع مكان وين أين عنوان خريطة لوكيشن أقرب branch where location address map direction nearest closest',
  ),
}

// Whole words that ask whether the store has something, like "عندكم" in "هل عندكم حليب؟".
const HAVE_WORDS = wordList(
  'عندكم عندك لديكم يوجد توجد فيه متوفر متوفرة تبيعون have sell carry available stock there',
)

// Small whole words that are never product names. They are left out before the product search.
const SMALL_WORDS = wordList(
  'هل في عن من على أو و كم بكم سعر أبغى أبي أريد ابحث شي لو سمحت do does you is are any a an the some got in of or and i want need how much price please can get for to me we your it what about looking search',
)

const GREETING_WORDS = wordList(
  'مرحبا أهلا هلا السلام سلام صباح مساء hi hello hey salam',
)

// Words that start a thank you: "شكرا", "thanks".
const THANKS_WORDS = wordList('شكرا مشكور يعطيك thank thx')

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

// Splits a question into simple words: normalized like the product search, with Western
// digits and without punctuation. "هل عندكم حليب؟" -> ['هل', 'عندكم', 'حليب'].
// [^\p{L}\p{N}]+ means "anything that is not a letter or a digit", in any language.
export function toWords(text) {
  return normalizeText(text)
    .replace(/[٠-٩]/g, (digit) => ARABIC_DIGITS.indexOf(digit))
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(' ')
    .filter((word) => word !== '')
}

// "الحليب" -> "حليب", so a word with the Arabic article still finds a product or a place.
function withoutArticle(word) {
  return word.startsWith('ال') && word.length > 3 ? word.slice(2) : word
}

// The words that could be a product: "هل عندكم الحليب؟" -> "حليب".
function productQuery(words) {
  return words
    .filter((word) => !HAVE_WORDS.includes(word) && !SMALL_WORDS.includes(word))
    .map(withoutArticle)
    .join(' ')
}

// Finds products with the product search of the products section (filterProducts):
// all the words together first ("fresh milk"), then each word on its own ("milk bread"),
// in the order of products.json. A single letter is skipped: it would match almost anything.
export function findProducts(query, products) {
  if (query.length < 2) return []
  const together = filterProducts(products, 'all', query)
  if (together.length > 0) return together

  const found = query
    .split(' ')
    .filter((word) => word.length > 1)
    .flatMap((word) => filterProducts(products, 'all', word))
  return products.filter((product) => found.includes(product))
}

// A place name without the article and without spaces, for comparing:
// "حي الحمدانية" -> "حيحمدانيه", "Al Hamdaniyah" -> "hamdaniyah", "كيلو ١٤" -> "كيلو14".
function placeKey(words) {
  return words
    .filter((word) => word !== 'al')
    .map(withoutArticle)
    .join('')
}

// The branch whose district the question names, like "الحمدانية" or "Kilo 14", or undefined.
export function findBranch(words, branches) {
  const question = placeKey(words)
  return branches.find((branch) =>
    [branch.district_ar, branch.district_en].some((district) => {
      const key = placeKey(toWords(district ?? ''))
      return key !== '' && question.includes(key)
    }),
  )
}

// The topic with the most matching words, or null when no word matches.
function findTopic(text) {
  let bestTopic = null
  let bestCount = 0
  for (const [topic, keywords] of Object.entries(TOPIC_WORDS)) {
    const count = keywords.filter((keyword) => text.includes(keyword)).length
    if (count > bestCount) {
      bestTopic = topic
      bestCount = count
    }
  }
  return bestTopic
}

// Works out what a typed question is about, as a question object (see the top of this file).
// branches and products come from store.json and products.json.
export function matchQuestion(text, { branches, products }) {
  const words = toWords(text)
  const query = productQuery(words)
  const namesProducts = findProducts(query, products).length > 0
  const asksIfWeHave = words.some((word) => HAVE_WORDS.includes(word))
  const topic = findTopic(words.join(' '))
  const branch = findBranch(words, branches)

  // "هل يوجد حليب في فرع الحمدانية؟" is about the milk, even though it names a branch.
  if (asksIfWeHave && namesProducts) return { topic: 'products', query }
  if (topic) return { topic, branchId: branch?.id }
  // A product name on its own, like "حليب" or "milk price".
  if (namesProducts) return { topic: 'products', query }
  // A district on its own, like "الحمدانية".
  if (branch) return { topic: 'branches', branchId: branch.id }
  // "هل عندكم بيبسي؟": a product that is not on the list.
  if (asksIfWeHave && query !== '') return { topic: 'products', query }
  if (
    words.some((word) => THANKS_WORDS.some((thanks) => word.startsWith(thanks)))
  ) {
    return { topic: 'thanks' }
  }
  if (words.some((word) => GREETING_WORDS.includes(word))) {
    return { topic: 'greeting' }
  }
  return { topic: 'unknown' }
}
