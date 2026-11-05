import { expect, test } from '@playwright/test'
import { buildAnswer } from '../src/lib/chatAnswers.js'
import { BRANCH_TOPICS, TOPICS } from '../src/lib/chatQuestions.js'
import { fillIn } from '../src/lib/text.js'
import {
  offers,
  openSite,
  products,
  store,
  texts,
  tokenColor,
} from './helpers.js'

const t = texts.ar

// The answer the helper should give, from the same pure function the site uses
// (src/lib/chatAnswers.js), so these checks keep passing when the data files change.
// Its content is tested in src/lib/chatAnswers.test.js; here we check the panel shows it.
function expectedAnswer(question, language = 'ar') {
  return buildAnswer(question, {
    store,
    offers,
    products,
    t: texts[language],
    language,
    now: new Date(),
  })
}

function branchLabel(branch, language = 'ar') {
  return fillIn(texts[language].contact.branch, {
    district: branch[`district_${language}`],
  })
}

function chatButton(page, language = 'ar') {
  return page.getByRole('button', { name: texts[language].chat.open })
}

function chatPanel(page, language = 'ar') {
  return page.getByRole('dialog', { name: texts[language].chat.title })
}

function chatLog(page, language = 'ar') {
  return chatPanel(page, language).getByRole('log')
}

// The newest chip with this label: older answers keep their chips.
function chip(page, label, language = 'ar') {
  return chatLog(page, language)
    .getByRole('button', { name: label, exact: true })
    .last()
}

// The chips under the newest answer.
function newestChips(page, language = 'ar') {
  return chatLog(page, language)
    .getByRole('group', { name: texts[language].chat.suggestions })
    .last()
    .getByRole('button')
}

// The visitor's bubble. Its hidden "أنت:" tells screen reader users who is speaking.
function visitorMessage(page, text, language = 'ar') {
  return chatLog(page, language)
    .getByText(`${texts[language].chat.you}: ${text}`, { exact: true })
    .last()
}

function answerText(page, text, language = 'ar') {
  return chatLog(page, language).getByText(text, { exact: true }).last()
}

async function openChat(page, language = 'ar') {
  await chatButton(page, language).click()
  await expect(chatPanel(page, language)).toBeVisible()
}

async function askTyped(page, question, language = 'ar') {
  const panel = chatPanel(page, language)
  const { chat } = texts[language]
  await panel.getByRole('textbox', { name: chat.inputLabel }).fill(question)
  await panel.getByRole('button', { name: chat.send }).click()
}

// True when the element the browser draws on top at the middle of box is inside selector.
function drawnOnTop(page, box, selector) {
  return page.evaluate(
    ({ x, y, selector }) =>
      Boolean(document.elementFromPoint(x, y)?.closest(selector)),
    { x: box.x + box.width / 2, y: box.y + box.height / 2, selector },
  )
}

test('the saffron chat button opens the panel with a greeting and one chip per topic', async ({
  page,
}) => {
  await page.goto('./')
  const button = chatButton(page)
  await expect(button).toHaveCSS(
    'background-color',
    await tokenColor(page, 'accent'),
  )
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await expect(chatPanel(page)).toBeHidden()

  await openChat(page)
  await expect(button).toHaveAttribute('aria-expanded', 'true')
  // Focus moves into the panel, and new messages go into a live log for screen readers.
  await expect(
    chatPanel(page).getByRole('button', { name: t.chat.close }),
  ).toBeFocused()
  await expect(chatLog(page)).toHaveAttribute('aria-relevant', 'additions')
  await expect(answerText(page, t.chat.greeting)).toBeVisible()
  await expect(newestChips(page)).toHaveText(
    TOPICS.map((topic) => t.chat.topics[topic]),
  )
})

test('the panel closes with its close button, with Escape and with the chat button, and focus goes back to the chat button', async ({
  page,
}) => {
  await page.goto('./')
  const button = chatButton(page)
  const panel = chatPanel(page)

  await openChat(page)
  await panel.getByRole('button', { name: t.chat.close }).click()
  await expect(panel).toBeHidden()
  await expect(button).toBeFocused()

  await openChat(page)
  await panel.getByRole('textbox', { name: t.chat.inputLabel }).focus()
  await page.keyboard.press('Escape')
  await expect(panel).toBeHidden()
  await expect(button).toBeFocused()

  await openChat(page)
  await button.click()
  await expect(panel).toBeHidden()
  await expect(button).toHaveAttribute('aria-expanded', 'false')
})

