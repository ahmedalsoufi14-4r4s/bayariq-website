import {
  filterProducts,
  getSearchWords,
  normalizeText,
} from './productSearch.js'

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
  'featured',
  'contact',
]

// Topics about one branch. The helper asks which branch first, unless the question names one.
// "branches" without a branch lists them all; with a branch it gives that branch's location.
export const BRANCH_TOPICS = ['hours', 'branches', 'delivery', 'contact']

// Topics that can share a question with a product: "do you have milk in the Kilo 14 branch?".
const TOPICS_WITH_PRODUCTS = ['branches', 'order', 'featured']

// Each word list is one string with spaces between the words, so it is short to read and edit.
// The words are normalized like the product search, so "أوقات" also matches "اوقات".
function wordList(text) {
  return text.split(' ').map(normalizeText)
}

// Words that point to each topic, in Arabic and English. They match the start of a word, also
// after a short Arabic prefix: "توصيل" matches "التوصيل" and "للتوصيل". When a question has words
// of several topics, the topic with the most matching words wins, and on a tie the one higher in
// this list: "متى يوصل الطلب؟" has a delivery, an hours and an order word, and is about delivery.
const TOPIC_WORDS = {
  delivery: wordList(
    'توصيل توصل توصلون يوصل دليفري ديليفري شحن deliver shipping',
  ),
  offers: wordList(
    'عرض عروض خصم خصومات تخفيض تنزيلات offer deal discount sale promo',
  ),
  hours: wordList(
    'ساعات أوقات وقت دوام فتح تفتح يفتح مفتوح تقفل يقفل إغلاق يغلق تسكر يسكر hour open close when',
  ),
  order: wordList(
    'طلب أطلب نطلب أشتري شراء سلة order buy cart purchase shopping',
  ),
  social: wordList(
    'حساب حسابات حسابكم انستقرام انستغرام انستا سناب تويتر تيك فيسبوك سوشال وسائل instagram insta snapchat twitter tiktok facebook social account',
  ),
  contact: wordList(
    'رقم أرقام جوال هاتف تلفون اتصل اتصال تواصل واتس contact phone call number whatsapp mobile',
  ),
  branches: wordList(
    'فرع فروع موقع مواقع مكان عنوان خريطة لوكيشن أقرب branch where location address map direction nearest closest',
  ),
  featured: wordList('مميز مميزة منتجات منتجاتكم featured products popular'),
}

// Short question words that only count as whole words: "اين" (where) is also inside "فاين"
// (Fine, the tissues).
const WHOLE_WORDS = {
  branches: wordList('وين أين'),
  hours: wordList('متى'),
}

// Whole words that ask whether the store has something, like "عندكم" in "هل عندكم حليب؟".
const HAVE_WORDS = wordList(
  'عندكم عندك لديكم يوجد توجد فيه متوفر متوفرة تبيعون have sell carry available stock there',
)

// Small whole words that are never product names. They are left out before the product search.
const SMALL_WORDS = wordList(
  'هل في عن من على أو و كم بكم سعر أبغى أبي أريد ابحث شي لو سمحت ممكن do does you is are any a an the some got in of or and i want need how much price please can get for to me we your it what about looking search',
)

const GREETING_WORDS = wordList(
  'مرحبا أهلا هلا السلام سلام عليكم صباح مساء الخير hi hello hey salam',
)

// Words that start a thank you: "شكرا", "thanks".
const THANKS_WORDS = wordList('شكرا مشكور يعطيك thank thx')

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

// A one-letter search would match almost anything.
const MIN_QUERY_LENGTH = 2

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

// True when the word points to the topic. The short Arabic prefixes (و ف ب ك ل, with or without
// the article) are skipped, so "والتوصيل" matches "توصيل".
function isTopicWord(word, topic) {
  if (WHOLE_WORDS[topic]?.includes(word)) return true
  const bare = word.replace(/^([وفبك]?ال|لل|[وفبكل])(?=..)/, '')
  return TOPIC_WORDS[topic].some(
    (keyword) => word.startsWith(keyword) || bare.startsWith(keyword),
  )
}

