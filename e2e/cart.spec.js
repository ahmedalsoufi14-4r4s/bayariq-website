import { formatPrice } from '../src/lib/price.js'
import { fillIn } from '../src/lib/text.js'
import { openSite, products, store, texts } from './helpers.js'
import { expect, test } from './test.js'

const t = texts.ar
const [first, second] = products

function addButton(page, product) {
  return page
    .locator('#products')
    .getByRole('button', { name: `${t.cart.add}: ${product.name}` })
}

function branchLabel(branch) {
  return fillIn(t.contact.branch, { district: branch.district_ar })
}

function cartButton(page) {
  return page.getByRole('button', { name: t.cart.open })
}

function cartDrawer(page) {
  return page.getByRole('dialog', { name: t.cart.title })
}

test('adding products updates the cart count, is announced, and survives a reload', async ({
  page,
}) => {
  await page.goto('./')

  await addButton(page, first).click()
  await addButton(page, first).click()
  await addButton(page, second).click()
  await expect(cartButton(page)).toHaveAccessibleName(`${t.cart.open} 3`)
  await expect(page.getByRole('status')).toHaveText(
    `${t.cart.added} ${second.name} (1)`,
  )

  await page.reload()
  await expect(cartButton(page)).toHaveAccessibleName(`${t.cart.open} 3`)
})

test('the drawer changes quantities, removes products and remembers the note for unlisted items', async ({
  page,
}) => {
  await page.goto('./')
  await addButton(page, first).click()
  await cartButton(page).click()
  const drawer = cartDrawer(page)
  await expect(drawer.getByText(first.name, { exact: true })).toBeVisible()

  await drawer
    .getByRole('button', { name: `${t.cart.increase} ${first.name}` })
    .click()
  await expect(drawer.getByRole('status')).toHaveText(
    `${t.cart.quantityChanged} ${first.name} (2)`,
  )

  await drawer
    .getByRole('button', { name: `${t.cart.decrease} ${first.name}` })
    .click()
  await expect(drawer.getByRole('status')).toHaveText(
    `${t.cart.quantityChanged} ${first.name} (1)`,
  )

  await drawer
    .getByRole('button', { name: `${t.cart.remove} ${first.name}` })
    .click()
  await expect(drawer.getByText(t.cart.empty)).toBeVisible()

  await drawer.getByLabel(t.order.extraItems).fill('معجون أسنان')
  await page.reload()
  await cartButton(page).click()
  await expect(cartDrawer(page).getByLabel(t.order.extraItems)).toHaveValue(
    'معجون أسنان',
  )
})

test('the drawer closes with its button and with Escape', async ({ page }) => {
  await page.goto('./')
  const drawer = cartDrawer(page)

  await cartButton(page).click()
  await expect(drawer).toBeVisible()
  await drawer.getByRole('button', { name: t.cart.close }).click()
  await expect(drawer).toBeHidden()
  await expect(cartButton(page)).toBeFocused()

  await cartButton(page).click()
  await expect(drawer).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
})

