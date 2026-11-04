import { expect, test } from '@playwright/test'
import { takesWhatsAppOrders } from '../src/lib/branches.js'
import { fillIn } from '../src/lib/text.js'
import { products, store, texts } from './helpers.js'

const t = texts.ar
const [first, second] = products.filter((product) => product.inStock)

function addButton(page, product) {
  return page
    .locator('#products')
    .getByRole('button', { name: `${t.cart.add}: ${product.name_ar}` })
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
    `${t.cart.added} ${second.name_ar} (1)`,
  )

  await page.reload()
  await expect(cartButton(page)).toHaveAccessibleName(`${t.cart.open} 3`)
})

test('out-of-stock products cannot be added', async ({ page }) => {
  const outOfStock = products.find((product) => !product.inStock)
  test.skip(!outOfStock, 'every product is in stock')
  await page.goto('./')

  await expect(addButton(page, outOfStock)).toBeDisabled()
})

test('the drawer changes quantities, removes products and remembers the note for unlisted items', async ({
  page,
}) => {
  await page.goto('./')
  await addButton(page, first).click()
  await cartButton(page).click()
  const drawer = cartDrawer(page)
  await expect(drawer.getByText(first.name_ar, { exact: true })).toBeVisible()

  await drawer
    .getByRole('button', { name: `${t.cart.increase} ${first.name_ar}` })
    .click()
  await expect(drawer.getByRole('status')).toHaveText(
    `${t.cart.quantityChanged} ${first.name_ar} (2)`,
  )

  await drawer
    .getByRole('button', { name: `${t.cart.decrease} ${first.name_ar}` })
    .click()
  await expect(drawer.getByRole('status')).toHaveText(
    `${t.cart.quantityChanged} ${first.name_ar} (1)`,
  )

  await drawer
    .getByRole('button', { name: `${t.cart.remove} ${first.name_ar}` })
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

test('the order form lists every branch, and offers delivery only for branches that deliver', async ({
  page,
}) => {
  await page.goto('./')
  await cartButton(page).click()
  const drawer = cartDrawer(page)
  const branches = drawer.getByRole('group', { name: t.order.branch })
  const delivery = drawer.getByRole('radio', {
    name: t.order.message.delivery,
  })

  await expect(branches.getByRole('radio')).toHaveCount(store.branches.length)
  for (const branch of store.branches) {
    const choice = branches.getByRole('radio', {
      name: branchLabel(branch),
      exact: true,
    })
    await expect(choice).toHaveAttribute('required')
    await choice.check()
    await expect(choice).toBeChecked()

    if (branch.delivers === true) {
      await expect(delivery).toBeVisible()
    } else {
      await expect(delivery).toHaveCount(0)
      await expect(drawer.getByText(t.order.message.pickup)).toBeVisible()
    }
  }
})

test('"send order" stays disabled with a "coming soon" note until there is a WhatsApp number', async ({
  page,
}) => {
  test.skip(
    store.branches.some(takesWhatsAppOrders),
    'a branch in store.json has a WhatsApp number',
  )
  await page.goto('./')
  await addButton(page, first).click()
  await cartButton(page).click()
  const drawer = cartDrawer(page)

  await expect(
    drawer.getByRole('button', { name: t.order.send }),
  ).toBeDisabled()
  await expect(drawer.getByText(t.order.whatsappComingSoon)).toBeVisible()
})

test('"send order" asks for a branch, then opens WhatsApp with the order for that branch', async ({
  page,
  context,
}) => {
  const branch = store.branches.find(takesWhatsAppOrders)
  test.skip(!branch, 'no branch has a WhatsApp number in store.json yet')
  // Answer wa.me locally so the test never leaves the machine.
  await context.route('https://wa.me/**', (route) =>
    route.fulfill({ body: 'WhatsApp' }),
  )
  await page.goto('./')
  await addButton(page, first).click()
  await cartButton(page).click()
  const drawer = cartDrawer(page)
  const send = drawer.getByRole('button', { name: t.order.send })
  await drawer.getByLabel(t.order.name).fill('أحمد')

  await expect(send).toBeDisabled()
  await expect(drawer.getByText(t.order.chooseBranch)).toBeVisible()

  await drawer
    .getByRole('radio', { name: branchLabel(branch), exact: true })
    .check()
  const whatsAppPage = context.waitForEvent('page')
  await send.click()
  const popup = await whatsAppPage
  await popup.waitForURL(/wa\.me/)

  const url = new URL(popup.url())
  const text = url.searchParams.get('text')
  expect(url.pathname).toBe(`/${branch.whatsapp}`)
  expect(text).toContain(first.name_ar)
  expect(text).toContain('أحمد')
  expect(text).toContain(branchLabel(branch))
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
