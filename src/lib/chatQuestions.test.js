import { describe, expect, it } from 'vitest'
import {
  findBranch,
  findProducts,
  matchQuestion,
  toWords,
} from './chatQuestions.js'

const branches = [
  { id: 'al-hamdaniyah', district_ar: 'الحمدانية', district_en: 'Al Hamdaniyah' },
  { id: 'kilo-14', district_ar: 'كيلو 14', district_en: 'Kilo 14' },
  { id: 'al-mahamid', district_ar: 'المحاميد', district_en: 'Al Mahamid' },
  { id: 'al-harazat', district_ar: 'الحرازات', district_en: 'Al Harazat' },
]

const products = [
  { id: 'milk', name_ar: 'حليب طازج', name_en: 'Fresh milk', category: 'dairy' },
  { id: 'bread', name_ar: 'خبز عربي', name_en: 'Arabic bread', category: 'bakery' },
  { id: 'rice', name_ar: 'أرز بسمتي', name_en: 'Basmati rice', category: 'pantry' },
  { id: 'coffee', name_ar: 'قهوة عربية', name_en: 'Arabic coffee', category: 'pantry' },
]

function ask(text) {
  return matchQuestion(text, { branches, products })
}

describe('toWords', () => {
  it('normalizes letters, drops punctuation and turns Arabic digits into Western ones', () => {
    expect(toWords('هل عندكم حليب؟')).toEqual(['هل', 'عندكم', 'حليب'])
    expect(toWords('فرع كيلو ١٤!')).toEqual(['فرع', 'كيلو', '14'])
    expect(toWords('مرحباً، أهلاً')).toEqual(['مرحبا', 'اهلا'])
    expect(toWords('  Your NUMBER?? ')).toEqual(['your', 'number'])
    expect(toWords('؟!...')).toEqual([])
  })
})

describe('matchQuestion: topics', () => {
  it.each([
    ['ما هي أوقات العمل؟', 'hours'],
    ['متى تفتحون؟', 'hours'],
    ['What time do you open?', 'hours'],
    ['وين فروعكم؟', 'branches'],
    ['Where are you?', 'branches'],
    ['هل عندكم توصيل؟', 'delivery'],
    ['Do you deliver?', 'delivery'],
    ['كيف أطلب؟', 'order'],
    ['How do I order?', 'order'],
    ['هل توجد عروض أو خصومات؟', 'offers'],
    ['Any deals this week?', 'offers'],
    ['أبغى رقم الجوال', 'contact'],
    ['What is your phone number?', 'contact'],
  ])('"%s" is about %s', (text, topic) => {
    expect(ask(text).topic).toBe(topic)
  })

  it('picks the topic with the most matching words, and the higher one on a tie', () => {
    // Two branch words beat one hours word ("close" inside "closest").
    expect(ask('Where is the closest branch?').topic).toBe('branches')
    // A delivery, an hours and an order word: delivery is first in the list.
    expect(ask('متى يوصل الطلب؟').topic).toBe('delivery')
    // A contact word and a branch word: contact comes before branches.
    expect(ask('تواصل مع فرع').topic).toBe('contact')
  })

  it('ignores Arabic letter variants and diacritics, like the product search', () => {
    expect(ask('أوقات العمل')).toEqual(ask('اوقات العمل'))
    expect(ask('مَتَى تَفْتَحُونَ')).toEqual({ topic: 'hours' })
  })
})