test('each topic chip shows the visitor’s choice and its answer', async ({
  page,
}) => {
  await page.goto('./')
  await openChat(page)

  for (const topic of TOPICS) {
    const label = t.chat.topics[topic]
    await chip(page, label).click()
    await expect(visitorMessage(page, label)).toBeVisible()

    const answer = expectedAnswer({ topic })
    await expect(answerText(page, answer.text)).toBeVisible()
    for (const line of [...(answer.list ?? []), ...(answer.steps ?? [])]) {
      await expect(chatLog(page).getByText(line).last()).toBeVisible()
    }
    if (answer.showCart) {
      await expect(
        chatLog(page).getByRole('button', { name: t.chat.openCart }).last(),
      ).toBeVisible()
    }
    // A branch topic asks which branch; the others end with "other questions".
    const nextChips = BRANCH_TOPICS.includes(topic)
      ? store.branches.map((branch) => branchLabel(branch))
      : [t.chat.moreQuestions]
    await expect(newestChips(page)).toHaveText(nextChips)
  }

  // "Other questions" brings the topic chips back.
  await chip(page, t.chat.moreQuestions).click()
  await expect(answerText(page, t.chat.menu)).toBeVisible()
  await expect(newestChips(page)).toHaveCount(TOPICS.length)
})

for (const topic of BRANCH_TOPICS) {
  test(`the branch picker answers "${topic}" for every branch, with a WhatsApp button only for a real number`, async ({
    page,
  }) => {
    await page.goto('./')
    await openChat(page)

    for (const branch of store.branches) {
      await chip(page, t.chat.topics[topic]).click()
      await expect(newestChips(page)).toHaveText(
        store.branches.map((item) => branchLabel(item)),
      )

      await chip(page, branchLabel(branch)).click()
      await expect(visitorMessage(page, branchLabel(branch))).toBeVisible()
      const answer = expectedAnswer({ topic, branchId: branch.id })
      await expect(answerText(page, answer.text)).toBeVisible()

      for (const link of answer.links ?? []) {
        await expect(
          chatLog(page).getByRole('link', { name: link.label }).last(),
        ).toHaveAttribute('href', link.href)
      }
      const whatsApp = chatLog(page).getByRole('link', {
        name: fillIn(t.chat.messageBranch, { branch: branchLabel(branch) }),
      })
      if (!answer.links?.some((link) => link.type === 'whatsapp')) {
        await expect(whatsApp).toHaveCount(0)
      }
    }
  })
}

test('typed questions are answered in Arabic, and in English after the language switch', async ({
  page,
}) => {
  const [branch, otherBranch] = store.branches
  await openSite(page, 'ar')
  await openChat(page)
  const textbox = chatPanel(page).getByRole('textbox', {
    name: t.chat.inputLabel,
  })

  // A question that names its branch is answered right away, without the picker.
  const question = `متى يفتح فرع ${branch.district_ar}؟`
  await askTyped(page, question)
  await expect(visitorMessage(page, question)).toBeVisible()
  const hours = expectedAnswer({ topic: 'hours', branchId: branch.id })
  await expect(answerText(page, hours.text)).toBeVisible()
  await expect(textbox).toHaveValue('')
  await expect(textbox).toBeFocused()

  // Nothing matches: a kind reply and the topic chips again.
  await askTyped(page, 'qwerty')
  await expect(answerText(page, t.chat.unknown)).toBeVisible()
  await expect(newestChips(page)).toHaveCount(TOPICS.length)

  // In Arabic the panel sits on the left (the end side), in English on the right.
  const arabicBox = await chatPanel(page).boundingBox()
  expect(arabicBox.x).toBeLessThan(100)
  await page.getByRole('button', { name: t.switchLanguage }).click()
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
  await expect(chatPanel(page, 'en')).toBeVisible()
  const englishBox = await chatPanel(page, 'en').boundingBox()
  expect(englishBox.x).toBeGreaterThan(arabicBox.x)

  // Earlier answers follow the switch too.
  const hoursEn = expectedAnswer({ topic: 'hours', branchId: branch.id }, 'en')
  await expect(answerText(page, hoursEn.text, 'en')).toBeVisible()

  await askTyped(page, `Where is the ${otherBranch.district_en} branch?`, 'en')
  const location = expectedAnswer(
    { topic: 'branches', branchId: otherBranch.id },
    'en',
  )
  await expect(answerText(page, location.text, 'en')).toBeVisible()

  await askTyped(page, 'Do you deliver?', 'en')
  await expect(answerText(page, texts.en.chat.whichBranch, 'en')).toBeVisible()
})

