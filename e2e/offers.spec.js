import { expect, test } from './test.js'
import { offers, texts } from './helpers.js'

const t = texts.ar
const ONE_HOUR = 60 * 60 * 1000

// The browser clock is set to fixed dates below, so these tests pass on any real date.
// The dates are written in Saudi time, so the browser uses the same time zone.
test.use({ timezoneId: 'Asia/Riyadh' })

const offersBySoonestEnd = [...offers].sort((a, b) =>
  a.validUntil.localeCompare(b.validUntil),
)

function offerTitles(page) {
  return page.locator('#offers').getByRole('heading', { level: 3 })
}

test('before any offer ends, every offer shows, soonest ending first', async ({
  page,
}) => {
  test.skip(offers.length === 0, 'offers.json is empty')
  await page.clock.setFixedTime(new Date('2000-01-01T12:00:00+03:00'))
  await page.goto('./')

  await expect(offerTitles(page)).toHaveText(
    offersBySoonestEnd.map((offer) => offer.title_ar),
  )
  await expect(page.locator('#offers time').first()).toHaveAttribute(
    'datetime',
    offersBySoonestEnd[0].validUntil,
  )
})

test('without a running offer, a card says the offers are coming soon', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date('2100-01-01T12:00:00+03:00'))
  await page.goto('./')

  const card = page.locator('#offers .card')
  await expect(card).toHaveCount(1)
  await expect(
    card.getByRole('heading', { name: t.offers.comingSoon, exact: true }),
  ).toBeVisible()
  await expect(card.getByText(t.offers.comingSoonText)).toBeVisible()

  await page.getByRole('button', { name: t.switchLanguage }).click()
  await expect(
    card.getByRole('heading', { name: 'Offers: coming soon', exact: true }),
  ).toBeVisible()
})

test('the footer says the social accounts are coming soon, in both languages', async ({
  page,
}) => {
  await page.goto('./')
  const footer = page.locator('footer')
  await expect(
    footer.getByText('حساباتنا على وسائل التواصل: قريبًا', { exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: t.switchLanguage }).click()
  await expect(
    footer.getByText('Our social accounts: coming soon', { exact: true }),
  ).toBeVisible()
})

test('an offer shows until the end of its last day and hides the next day', async ({
  page,
}) => {
  const offer = offersBySoonestEnd[0]
  test.skip(!offer, 'offers.json is empty')
  const title = page
    .locator('#offers')
    .getByRole('heading', { name: offer.title_ar, exact: true })
  const lastDayLateEvening = new Date(`${offer.validUntil}T23:30:00+03:00`)

  await page.clock.setFixedTime(lastDayLateEvening)
  await page.goto('./')
  await expect(title).toBeVisible()

  await page.clock.setFixedTime(lastDayLateEvening.getTime() + ONE_HOUR)
  await page.reload()
  await expect(title).toBeHidden()
})
