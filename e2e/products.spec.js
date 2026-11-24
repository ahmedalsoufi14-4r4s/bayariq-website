import { formatPrice } from '../src/lib/price.js'
import {
  catalog,
  categories,
  categoryProducts,
  openSite,
  products,
  texts,
  waitForProducts,
} from './helpers.js'
import { expect, test } from './test.js'

const t = texts.ar
const PAGE_SIZE = 24

function productCards(page) {
  return page.locator('#products').getByRole('article')
}

function cardTitles(page) {
  return page.locator('#products').getByRole('heading', { level: 3 })
}

function searchBox(page, language = 'ar') {
  return page.getByRole('searchbox', {
    name: texts[language].products.searchLabel,
  })
}

function categoryButton(page, category, language = 'ar') {
  return page
    .getByRole('group', { name: texts[language].products.categoriesLabel })
    .getByRole('button', { name: category[`name_${language}`], exact: true })
}

function showMore(page) {
  return page.getByRole('button', { name: t.products.showMore })
}

// The product files the page has asked for so far, like "catalog" and "products/dairy".
function recordDataFiles(page) {
  const files = []
  page.on('request', (request) => {
    const match = request.url().match(/\/data\/(.+)\.json$/)
    if (match) files.push(match[1])
  })
  return files
}

test('the page starts with the 18 featured products, first and in order, with their prices and category icons', async ({
  page,
}) => {
  await page.goto('./')
  expect(products).toHaveLength(18)

  await expect(cardTitles(page)).toHaveText(
    products.map((product) => product.name),
  )
  for (const product of products) {
    const card = productCards(page).filter({
      has: page.getByRole('heading', { name: product.name, exact: true }),
    })
    await expect(card.getByText(t.products.featured)).toBeVisible()
    await expect(
      card.getByText(formatPrice(product.price, t.currency), { exact: true }),
    ).toBeVisible()
    // No photos yet: the icon of the category stands in.
    await expect(card.locator('img')).toHaveCount(0)
    await expect(card.locator('svg').first()).toBeVisible()
  }
  await expect(page.locator('#products')).toContainText(
    `${t.products.results} ${catalog.productCount}`,
  )
})

test('products load one category at a time, and each category only once', async ({
  page,
}) => {
  const files = recordDataFiles(page)
  await page.goto('./')
  await waitForProducts(page)
  // The first screen needs only the small catalog.
  expect(files).toEqual(['catalog'])

  const [first, second] = categories
  await categoryButton(page, first).click()
  await expect(productCards(page)).toHaveCount(PAGE_SIZE)
  expect(files).toEqual(['catalog', `products/${first.id}`])

  await categoryButton(page, second).click()
  await expect(productCards(page)).toHaveCount(PAGE_SIZE)
  await categoryButton(page, first).click()
  await expect(productCards(page)).toHaveCount(PAGE_SIZE)
  expect(files).toEqual([
    'catalog',
    `products/${first.id}`,
    `products/${second.id}`,
  ])
})

test('a category shows its featured products first, its count, and more products on demand', async ({
  page,
}) => {
  await page.goto('./')
  const [category] = categories
  const all = categoryProducts(category.id)
  const featured = products.filter((item) => item.category === category.id)
  expect(featured.length).toBeGreaterThan(1)
  const button = categoryButton(page, category)

  await button.click()
  await expect(button).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('#products')).toContainText(
    `${t.products.results} ${all.length}`,
  )
  await expect(cardTitles(page)).toHaveText(
    all.slice(0, PAGE_SIZE).map((product) => product.name),
  )
  expect(all.slice(0, featured.length).map((product) => product.id)).toEqual(
    featured.map((product) => product.id),
  )

  await showMore(page).click()
  await expect(productCards(page)).toHaveCount(PAGE_SIZE * 2)
})

test('"show more" in all categories goes on with the first category, after the featured products', async ({
  page,
}) => {
  const files = recordDataFiles(page)
  await page.goto('./')
  await waitForProducts(page)
  await showMore(page).click()

  await expect(productCards(page)).toHaveCount(PAGE_SIZE * 2)
  expect(files).toEqual(['catalog', `products/${categories[0].id}`])
  const titles = await cardTitles(page).allTextContents()
  expect(titles.slice(0, products.length)).toEqual(
    products.map((product) => product.name),
  )
})

test('the Attara category holds the spices, nuts, dates and herbs moved into it, in both languages', async ({
  page,
}) => {
  const attara = categories.find((category) => category.id === 'spices')
  expect(attara.name_ar).toBe('عطارة: بهارات ومكسرات وأعشاب')
  expect(attara.name_en).toBe('Attara: Spices, Nuts & Herbs')
  await page.goto('./')
  await categoryButton(page, attara).click()
  await expect(productCards(page)).toHaveCount(PAGE_SIZE)

  // A date, a nut, a spice and a herb that came from other categories.
  for (const query of [
    'تمر سكري القصيم انيسة',
    'كاجو مملح باجة 120',
    'كمون حب روض الاصيل',
    'اكليل الجبل',
  ]) {
    await searchBox(page).fill(query)
    await expect(productCards(page)).not.toHaveCount(0)
  }
  // False matches stay where they were.
  for (const query of ['لوزين', 'ايس كريم', 'شوكولاتة']) {
    await searchBox(page).fill(query)
    await expect(page.getByText(t.products.noResults)).toBeVisible()
  }

  await page.getByRole('button', { name: t.switchLanguage }).click()
  await expect(categoryButton(page, attara, 'en')).toBeVisible()
})