test('"do you have X?" shows the product, and its Add to cart button fills the cart', async ({
  page,
}) => {
  const product = products.find((item) => item.inStock)
  await page.goto('./')
  await openChat(page)

  await askTyped(page, `هل عندكم ${product.name_ar}؟`)
  await expect(answerText(page, t.chat.products)).toBeVisible()
  await chatLog(page)
    .getByRole('button', {
      name: `${t.cart.add}: ${product.name_ar}`,
      exact: true,
    })
    .click()

  await expect(
    page.getByRole('button', { name: t.cart.open }),
  ).toHaveAccessibleName(`${t.cart.open} 1`)
  await expect(page.getByRole('status')).toHaveText(
    `${t.cart.added} ${product.name_ar} (1)`,
  )
  await expect(chatLog(page).getByText(`${t.cart.inCart} 1`)).toBeVisible()

  // A product that is not on the list points to the cart's box for other items,
  // and the cart opens from the chat with the product already in it.
  await askTyped(page, 'هل عندكم zzzz؟')
  await expect(
    answerText(
      page,
      fillIn(t.chat.noProducts, { extraItems: t.order.extraItems }),
    ),
  ).toBeVisible()
  await chatLog(page)
    .getByRole('button', { name: t.chat.openCart })
    .last()
    .click()
  const drawer = page.getByRole('dialog', { name: t.cart.title })
  await expect(drawer).toBeVisible()
  await expect(drawer.getByText(product.name_ar, { exact: true })).toBeVisible()
})

for (const width of [360, 1280]) {
  test(`at ${width}px the panel fits, never covers the header’s cart button, and the cart and product dialogs open above the chat`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('./')
    await openChat(page)
    await chip(page, t.chat.topics.order).click()

    const panelBox = await chatPanel(page).boundingBox()
    const buttonBox = await chatButton(page).boundingBox()
    const headerBox = await page.locator('header').boundingBox()
    const cartButton = page.getByRole('button', { name: t.cart.open })

    // Inside the screen, under the header, and above its own button without touching it.
    expect(panelBox.x).toBeGreaterThanOrEqual(0)
    expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(width)
    expect(panelBox.y).toBeGreaterThan(headerBox.y + headerBox.height)
    expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(buttonBox.y)
    expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(800)
    const hasSidewaysScroll = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    )
    expect(hasSidewaysScroll).toBe(false)

    // The header's cart button is still on top and works while the chat is open.
    expect(
      await drawnOnTop(page, await cartButton.boundingBox(), 'header'),
    ).toBe(true)
    await cartButton.click()
    await expect(page.getByRole('dialog', { name: t.cart.title })).toBeVisible()
    expect(await drawnOnTop(page, buttonBox, 'dialog:modal')).toBe(true)
    expect(await drawnOnTop(page, panelBox, 'dialog:modal')).toBe(true)
    await page.keyboard.press('Escape')

    // The page behind the chat still scrolls, and the product details open above the chat.
    const product = products[0]
    await page
      .locator('#products')
      .getByRole('button', { name: product.name_ar, exact: true })
      .click()
    await expect(
      page.getByRole('dialog', { name: product.name_ar }),
    ).toBeVisible()
    expect(await drawnOnTop(page, buttonBox, 'dialog:modal')).toBe(true)
  })
}

test('at 360px every control in the chat is at least 44px for fingers', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('./')
  await openChat(page)
  await askTyped(page, products[0].name_ar)
  const panel = chatPanel(page)
  await expect(answerText(page, t.chat.products)).toBeVisible()

  const targets = [
    chatButton(page),
    panel.getByRole('textbox', { name: t.chat.inputLabel }),
    ...(await panel.getByRole('button').all()),
  ]
  for (const target of targets) {
    const { width, height } = await target.boundingBox()
    const name = await target.evaluate(
      (element) => element.getAttribute('aria-label') || element.textContent,
    )
    expect(Math.min(width, height), name).toBeGreaterThanOrEqual(44)
  }
})

