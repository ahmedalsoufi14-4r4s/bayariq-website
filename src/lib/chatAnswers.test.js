import { describe, expect, it } from 'vitest'
import realStore from '../data/store.json'
import ar from '../i18n/ar.json'
import en from '../i18n/en.json'
import { buildAnswer, getQuestionLabel, MAX_PRODUCTS } from './chatAnswers.js'
import { TOPICS } from './chatQuestions.js'
import { formatDate } from './offers.js'
import { fillIn } from './text.js'

// A branch whose details are all still NEEDS-AHMED, like the real branches today.
const comingSoonBranch = {
  id: 'north',
  district_ar: 'الشمال',
  district_en: 'North',
  phone: 'NEEDS-AHMED',
  whatsapp: 'NEEDS-AHMED',
  hours: 'NEEDS-AHMED',
  address_ar: 'NEEDS-AHMED',
  address_en: 'NEEDS-AHMED',
  mapsUrl: 'NEEDS-AHMED',
  delivers: 'NEEDS-AHMED',
  delivery_ar: 'NEEDS-AHMED',
  delivery_en: 'NEEDS-AHMED',
}

// A branch with every detail filled in. The numbers are made up for this test only.
const filledBranch = {
  id: 'south',
  district_ar: 'الجنوب',
  district_en: 'South',
  phone: '+966120000000',
  whatsapp: '966500000000',
  hours: [
    {
      days_ar: 'السبت إلى الخميس',
      days_en: 'Saturday to Thursday',
      time_ar: '7 ص – 11 م',
      time_en: '7 am – 11 pm',
    },
  ],
  address_ar: 'شارع التجربة',
  address_en: 'Test Street',
  mapsUrl: 'https://maps.example.com/south',
  delivers: true,
  delivery_ar: 'داخل الحي فقط',
  delivery_en: 'Within the district only',
}

const store = { branches: [comingSoonBranch, filledBranch] }

// One milk, and more juices than one answer shows.
const products = [
  { id: 'milk', name_ar: 'حليب طازج', name_en: 'Fresh milk', price: null },
  ...Array.from({ length: MAX_PRODUCTS + 1 }, (_, index) => ({
    id: `juice-${index}`,
    name_ar: `عصير ${index}`,
    name_en: `Juice ${index}`,
    price: null,
  })),
]

const offers = [
  {
    id: 'late',
    title_ar: 'عرض الشتاء',
    title_en: 'Winter offer',
    validUntil: '2026-12-31',
  },
  {
    id: 'ended',
    title_ar: 'عرض انتهى',
    title_en: 'Ended offer',
    validUntil: '2026-01-01',
  },
  {
    id: 'soon',
    title_ar: 'عرض الأسبوع',
    title_en: 'Week offer',
    validUntil: '2026-11-10',
  },
]

// 5 November 2026: the "ended" offer is over, the other two are not.
const now = new Date(2026, 10, 5)

function context(language = 'ar', changes = {}) {
  const t = language === 'ar' ? ar : en
  return { store, offers, products, t, language, now, ...changes }
}

function answer(question, language, changes) {
  return buildAnswer(question, context(language, changes))
}

function branchLabel(branch, language = 'ar') {
  const t = language === 'ar' ? ar : en
  return fillIn(t.contact.branch, { district: branch[`district_${language}`] })
}

const MORE_QUESTIONS = [{ topic: 'menu' }]

describe('buildAnswer: questions about one branch', () => {
  it.each(['hours', 'delivery', 'contact'])(
    '%s without a branch asks which one, with one chip per branch',
    (topic) => {
      expect(answer({ topic })).toEqual({
        text: ar.chat.whichBranch,
        chips: [
          { topic, branchId: 'north' },
          { topic, branchId: 'south' },
        ],
      })
    },
  )

  it('says how many branches there are before asking which location', () => {
    expect(answer({ topic: 'branches' }).text).toBe(
      fillIn(ar.chat.branchList, { count: 2 }),
    )
  })

  it('asks again when the branch id is not in store.json', () => {
    expect(answer({ topic: 'hours', branchId: 'nowhere' }).text).toBe(
      ar.chat.whichBranch,
    )
  })
})

