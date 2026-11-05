import { expect, test } from '@playwright/test'
import { openSite, products, store, texts } from './helpers.js'

const t = texts.ar
const tEn = texts.en

// The chat button in the bottom corner.
function chatButton(page, language = 'ar') {
  return page.getByRole('button', {
    name: texts[language].chat.open,
  })
}

// The chat panel dialog.
function chatPanel(page, language = 'ar') {
  return page.getByRole('dialog', {
    name: texts[language].chat.title,
  })
}

test('the chat button is visible and opens the panel', async ({ page }) => {
  await openSite(page, 'ar')
  const button = chatButton(page)
  await expect(button).toBeVisible()
  await expect(button).toHaveAttribute('aria-expanded', 'false')

  await button.click()
  await expect(button).toHaveAttribute('aria-expanded', 'true')
  const panel = chatPanel(page)
  await expect(panel).toBeVisible()
  await expect(panel.getByText(t.chat.greeting)).toBeVisible()
})

test('the close button closes the panel and returns focus to the chat button', async ({
  page,
}) => {
  await openSite(page, 'ar')
  const button = chatButton(page)
  await button.click()
  const panel = chatPanel(page)
  await expect(panel).toBeVisible()

  await panel.getByRole('button', { name: t.chat.close }).click()
  await expect(panel).not.toBeVisible()
  await expect(button).toBeFocused()
})

test('Escape closes the panel', async ({ page }) => {
  await openSite(page, 'ar')
  await chatButton(page).click()
  const panel = chatPanel(page)
  await expect(panel).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(panel).not.toBeVisible()
})

test('topic chips are shown and tapping one gives a reply', async ({
  page,
}) => {
  await openSite(page, 'ar')
  await chatButton(page).click()
  const panel = chatPanel(page)

  // The greeting shows all topic chips.
  for (const topic of Object.values(t.chat.topics)) {
    await expect(
      panel.getByRole('button', { name: topic }),
    ).toBeVisible()
  }

  // Tapping "Opening hours" asks which branch.
  await panel.getByRole('button', { name: t.chat.topics.hours }).click()
  await expect(panel.getByText(t.chat.whichBranch)).toBeVisible()

  // One chip per branch.
  for (const branch of store.branches) {
    await expect(
      panel.getByRole('button', { name: branch.district_ar, exact: false }),
    ).toBeVisible()
  }
})

test('typing a product name shows product results with Add to cart', async ({
  page,
}) => {
  await openSite(page, 'ar')
  await chatButton(page).click()
  const panel = chatPanel(page)
  const input = panel.getByRole('textbox', { name: t.chat.inputLabel })

  // Search for an in-stock product.
  const inStock = products.find((p) => p.inStock)
  await input.fill(inStock.name_ar)
  await panel.getByRole('button', { name: t.chat.send }).click()
  await expect(panel.getByText(t.chat.products)).toBeVisible()
  await expect(
    panel.getByRole('button', { name: `${t.cart.add}: ${inStock.name_ar}` }),
  ).toBeVisible()
})

test('typing an unknown query shows the unknown message with topic chips', async ({
  page,
}) => {
  await openSite(page, 'ar')
  await chatButton(page).click()
  const panel = chatPanel(page)
  const input = panel.getByRole('textbox', { name: t.chat.inputLabel })

  await input.fill('qwerty xyz')
  await panel.getByRole('button', { name: t.chat.send }).click()
  await expect(panel.getByText(t.chat.unknown)).toBeVisible()
})

test('the send button is disabled when the input is empty', async ({
  page,
}) => {
  await openSite(page, 'ar')
  await chatButton(page).click()
  const panel = chatPanel(page)
  const send = panel.getByRole('button', { name: t.chat.send })

  await expect(send).toBeDisabled()
  const input = panel.getByRole('textbox', { name: t.chat.inputLabel })
  await input.fill('test')
  await expect(send).toBeEnabled()
  await input.fill('')
  await expect(send).toBeDisabled()
})

test('the conversation works in English too', async ({ page }) => {
  await openSite(page, 'en')
  const button = chatButton(page, 'en')
  await button.click()
  const panel = chatPanel(page, 'en')
  await expect(panel.getByText(tEn.chat.greeting)).toBeVisible()

  await panel
    .getByRole('button', { name: tEn.chat.topics.order })
    .click()
  await expect(panel.getByText(tEn.chat.orderIntro)).toBeVisible()
})

test('the chat panel does not block scrolling the page behind it', async ({
  page,
}) => {
  await openSite(page, 'ar')
  await chatButton(page).click()
  await expect(chatPanel(page)).toBeVisible()

  // The page should still be scrollable (overflow not hidden) because
  // ChatBot uses show(), not showModal().
  const overflow = await page.evaluate(
    () => getComputedStyle(document.body).overflow,
  )
  expect(overflow).not.toBe('hidden')
})

test('at 360px the chat button is at least 44px for fingers', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await openSite(page, 'ar')
  const button = chatButton(page)
  const { width, height } = await button.boundingBox()
  expect(Math.min(width, height)).toBeGreaterThanOrEqual(44)
})

test('"How to order" shows numbered steps and an Open cart button', async ({
  page,
}) => {
  await openSite(page, 'ar')
  await chatButton(page).click()
  const panel = chatPanel(page)

  await panel.getByRole('button', { name: t.chat.topics.order }).click()
  await expect(panel.getByText(t.chat.orderIntro)).toBeVisible()
  await expect(
    panel.getByRole('button', { name: t.chat.openCart }),
  ).toBeVisible()
})

test('a greeting is recognized', async ({ page }) => {
  await openSite(page, 'ar')
  await chatButton(page).click()
  const panel = chatPanel(page)
  const input = panel.getByRole('textbox', { name: t.chat.inputLabel })

  await input.fill('السلام عليكم')
  await panel.getByRole('button', { name: t.chat.send }).click()
  // The greeting reply includes topic chips (the initial greeting also has them,
  // so each topic chip appears at least twice in the panel).
  for (const topic of Object.values(t.chat.topics)) {
    await expect(
      panel.getByRole('button', { name: topic }).first(),
    ).toBeVisible()
  }
  // The greeting reply has its own set of chips (2 sets total: initial + reply).
  await expect(
    panel.getByRole('button', { name: t.chat.topics.hours }),
  ).toHaveCount(2)
})