test('the whole chat works with the keyboard', async ({ page }) => {
  await page.goto('./')
  await chatButton(page).focus()
  await page.keyboard.press('Enter')
  const panel = chatPanel(page)
  await expect(panel).toBeVisible()

  // From the close button, Tab reaches the first chip, and Enter asks it.
  await page.keyboard.press('Tab')
  await expect(chip(page, t.chat.topics.hours)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(answerText(page, t.chat.whichBranch)).toBeVisible()

  // Type a question and send it with Enter.
  await panel.getByRole('textbox', { name: t.chat.inputLabel }).focus()
  await page.keyboard.type('شكرا')
  await page.keyboard.press('Enter')
  await expect(answerText(page, t.chat.thanks)).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(panel).toBeHidden()
  await expect(chatButton(page)).toBeFocused()
})

test.describe('with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('the panel slides in, typing dots play before each answer, and messages pop in', async ({
    page,
  }) => {
    await page.goto('./')
    await chatButton(page).click()
    const panel = chatPanel(page)
    await expect(panel).toHaveCSS('transition-property', /translate, scale/)
    await expect(panel).toHaveCSS('opacity', '1')

    await chip(page, t.chat.topics.order).click()
    const dots = chatLog(page).locator('[class*="animate-typing"]')
    await expect(dots).toHaveCount(3)
    await expect(dots.first()).toHaveCSS('animation-name', 'typing')
    await expect(answerText(page, t.chat.orderIntro)).toBeVisible()
    await expect(dots).toHaveCount(0)

    const newest = chatLog(page).locator(':scope > *').last()
    await expect(newest).toHaveCSS('animation-name', 'pop-in')
  })

  test('the chat button and the chips react to the pointer', async ({
    page,
  }) => {
    await page.goto('./')
    const button = chatButton(page)
    await button.hover()
    await expect(button).toHaveCSS('translate', '0px -2px')
    await expect(button.locator('svg')).toHaveCSS('animation-name', 'wiggle')

    await button.click()
    // Wait until the panel has slid in and the greeting has popped in, so the chip does not
    // move away from under the mouse.
    await expect
      .poll(() =>
        chatPanel(page).evaluate(
          (panel) => panel.getAnimations({ subtree: true }).length,
        ),
      )
      .toBe(0)
    const firstChip = chip(page, t.chat.topics.hours)
    await firstChip.hover()
    await expect(firstChip).toHaveCSS('translate', '0px -2px')
    await expect(firstChip).toHaveCSS(
      'background-color',
      await tokenColor(page, 'main-soft'),
    )
  })
})

test('visitors who ask for less motion get a still panel and answers at once, with no typing dots', async ({
  page,
}) => {
  // playwright.config.js asks for reduced motion in every test.
  await page.goto('./')
  await openChat(page)
  const panel = chatPanel(page)
  await expect(panel).toHaveCSS('transition-duration', '0s')

  await chip(page, t.chat.topics.order).click()
  expect(await chatLog(page).locator('[class*="animate-typing"]').count()).toBe(
    0,
  )
  await expect(answerText(page, t.chat.orderIntro)).toBeVisible()
  const newest = chatLog(page).locator(':scope > *').last()
  await expect(newest).toHaveCSS('animation-name', 'none')

  const firstChip = chip(page, t.chat.moreQuestions)
  await firstChip.hover()
  await expect(firstChip).toHaveCSS('translate', 'none')
})

// Screenshots for a visual check of the open chat (screenshots/ is git-ignored).
test('screenshot: the chat in Arabic at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await openSite(page, 'ar')
  await openChat(page)
  await askTyped(page, `هل عندكم ${products[0].name_ar}؟`)
  await expect(answerText(page, t.chat.products)).toBeVisible()
  await page.screenshot({ path: 'screenshots/chat-ar-360.png' })
})

test('screenshot: the chat in English at 1280px', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await openSite(page, 'en')
  await openChat(page, 'en')
  await chip(page, texts.en.chat.topics.hours, 'en').click()
  await expect(newestChips(page, 'en')).toHaveCount(store.branches.length)
  await page.screenshot({ path: 'screenshots/chat-en-1280.png' })
})

test.describe('dark mode screenshot', () => {
  test.use({ colorScheme: 'dark' })

  test('screenshot: the chat in dark mode at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await openSite(page, 'ar')
    await openChat(page)
    await chip(page, t.chat.topics.order).click()
    await expect(answerText(page, t.chat.orderIntro)).toBeVisible()
    await page.screenshot({ path: 'screenshots/chat-dark-360.png' })
  })
})