// The topic with the most matching words, or null when no word matches.
function findTopic(words) {
  let bestTopic = null
  let bestCount = 0
  for (const topic of Object.keys(TOPIC_WORDS)) {
    const count = words.filter((word) => isTopicWord(word, topic)).length
    if (count > bestCount) {
      bestTopic = topic
      bestCount = count
    }
  }
  return bestTopic
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

// The words that could be a product: "هل عندكم الحليب في فرع الحمدانية؟" -> "حليب".
// Left out: words that ask, small words, greetings, words of a topic, and the branch's district.
function productQuery(words, branch) {
  const districtWords = branch
    ? toWords(`${branch.district_ar} ${branch.district_en}`).map(withoutArticle)
    : []
  const isLeftOut = (word) =>
    HAVE_WORDS.includes(word) ||
    SMALL_WORDS.includes(word) ||
    GREETING_WORDS.includes(word) ||
    districtWords.includes(withoutArticle(word)) ||
    Object.keys(TOPIC_WORDS).some((topic) => isTopicWord(word, topic))
  return words
    .filter((word) => !isLeftOut(word))
    .map(withoutArticle)
    .join(' ')
}

// Finds products with the search of the products section: the ones with all the words, or else
// the ones with the most of the words ("milk bread" finds both).
export function findProducts(query, products) {
  if (query.length < MIN_QUERY_LENGTH) return []
  const together = filterProducts(products, query)
  if (together.length > 0) return together

  const words = getSearchWords(query).filter((word) => word.length > 1)
  const counts = products.map(
    (product) =>
      words.filter((word) => product.searchText.includes(word)).length,
  )
  const most = counts.reduce((a, b) => Math.max(a, b), 0)
  return most === 0 ? [] : products.filter((_, index) => counts[index] === most)
}

// What the words of a typed question say, before looking at the product list.
function readQuestion(text, branches) {
  const words = toWords(text)
  const branch = findBranch(words, branches)
  return {
    words,
    branch,
    topic: findTopic(words),
    query: productQuery(words, branch),
    asksIfWeHave: words.some((word) => HAVE_WORDS.includes(word)),
    isThanks: words.some((word) =>
      THANKS_WORDS.some((thanks) => word.startsWith(thanks)),
    ),
    isGreeting: words.some((word) => GREETING_WORDS.includes(word)),
  }
}

// True when a question can only be understood with the full product list: the chat panel then
// waits until every category has loaded, before calling matchQuestion.
export function needsProducts(text, branches) {
  const { topic, query, asksIfWeHave, isThanks } = readQuestion(text, branches)
  if (query.length < MIN_QUERY_LENGTH || isThanks) return false
  if (topic === null) return true
  return asksIfWeHave && TOPICS_WITH_PRODUCTS.includes(topic)
}

// Works out what a typed question is about, as a question object (see the top of this file).
// branches come from store.json; products is the product list (see needsProducts).
export function matchQuestion(text, { branches, products }) {
  const { topic, branch, query, asksIfWeHave, isThanks, isGreeting } =
    readQuestion(text, branches)
  const namesProducts =
    query.length >= MIN_QUERY_LENGTH &&
    filterProducts(products, query).length > 0

  // "هل يوجد حليب في فرع الحمدانية؟" is about the milk, even though it names a branch.
  if (asksIfWeHave && namesProducts && TOPICS_WITH_PRODUCTS.includes(topic)) {
    return { topic: 'products', query }
  }
  if (topic) return { topic, branchId: branch?.id }
  if (isThanks) return { topic: 'thanks' }
  // "هل عندكم بيبسي؟", also for a product that is not on the list, so the answer can say so.
  if (asksIfWeHave && query !== '') return { topic: 'products', query }
  // A product name on its own, like "حليب" or "milk price".
  if (namesProducts) return { topic: 'products', query }
  // A district on its own, like "الحمدانية".
  if (branch) return { topic: 'branches', branchId: branch.id }
  if (isGreeting) return { topic: 'greeting' }
  return { topic: 'unknown' }
}
