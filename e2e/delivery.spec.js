import { formatFees, getLocationUrl, getMaxKm } from '../src/lib/delivery.js'
import { formatPrice } from '../src/lib/price.js'
import { fillIn } from '../src/lib/text.js'
import {
  findLowContrastText,
  openSite,
  products,
  store,
  texts,
} from './helpers.js'
import { expect, test } from './test.js'

const t = texts.ar
const d = t.order.delivery
const { delivery } = store
const [branch, otherBranch] = store.branches
const price = (amount) => formatPrice(amount, t.currency)

// A featured product with a whole price, and how many of it make an order of at least `amount`.
const product = products.find((item) => item.price === 20)

// About `km` north of a branch: one degree of latitude is about 111.2 km.
function kmNorthOf({ latitude, longitude }, km) {
  return { latitude: latitude + km / 111.195, longitude }
}

function label(item) {
  return fillIn(t.contact.branch, { district: item.district_ar })
}

// Opens the cart with `total` SAR of products in it, with a branch chosen.
async function openOrder(page, total, chosen = branch) {
  await page.addInitScript(
    (items) =>
      localStorage.setItem(
        'bayariq-cart',
        JSON.stringify({ items, extraItems: '' }),
      ),
    [{ product, quantity: total / product.price }],
  )
  await openSite(page, 'ar')
  await page.getByRole('button', { name: t.cart.open }).click()
  const drawer = page.getByRole('dialog', { name: t.cart.title })
  await drawer.getByRole('radio', { name: label(chosen), exact: true }).check()
  return drawer
}

function deliveryChoice(drawer) {
  return drawer.getByRole('radio', { name: t.order.message.delivery })
}

function locationButton(drawer) {
  return drawer.getByRole('button', { name: d.useLocation })
}

function sendButton(drawer) {
  return drawer.getByRole('button', { name: t.order.send })
}

// Fills in the name and the district, sends the order, and gives the WhatsApp address it opened.
async function send(drawer, context) {
  await context.route('https://wa.me/**', (route) =>
    route.fulfill({ body: 'WhatsApp' }),
  )
  await drawer.getByLabel(t.order.name, { exact: true }).fill('أحمد')
  await drawer.getByLabel(t.order.district, { exact: true }).fill('المحاميد')
  const whatsAppPage = context.waitForEvent('page')
  await sendButton(drawer).click()
  const popup = await whatsAppPage
  await popup.waitForURL(/wa\.me/)
  return new URL(popup.url())
}

test('below 50 SAR delivery is off, with what is missing; from 50 SAR it can be chosen', async ({
  page,
}) => {
  const drawer = await openOrder(page, 40)
  await expect(deliveryChoice(drawer)).toBeDisabled()
  const hint = drawer.getByText(
    fillIn(d.minimum, { minimum: price(50), missing: price(10) }),
  )
  await expect(hint).toBeVisible()
  // The hint never relies on color alone, and belongs to the disabled choice.
  await expect(hint.locator('svg')).toHaveCount(1)
  await expect(deliveryChoice(drawer)).toHaveAccessibleDescription(/50/)

  // One more product reaches 60 SAR.
  await drawer
    .getByRole('button', { name: `${t.cart.increase} ${product.name}` })
    .click()
  await expect(hint).toHaveCount(0)
  await deliveryChoice(drawer).check()
  await expect(deliveryChoice(drawer)).toBeChecked()

  // Taking it out again turns the order back into a pickup.
  await drawer
    .getByRole('button', { name: `${t.cart.decrease} ${product.name}` })
    .click()
  await expect(deliveryChoice(drawer)).toBeDisabled()
  await expect(
    drawer.getByRole('radio', { name: t.order.message.pickup }),
  ).toBeChecked()
})