describe('matchQuestion: branches', () => {
  it('keeps the branch the question names, in Arabic or English', () => {
    expect(ask('متى يفتح فرع الحمدانية؟')).toEqual({
      topic: 'hours',
      branchId: 'al-hamdaniyah',
    })
    expect(ask('Kilo 14 phone number')).toEqual({
      topic: 'contact',
      branchId: 'kilo-14',
    })
    expect(ask('هل فرع المحاميد يوصل؟')).toEqual({
      topic: 'delivery',
      branchId: 'al-mahamid',
    })
  })

  it('finds a district without its article, with Arabic digits and without a space', () => {
    expect(ask('حمدانية').branchId).toBe('al-hamdaniyah')
    expect(ask('hamdaniyah').branchId).toBe('al-hamdaniyah')
    expect(ask('كيلو ١٤').branchId).toBe('kilo-14')
    expect(ask('كيلو14').branchId).toBe('kilo-14')
  })

  it('takes a district on its own as a question about where that branch is', () => {
    expect(ask('الحرازات')).toEqual({ topic: 'branches', branchId: 'al-harazat' })
  })

  it('leaves the branch out when the question names none', () => {
    expect(ask('متى تفتحون؟')).toEqual({ topic: 'hours' })
  })

  it('skips a branch whose district is missing', () => {
    const noDistrict = { id: 'no-district' }
    expect(findBranch(['حمدانيه'], [noDistrict, branches[0]])).toBe(branches[0])
    expect(findBranch(['فرع'], [noDistrict])).toBeUndefined()
  })
})

describe('matchQuestion: products', () => {
  it('turns "do you have X?" into a product search for X', () => {
    expect(ask('هل عندكم حليب؟')).toEqual({ topic: 'products', query: 'حليب' })
    expect(ask('Do you have fresh milk?')).toEqual({
      topic: 'products',
      query: 'fresh milk',
    })
    // The Arabic article is left out, so "الأرز" finds "أرز بسمتي".
    expect(ask('عندكم الأرز؟')).toEqual({ topic: 'products', query: 'ارز' })
  })

  it('searches for a product named on its own', () => {
    expect(ask('حليب')).toEqual({ topic: 'products', query: 'حليب' })
    expect(ask('كم سعر الخبز؟')).toEqual({ topic: 'products', query: 'خبز' })
  })

  it('keeps a "do you have" question about the product, even when it names a branch', () => {
    expect(ask('هل يوجد حليب في فرع الحمدانية؟').topic).toBe('products')
  })

  it('keeps a "do you have" question about a topic on that topic', () => {
    expect(ask('هل عندكم عروض؟').topic).toBe('offers')
    expect(ask('Do you have delivery?').topic).toBe('delivery')
  })

  it('still searches when the product is not on the list, so the answer can say so', () => {
    expect(ask('هل عندكم بيبسي؟')).toEqual({ topic: 'products', query: 'بيبسي' })
    expect(ask('Is there any pepsi?')).toEqual({
      topic: 'products',
      query: 'pepsi',
    })
  })
})

describe('matchQuestion: everything else', () => {
  it('recognizes greetings and thanks', () => {
    expect(ask('السلام عليكم')).toEqual({ topic: 'greeting' })
    expect(ask('Hello!')).toEqual({ topic: 'greeting' })
    expect(ask('شكراً جزيلاً')).toEqual({ topic: 'thanks' })
    expect(ask('Thanks a lot')).toEqual({ topic: 'thanks' })
  })

  it('does not find "hi" inside another word', () => {
    expect(ask('this')).toEqual({ topic: 'unknown' })
  })

  it('answers "unknown" when nothing matches, and for empty or one-letter text', () => {
    expect(ask('qwerty')).toEqual({ topic: 'unknown' })
    expect(ask('')).toEqual({ topic: 'unknown' })
    expect(ask('؟؟')).toEqual({ topic: 'unknown' })
    expect(ask('ب')).toEqual({ topic: 'unknown' })
  })
})

describe('findProducts', () => {
  const ids = (found) => found.map((product) => product.id)

  it('searches with all the words together first', () => {
    expect(ids(findProducts('arabic coffee', products))).toEqual(['coffee'])
  })

  it('then with each word on its own, in the order of the product list', () => {
    expect(ids(findProducts('خبز حليب', products))).toEqual(['milk', 'bread'])
  })

  it('finds nothing for an empty or one-letter search', () => {
    expect(findProducts('', products)).toEqual([])
    expect(findProducts('ب', products)).toEqual([])
  })
})