test('the empty cart links back to the products and closes itself', async ({
  page,
}) => {
  await page.goto('./')
  await cartButton(page).click()
  const drawer = cartDrawer(page)
  await expect(drawer.getByText(t.cart.empty)).toBeVisible()

  await drawer.getByRole('link', { name: t.cart.browse }).click()
  await expect(drawer).toBeHidden()
  await expect(page).toHaveURL(/#products$/)
  await expect(
    page.getByRole('heading', { name: t.products.title }),
  ).toBeInViewport()
})

test('a cart saved days ago shows the prices of today, without products that are gone', async ({
  page,
}) => {
  await page.addInitScript(
    (items) =>
      localStorage.setItem(
        'bayariq-cart',
        JSON.stringify({ items, extraItems: '' }),
      ),
    [
      { product: { ...first, price: 1 }, quantity: 2 },
      {
        product: { ...first, id: 'gone', name: 'منتج قديم', price: 1 },
        quantity: 1,
      },
    ],
  )
  await page.goto('./')
  await cartButton(page).click()
  const drawer = cartDrawer(page)

  await expect(drawer.getByText(t.cart.total).locator('..')).toContainText(
    formatPrice(first.price * 2, t.currency),
  )
  await expect(drawer.getByText('منتج قديم')).toHaveCount(0)
  await expect(cartButton(page)).toHaveAccessibleName(`${t.cart.open} 2`)
})

test('a cart saved by the first version of the site starts empty instead of breaking the page', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'bayariq-cart',
      JSON.stringify({ items: { 'fresh-milk': 2 }, extraItems: 'مناديل' }),
    ),
  )
  await page.goto('./')
  await expect(cartButton(page)).toHaveAccessibleName(`${t.cart.open} 0`)
  await cartButton(page).click()
  await expect(cartDrawer(page).getByLabel(t.order.extraItems)).toHaveValue(
    'مناديل',
  )
})

for (const language of ['ar', 'en']) {
  for (const branch of store.branches) {
    test(`"send order" opens the WhatsApp of ${branch.id} with the order (${language})`, async ({
      page,
      context,
    }) => {
      const text = texts[language]
      const label = fillIn(text.contact.branch, {
        district: branch[`district_${language}`],
      })
      // Answer wa.me locally so the test never leaves the machine.
      await context.route('https://wa.me/**', (route) =>
        route.fulfill({ body: 'WhatsApp' }),
      )
      await openSite(page, language)
      await page
        .locator('#products')
        .getByRole('button', { name: `${text.cart.add}: ${first.name}` })
        .click()
      await page.getByRole('button', { name: text.cart.open }).click()
      const drawer = page.getByRole('dialog', { name: text.cart.title })
      const send = drawer.getByRole('button', { name: text.order.send })
      await drawer.getByLabel(text.order.name, { exact: true }).fill('أحمد')

      await expect(send).toBeDisabled()
      await expect(drawer.getByText(text.order.chooseBranch)).toBeVisible()

      await drawer.getByRole('radio', { name: label, exact: true }).check()
      const whatsAppPage = context.waitForEvent('page')
      await send.click()
      const popup = await whatsAppPage
      await popup.waitForURL(/wa\.me/)

      const url = new URL(popup.url())
      const message = url.searchParams.get('text')
      expect(url.pathname).toBe(`/${branch.whatsapp}`)
      expect(message).toContain(first.name)
      expect(message).toContain(formatPrice(first.price, text.currency))
      expect(message).toContain('أحمد')
      expect(message).toContain(label)
      expect(message).toContain(text.order.message.pickup)
    })
  }
}

test('the order form lists the three branches, and asks for something to order first', async ({
  page,
}) => {
  await page.goto('./')
  await cartButton(page).click()
  const drawer = cartDrawer(page)
  const branches = drawer.getByRole('group', { name: t.order.branch })

  await expect(branches.getByRole('radio')).toHaveCount(3)
  for (const branch of store.branches) {
    await expect(
      branches.getByRole('radio', { name: branchLabel(branch), exact: true }),
    ).toHaveAttribute('required')
  }
  await expect(
    drawer.getByRole('button', { name: t.order.send }),
  ).toBeDisabled()
  await expect(drawer.getByText(t.order.emptyHint)).toBeVisible()
})

test('at 360px the cart button fits on the first header row', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('./')

  const logo = page
    .locator('header')
    .getByRole('link', { name: store.name_ar, exact: true })
  const logoBox = await logo.boundingBox()
  const cartBox = await cartButton(page).boundingBox()
  const logoMiddle = logoBox.y + logoBox.height / 2
  const cartMiddle = cartBox.y + cartBox.height / 2
  expect(Math.abs(logoMiddle - cartMiddle)).toBeLessThan(10)
})