test('without a location the fee is "5 or 10 SAR", and the message leaves it to the branch', async ({
  page,
  context,
}) => {
  const drawer = await openOrder(page, 60)
  await deliveryChoice(drawer).check()

  const fees = formatFees(delivery, 'ar', t.currency)
  expect(fees).toBe('5 أو 10 ر.س')
  await expect(drawer.getByText(fillIn(d.feeUnknown, { fees }))).toBeVisible()
  await expect(
    drawer.getByText(fillIn(d.addForFree, { missing: price(140) })),
  ).toBeVisible()
  for (const row of delivery.hours) {
    await expect(
      drawer.getByText(`${row.days_ar}: ${row.time_ar}`),
    ).toBeVisible()
  }

  const url = await send(drawer, context)
  const message = url.searchParams.get('text')
  expect(url.pathname).toBe(`/${branch.whatsapp}`)
  expect(message).toContain(
    `${t.order.message.deliveryFee} ${fillIn(t.order.message.feeToConfirm, { fees })}`,
  )
  expect(message).not.toContain('google.com')
})

test('from 200 SAR delivery is free', async ({ page, context }) => {
  const drawer = await openOrder(page, 200)
  await deliveryChoice(drawer).check()
  await expect(
    drawer.getByText(fillIn(d.freeWithinArea, { km: getMaxKm(delivery) })),
  ).toBeVisible()

  const message = (await send(drawer, context)).searchParams.get('text')
  expect(message).toContain(
    `${t.order.message.deliveryFee} ${t.order.message.freeDelivery}`,
  )
})

for (const [name, km, fee] of [
  ['up to 3 km', 2, 5],
  ['3 to 5 km', 4, 10],
]) {
  test.describe(`with a location ${name} from the branch`, () => {
    const place = kmNorthOf(branch, km)
    test.use({ geolocation: place, permissions: ['geolocation'] })

    test(`the fee is ${fee} SAR, and the message has it, the new total and the map link`, async ({
      page,
      context,
    }) => {
      // Everything the page sends while the location is used: it must never leave the page.
      const requests = []
      context.on('request', (request) => requests.push(request))

      const drawer = await openOrder(page, 60)
      await deliveryChoice(drawer).check()
      await locationButton(drawer).click()
      await expect(
        drawer.getByText(fillIn(d.fee, { distance: km, fee: price(fee) })),
      ).toBeVisible()
      await expect(drawer.getByText(d.located)).toBeVisible()
      await expect(drawer.getByText(d.privacy)).toBeVisible()

      const coordinates = place.latitude.toFixed(4)
      expect(
        requests.filter((request) =>
          `${request.url()} ${request.postData() ?? ''}`.includes(coordinates),
        ),
      ).toEqual([])
      expect(
        await page.evaluate(() =>
          JSON.stringify([{ ...localStorage }, { ...sessionStorage }]),
        ),
      ).not.toContain(coordinates)

      const message = (await send(drawer, context)).searchParams.get('text')
      expect(message).toContain(`${t.order.message.deliveryFee} ${price(fee)}`)
      expect(message).toContain(
        `${t.order.message.totalWithDelivery} ${price(60 + fee)}`,
      )
      expect(message).toContain(
        `${t.order.message.location} ${getLocationUrl(place)}`,
      )
    })
  })
}

test.describe('with a location near the branch', () => {
  test.use({
    geolocation: kmNorthOf(branch, 1),
    permissions: ['geolocation'],
  })

  test('an order from 200 SAR is delivered for free', async ({ page }) => {
    const drawer = await openOrder(page, 220)
    await deliveryChoice(drawer).check()
    await locationButton(drawer).click()
    await expect(drawer.getByText(d.free, { exact: true })).toBeVisible()
  })

  test('the location can be removed again, and is not sent for a pickup', async ({
    page,
    context,
  }) => {
    const drawer = await openOrder(page, 60)
    await deliveryChoice(drawer).check()
    await locationButton(drawer).click()
    await drawer.getByRole('button', { name: d.forgetLocation }).click()
    await expect(locationButton(drawer)).toBeVisible()
    await expect(drawer.getByText(d.located)).toHaveCount(0)

    await locationButton(drawer).click()
    await expect(drawer.getByText(d.located)).toBeVisible()
    await drawer.getByRole('radio', { name: t.order.message.pickup }).check()
    const message = (await send(drawer, context)).searchParams.get('text')
    expect(message).not.toContain('google.com')
  })
})