test('a search looks in every category, loading them one after another', async ({
  page,
}) => {
  const files = recordDataFiles(page)
  // How many category files are being loaded at the same moment.
  let loadingNow = 0
  let mostAtOnce = 0
  await page.route('**/data/products/*.json', async (route) => {
    loadingNow += 1
    mostAtOnce = Math.max(mostAtOnce, loadingNow)
    await new Promise((resolve) => setTimeout(resolve, 30))
    loadingNow -= 1
    await route.continue()
  })
  await page.goto('./')
  await waitForProducts(page)

  // A toy, from one of the last categories.
  await searchBox(page).fill('مسدس')
  await expect(page.getByText(t.products.searching)).toBeVisible()
  await expect(productCards(page)).not.toHaveCount(0)
  await expect(page.getByText(t.products.searching)).toHaveCount(0)
  expect(files).toEqual([
    'catalog',
    ...categories.map((category) => `products/${category.id}`),
  ])
  expect(mostAtOnce).toBe(1)

  // A second search finds everything already loaded, and answers right away.
  await searchBox(page).fill('حليب')
  await expect(productCards(page)).toHaveCount(PAGE_SIZE)
  expect(files).toHaveLength(categories.length + 1)
  await expect(cardTitles(page).first()).toHaveText(products[0].name)
})

test('each letter typed in the search shows its results within a moment', async ({
  page,
}) => {
  await page.goto('./')
  await searchBox(page).fill('حليب')
  await expect(page.getByText(t.products.searching)).toHaveCount(0)

  // All 16 thousand products are loaded. The time from typing to the new cards on the page.
  const milliseconds = await searchBox(page).evaluate((input) => {
    const start = performance.now()
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set
    setValue.call(input, 'عصير')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    return new Promise((resolve) =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => resolve(performance.now() - start)),
      ),
    )
  })
  expect(milliseconds).toBeLessThan(500)
  await expect(cardTitles(page).first()).toContainText('عصير')
})

test('search ignores Arabic letter variants and diacritics, and understands common English words', async ({
  page,
}) => {
  await openSite(page, 'en')
  const title = page
    .locator('#products')
    .getByRole('heading', { name: products[0].name, exact: true })

  for (const query of ['حليب المراعى', 'حَليب المراعي طازج', 'Almarai MILK']) {
    await searchBox(page, 'en').fill(query)
    await expect(title).toBeVisible()
  }
})

test('product names stay in Arabic in the English version, and are marked as Arabic', async ({
  page,
}) => {
  await openSite(page, 'en')
  await waitForProducts(page)
  const name = cardTitles(page).first().locator('bdi')

  await expect(name).toHaveText(products[0].name)
  await expect(name).toHaveAttribute('lang', 'ar')
})

test('a search with no match shows a message and a button that brings back every product', async ({
  page,
}) => {
  await page.goto('./')
  await categoryButton(page, categories[0]).click()

  await searchBox(page).fill('zzzz')
  await expect(productCards(page)).toHaveCount(0)
  await expect(page.getByText(t.products.noResults)).toBeVisible()

  await page.getByRole('button', { name: t.products.showAll }).click()
  await expect(cardTitles(page).first()).toHaveText(products[0].name)
  await expect(searchBox(page)).toHaveValue('')
  await expect(
    page
      .getByRole('group', { name: t.products.categoriesLabel })
      .getByRole('button', { name: t.products.all }),
  ).toHaveAttribute('aria-pressed', 'true')
})

test('while a category loads, pulsing boxes show; when it fails, a message with a button that tries again', async ({
  page,
}) => {
  let release
  const held = new Promise((resolve) => (release = resolve))
  let fail = true
  await page.route('**/data/products/*.json', async (route) => {
    await held
    if (fail) await route.abort()
    else await route.continue()
  })
  await page.goto('./')
  await waitForProducts(page)

  await categoryButton(page, categories[0]).click()
  await expect(page.getByText(t.products.loading)).toBeVisible()
  await expect(
    page.locator('#products [class*="animate-pulse"]').first(),
  ).toBeVisible()

  release()
  await expect(page.getByRole('alert')).toContainText(t.products.loadFailed)

  fail = false
  await page.getByRole('button', { name: t.products.tryAgain }).click()
  await expect(productCards(page)).toHaveCount(PAGE_SIZE)
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('when the catalog does not load, a message with a button that tries again shows', async ({
  page,
}) => {
  let fail = true
  await page.route('**/data/catalog.json', (route) =>
    fail ? route.abort() : route.continue(),
  )
  await page.goto('./')
  await expect(page.getByRole('alert')).toContainText(t.products.loadFailed)

  fail = false
  await page.getByRole('button', { name: t.products.tryAgain }).click()
  await expect(productCards(page)).toHaveCount(products.length)
})

test('product details open in a dialog that closes with the button, Escape and the backdrop', async ({
  page,
}) => {
  await page.goto('./')
  const product = products[0]
  const openButton = page
    .locator('#products')
    .getByRole('button', { name: product.name, exact: true })
  const dialog = page.getByRole('dialog', { name: product.name })

  await openButton.click()
  await expect(dialog).toBeVisible()
  await expect(
    dialog.getByText(t.products.units[product.unit], { exact: true }),
  ).toBeVisible()
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