describe('buildAnswer: details that are still missing', () => {
  const north = branchLabel(comingSoonBranch)

  it.each([
    ['hours', 'hoursComingSoon'],
    ['branches', 'addressComingSoon'],
    ['delivery', 'deliveryComingSoon'],
    ['contact', 'contactComingSoon'],
  ])(
    '%s says politely that it is coming soon, with no buttons',
    (topic, key) => {
      const result = answer({ topic, branchId: 'north' })
      expect(result.text).toBe(fillIn(ar.chat[key], { branch: north }))
      expect(result.links ?? []).toEqual([])
      expect(result.list).toBeUndefined()
      expect(result.chips).toEqual(MORE_QUESTIONS)
    },
  )

  it('treats empty or absent details like NEEDS-AHMED', () => {
    const bare = {
      id: 'bare',
      district_ar: 'الوسط',
      district_en: 'Center',
      hours: [],
      phone: '',
      whatsapp: null,
    }
    const name = branchLabel(bare)
    const changes = { store: { branches: [bare] } }
    const ask = (topic) => answer({ topic, branchId: 'bare' }, 'ar', changes)

    expect(ask('hours').text).toBe(
      fillIn(ar.chat.hoursComingSoon, { branch: name }),
    )
    expect(ask('branches').text).toBe(
      fillIn(ar.chat.addressComingSoon, { branch: name }),
    )
    expect(ask('delivery').text).toBe(
      fillIn(ar.chat.deliveryComingSoon, { branch: name }),
    )
    expect(ask('contact')).toEqual({
      text: fillIn(ar.chat.contactComingSoon, { branch: name }),
      chips: MORE_QUESTIONS,
    })
  })

  it('never shows NEEDS-AHMED for any question about the real branches, in both languages', () => {
    for (const language of ['ar', 'en']) {
      for (const topic of [
        ...TOPICS,
        'products',
        'greeting',
        'menu',
        'thanks',
        'unknown',
      ]) {
        for (const branch of [undefined, ...realStore.branches]) {
          const question = { topic, branchId: branch?.id, query: 'حليب' }
          const result = answer(question, language, { store: realStore })
          expect(JSON.stringify(result)).not.toContain('NEEDS-AHMED')
        }
      }
    }
  })
})

describe('buildAnswer: details that are filled in', () => {
  const south = branchLabel(filledBranch)
  const whatsApp = {
    type: 'whatsapp',
    href: 'https://wa.me/966500000000',
    label: fillIn(ar.chat.messageBranch, { branch: south }),
  }

  it('lists the opening hours, with a button to message the branch', () => {
    expect(answer({ topic: 'hours', branchId: 'south' })).toEqual({
      text: fillIn(ar.chat.hours, { branch: south }),
      list: ['السبت إلى الخميس: 7 ص – 11 م'],
      links: [whatsApp],
      chips: MORE_QUESTIONS,
    })
  })

  it('gives the address with Google Maps and WhatsApp buttons', () => {
    expect(answer({ topic: 'branches', branchId: 'south' })).toEqual({
      text: fillIn(ar.chat.address, { branch: south, address: 'شارع التجربة' }),
      links: [
        {
          type: 'map',
          href: 'https://maps.example.com/south',
          label: ar.contact.openInMaps,
        },
        whatsApp,
      ],
      chips: MORE_QUESTIONS,
    })
  })

  it('says the branch delivers, with its delivery details', () => {
    expect(answer({ topic: 'delivery', branchId: 'south' })).toMatchObject({
      text: fillIn(ar.chat.delivers, { branch: south }),
      note: 'داخل الحي فقط',
      links: [whatsApp],
    })
  })

  it('says when a branch does not deliver, and that pickup works', () => {
    const changes = {
      store: { branches: [{ ...filledBranch, delivers: false }] },
    }
    expect(
      answer({ topic: 'delivery', branchId: 'south' }, 'ar', changes).text,
    ).toBe(fillIn(ar.chat.noDelivery, { branch: south }))
  })

  it('gives the phone number, kept left to right, and buttons to message and call', () => {
    const result = answer({ topic: 'contact', branchId: 'south' })
    expect(result.text).toBe(fillIn(ar.chat.contact, { branch: south }))
    expect(result.list).toEqual([
      fillIn(ar.chat.phone, { phone: '⁦+966120000000⁩' }),
    ])
    expect(result.links).toEqual([
      whatsApp,
      {
        type: 'call',
        href: 'tel:+966120000000',
        label: fillIn(ar.chat.callBranch, { branch: south }),
      },
    ])
  })

  it('answers in English when the site is in English', () => {
    expect(answer({ topic: 'hours', branchId: 'south' }, 'en')).toMatchObject({
      text: fillIn(en.chat.hours, { branch: branchLabel(filledBranch, 'en') }),
      list: ['Saturday to Thursday: 7 am – 11 pm'],
    })
  })
})

