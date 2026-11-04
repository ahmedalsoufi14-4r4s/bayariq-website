import { expect, test } from '@playwright/test'
import { categories, products, texts } from './helpers.js'

const t = texts.ar

function productCards(page) {
  return page.locator('#products').getByRole('article')
}

function searchBox(page) {
  return page.getByRole('searchbox', { name: t.products.searchLabel })
}

test('shows every product with its price or "price on request"', async ({
  page,
}) => {
  await page.goto('./')

  await expect(productCards(page)).toHaveCount(products.length)
  const unpricedCount = products.filter((p) => p.price === null).length
  await expect(
    page.locator('#products').getByText(t.products.priceOnRequest),
  ).toHaveCount(unpricedCount)
})

test('a category button shows only the products of that category', async ({
  page,
}) => {
  await page.goto('./')
  const filter = page.getByRole('group', { name: t.products.categoriesLabel })
  const category = categories[0]
  const button = filter.getByRole('button', { name: category.name_ar })

  await button.click()
  await expect(button).toHaveAttribute('aria-pressed', 'true')
  await expect(productCards(page)).toHaveCount(
    products.filter((p) => p.category === category.id).length,
  )

  await filter.getByRole('button', { name: t.products.all }).click()
  await expect(productCards(page)).toHaveCount(products.length)
})

test('search ignores Arabic letter variants and diacritics', async ({
  page,
}) => {
  // Pick a product whose Arabic name has أ إ آ ة or ى, then type it the plain way.
  const product = products.find((p) => /[أإآةى]/.test(p.name_ar))
  test.skip(!product, 'no Arabic product name with letter variants')
  const plainName = product.name_ar
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
  const nameWithFatha = product.name_ar[0] + 'َ' + product.name_ar.slice(1)
  const title = page
    .locator('#products')
    .getByRole('heading', { name: product.name_ar, exact: true })

  await page.goto('./')

  await searchBox(page).fill(plainName)
  await expect(title).toBeVisible()

  await searchBox(page).fill(nameWithFatha)
  await expect(title).toBeVisible()
})

test('a search with no match shows a message', async ({ page }) => {
  await page.goto('./')

  await searchBox(page).fill('zzzz')
  await expect(productCards(page)).toHaveCount(0)
  await expect(page.getByText(t.products.noResults)).toBeVisible()
})

test('product details open in a dialog that closes with the button, Escape and the backdrop', async ({
  page,
}) => {
  await page.goto('./')
  const product = products[0]
  const openButton = page
    .locator('#products')
    .getByRole('button', { name: product.name_ar, exact: true })
  const dialog = page.getByRole('dialog', { name: product.name_ar })

  await openButton.click()
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(product.unit_ar)).toBeVisible()
  await dialog.getByRole('button', { name: t.products.close }).click()
  await expect(dialog).toBeHidden()
  await expect(openButton).toBeFocused()

  await openButton.click()
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  await openButton.click()
  await expect(dialog).toBeVisible()
  await page.mouse.click(5, 5)
  await expect(dialog).toBeHidden()
})