test.describe('with a location near another branch', () => {
  test.use({
    geolocation: kmNorthOf(otherBranch, 1),
    permissions: ['geolocation'],
  })

  test('the form says it is too far, suggests the nearest branch that delivers, and switches to it', async ({
    page,
  }) => {
    const drawer = await openOrder(page, 60)
    await deliveryChoice(drawer).check()
    await locationButton(drawer).click()

    const outside = drawer.getByText(/خارج نطاق التوصيل \(5 كم\)/)
    await expect(outside).toBeVisible()
    await expect(
      drawer.getByText(fillIn(d.nearest, { branch: label(otherBranch) })),
    ).toBeVisible()
    await expect(sendButton(drawer)).toBeDisabled()
    await expect(drawer.getByText(t.order.outsideAreaHint)).toBeVisible()

    await drawer
      .getByRole('button', {
        name: fillIn(d.chooseBranch, { branch: label(otherBranch) }),
      })
      .click()
    await expect(
      drawer.getByRole('radio', { name: label(otherBranch), exact: true }),
    ).toBeChecked()
    await expect(outside).toHaveCount(0)
    await expect(
      drawer.getByText(fillIn(d.fee, { distance: 1, fee: price(5) })),
    ).toBeVisible()
    await expect(sendButton(drawer)).toBeEnabled()
  })
})

test.describe('with a location far from every branch', () => {
  test.use({
    // Riyadh.
    geolocation: { latitude: 24.7136, longitude: 46.6753 },
    permissions: ['geolocation'],
  })

  test('the form says no branch delivers there, and offers pickup', async ({
    page,
  }) => {
    const drawer = await openOrder(page, 60)
    await deliveryChoice(drawer).check()
    await locationButton(drawer).click()
    await expect(drawer.getByText(d.noneNearby)).toBeVisible()
    await expect(sendButton(drawer)).toBeDisabled()

    await drawer.getByRole('button', { name: d.choosePickup }).click()
    await expect(
      drawer.getByRole('radio', { name: t.order.message.pickup }),
    ).toBeChecked()
    await expect(sendButton(drawer)).toBeEnabled()
  })
})

test('when the location is refused, the order can go on without it', async ({
  page,
}) => {
  // No permission is given, so the browser refuses.
  const drawer = await openOrder(page, 60)
  await deliveryChoice(drawer).check()
  await locationButton(drawer).click()
  await expect(drawer.getByText(d.locationFailed)).toBeVisible()
  await expect(sendButton(drawer)).toBeEnabled()
})

for (const theme of ['light', 'dark']) {
  test.describe(`${theme} mode`, () => {
    test.use({ colorScheme: theme })

    test('the delivery box fits at 360px, passes AA contrast, and its buttons are 44px', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 360, height: 800 })
      const drawer = await openOrder(page, 60)
      await deliveryChoice(drawer).check()
      // Wait until the colors have stopped fading (the send button has just turned on).
      await expect
        .poll(() =>
          drawer.evaluate(
            (element) => element.getAnimations({ subtree: true }).length,
          ),
        )
        .toBe(0)
      expect(await findLowContrastText(page)).toEqual([])

      const box = await locationButton(drawer).boundingBox()
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(
        await drawer.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true)
      await drawer
        .getByText(d.privacy)
        .evaluate((text) => text.scrollIntoView({ block: 'end' }))
      await page.screenshot({
        path: `screenshots/delivery-ar-360-${theme}.png`,
      })
    })
  })
}