describe('buildAnswer: questions about the whole store', () => {
  it('explains how to order, with an "Open the cart" button', () => {
    const result = answer({ topic: 'order' })
    expect(result.text).toBe(ar.chat.orderIntro)
    expect(result.steps).toHaveLength(ar.chat.orderSteps.length)
    expect(result.steps.at(-1)).toContain(ar.order.send)
    expect(result.showCart).toBe(true)
    // The south branch takes WhatsApp orders, so there is no "coming soon" note.
    expect(result.note).toBeUndefined()
  })

  it('adds a "coming soon" note while no branch has a WhatsApp number', () => {
    const changes = { store: { branches: [comingSoonBranch] } }
    expect(answer({ topic: 'order' }, 'ar', changes).note).toBe(
      ar.order.whatsappComingSoon,
    )
  })

  it('lists only the offers that have not ended, soonest ending first', () => {
    expect(answer({ topic: 'offers' }).list).toEqual([
      fillIn(ar.chat.offerLine, {
        title: 'عرض الأسبوع',
        date: formatDate('2026-11-10', ar.dateLocale),
      }),
      fillIn(ar.chat.offerLine, {
        title: 'عرض الشتاء',
        date: formatDate('2026-12-31', ar.dateLocale),
      }),
    ])
  })

  it('says there are no offers when none is running', () => {
    expect(answer({ topic: 'offers' }, 'ar', { offers: [] })).toEqual({
      text: ar.chat.noOffers,
      chips: MORE_QUESTIONS,
    })
  })

  it('shows the products found, at most MAX_PRODUCTS, with a note when there are more', () => {
    expect(answer({ topic: 'products', query: 'حليب' }).products).toEqual([
      products[0],
    ])

    const juices = answer({ topic: 'products', query: 'عصير' })
    expect(juices.text).toBe(ar.chat.products)
    expect(juices.products).toHaveLength(MAX_PRODUCTS)
    expect(juices.note).toBe(ar.chat.moreProducts)
  })

  it('points to the cart box for a product that is not on the list', () => {
    expect(answer({ topic: 'products', query: 'بيبسي' })).toEqual({
      text: fillIn(ar.chat.noProducts, { extraItems: ar.order.extraItems }),
      showCart: true,
      chips: MORE_QUESTIONS,
    })
  })
})

describe('buildAnswer: greetings and short replies', () => {
  it.each(['greeting', 'menu', 'thanks', 'unknown'])(
    '%s shows one chip per topic',
    (topic) => {
      expect(answer({ topic })).toEqual({
        text: ar.chat[topic],
        chips: TOPICS.map((item) => ({ topic: item })),
      })
    },
  )

  it('treats a topic it does not know as not understood', () => {
    expect(answer({ topic: 'weather' }).text).toBe(ar.chat.unknown)
  })
})

describe('getQuestionLabel', () => {
  it('names the branch on a branch chip, and the topic on the others', () => {
    expect(
      getQuestionLabel({ topic: 'hours', branchId: 'north' }, context()),
    ).toBe(branchLabel(comingSoonBranch))
    expect(getQuestionLabel({ topic: 'delivery' }, context())).toBe(
      ar.chat.topics.delivery,
    )
    expect(getQuestionLabel({ topic: 'menu' }, context())).toBe(
      ar.chat.moreQuestions,
    )
    expect(getQuestionLabel({ topic: 'offers' }, context('en'))).toBe(
      en.chat.topics.offers,
    )
  })

  it('has a label in both languages for every topic', () => {
    for (const t of [ar, en]) {
      for (const topic of TOPICS) expect(t.chat.topics[topic]).toBeTruthy()
    }
  })
})
