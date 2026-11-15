# Bayariq Al Khair Supermarket Website

## Project
- Real website for أسواق بيارق الخير الاقتصادية (Aswaq Bayariq Al Khair), a supermarket in Jeddah, Saudi Arabia, with four branches: Al Hamdaniyah (الحمدانية), Kilo 14 (كيلو 14) and Al Mahamid (المحاميد) are called أسواق بيارق الخير, and Al Harazat (الحرازات) is called بيارق التوفيق (Bayariq Al Tawfiq). The store belongs to Ahmed's family.
- Developer: Ahmed, a software engineering student. He must be able to read and explain every line, so keep the code simple, readable and well named.
- Goal: a fast, professional, mobile-first site where customers browse products and offers, find the nearest branch, and send their order on WhatsApp to the branch they choose.
- This rebuilds an older HTML/CSS/JS version (in `old/`, if present). Use it only to see which features it had (language switch, search, category filter, product popup, offers timer, dark mode, map). Do not copy its code.

## Tech
- React + Vite, JavaScript (no TypeScript), Tailwind CSS.
- No backend, database or payments. All content lives in JSON files in `src/data/`.
- Hosting: GitHub Pages through GitHub Actions. Set Vite `base` to the repo name. Use HashRouter if routes are ever needed.
- Tests: Vitest for pure logic only (cart totals, WhatsApp message, branch rules, Arabic search, JSON-LD, chatbot matching and answers, tour placement).
- Browser checks: Playwright (Chromium), tests in `e2e/`.
- Ask before adding any dependency not listed here. Prefer none.

## Languages
- Arabic is the default (`lang="ar"`, `dir="rtl"`). English is available through a toggle. Save the choice in localStorage.
- All UI text comes from `src/i18n/ar.json` and `src/i18n/en.json`. No hard-coded text in components.
- Use logical Tailwind classes (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`) so RTL and LTR both work.
- Font: IBM Plex Sans Arabic (covers Arabic and Latin).
- Arabic copy: clear Modern Standard Arabic, warm and short. Prices in SAR (ر.س).

## Content rules
- Never invent real store facts (phone, prices, hours, address, delivery). Use placeholders tagged `NEEDS-AHMED` until Ahmed provides them (see "Things that need Ahmed").
- Images: the store's own photos or free-license images only. WebP, under 200 KB, lazy-loaded, with alt text in both languages.

## Data files
- `store.json`: store names (ar/en), website, social links, and `branches`: one entry per branch with id, name (ar/en), district (ar/en), phone, whatsapp (international digits only, like 9665XXXXXXXX), opening hours (`hours` rows plus the short `openingHours` form for search engines), address, Google Maps link and embed link, and delivery info (`delivers`: true or false, plus details). Every branch detail Ahmed has not given yet is `NEEDS-AHMED`.
- `categories.json`: id, name_ar, name_en, icon (the name of a category icon in `src/components/Icons.jsx`, like `carrot`).
- `products.json`: id, name_ar, name_en, category, price (number or null), unit_ar, unit_en, image, featured, inStock.
- `offers.json`: id, title_ar, title_en, details_ar, details_en, image, validUntil (ISO date). Hide expired offers automatically.

## WhatsApp order
- Customers add products to a cart (saved in localStorage), change quantities, and write a note for items that are not listed.
- Order form: branch (required), name, district, pickup or delivery (delivery only when the chosen branch delivers), preferred time, notes.
- "Send order" builds a clear message in the current language with items, quantities, an estimated total (priced items only) and the customer details and the chosen branch, then opens `https://wa.me/<that branch's number>?text=<encoded message>`. "Send order" stays disabled until the chosen branch has a real WhatsApp number.
- Keep the message builder and the branch rules pure functions in `src/lib/` with unit tests.

## Quick-answer chatbot
- No AI, no server, no new dependencies. Every answer comes only from `store.json`, `offers.json` and `products.json`, never invented. A NEEDS-AHMED detail is answered with a polite "coming soon"; a branch with a real WhatsApp number gets a button to message that branch.
- A red chat button in the bottom corner (end side) opens a non-modal `<dialog>` (`show()`, not `showModal()`), so the page still scrolls and the cart still works. It sits below the sticky header and never covers the cart button; the cart drawer and dialogs open above it (top layer). The footer has extra bottom padding so the button never hides its text.
- Topic chips: opening hours, branches and locations, delivery, how to order, current offers, contact a branch. Branch topics ask which branch first (one chip per branch), unless the question names one. Final answers end with an "other questions" chip; greetings, thanks and unmatched questions show the topic chips again.
- Typed questions match simple Arabic and English keywords after the product search's `normalizeText` (plus Arabic digits). "Do you have X?" uses the product search (`filterProducts`) and shows matches with Add to cart; a product not on the list points to the cart's box for unlisted items.
- Pure logic: `src/lib/chatQuestions.js` (`matchQuestion`: what was asked) and `src/lib/chatAnswers.js` (`buildAnswer`: the answer), with unit tests, so an AI can replace them later. Messages store the question, and the answer is built at render time, so the whole conversation follows the language switch.
- Motion: the panel slides up from the button, messages pop in, typing dots play before each answer; with reduced motion nothing moves and answers show at once. Messages are in a `role="log"` live region; the whole bot works with the keyboard; Escape closes it and focus returns to the chat button.

## First-visit tour
- Built by hand, no dependency. The steps (order, CSS selector of the element, icon) are in `src/data/tour.json`; all text is under `tour` in `ar.json` and `en.json`. Elements the tour points at carry `data-tour="…"`. A step whose element is missing (for example no product in stock) is left out.
- `src/tour/TourProvider.jsx` starts it once per browser (localStorage key `bayariq-tour-seen`, saved as soon as it starts, after the web font has loaded) and gives `startTour()` to the "take the tour again" chip in the chat and the footer link. `src/components/TourGuide.jsx` draws it; the placement math is in `src/lib/tourPosition.js` with unit tests.
- It is a `showModal()` dialog: above everything, announced by screen readers (each step is read from an `aria-live` region), focus on "Next", Escape skips. Afterwards the page scrolls back to where it was and focus returns to what started it. The chat panel steps aside while it runs.
- The spotlight is a box whose very wide shadow dims the page; it and the tooltip glide between steps (translate, width, height, like the category pill), the tooltip is a card and the spotlight's ring glows on hover and tap. The tooltip stays on screen at 360 px (under, above, or at the bottom), and everything is instant with reduced motion.
- Every Playwright test starts with the tour marked as seen (`storageState` in `playwright.config.js`); `e2e/tour.spec.js` starts empty to test the tour.

## Quality bar
- Mobile first. Must look right from 360 px wide up to desktop.
- Accessibility: semantic HTML, visible focus, AA contrast, keyboard friendly, aria-live for cart changes.
- Lighthouse 90+ on mobile for Performance, Accessibility, Best Practices and SEO.
- SEO: Arabic title and description, Open Graph image, favicon, JSON-LD (a schema.org Organization with one GroceryStore per branch).

## Design style (modern-ui-style: 60-30-10, everything reacts, live background)
The site should feel alive: everything reacts to the pointer or a tap, and the background visibly moves on its own all the time. Motion you have to look for counts as "not moving": it must be easy to notice within 2 to 3 seconds.

Colors (60-30-10)
- The colors come from the store's logo (`photos/logo.png`, sampled). 60% canvas, white `#ffffff`: the page and large surfaces (cards and dialogs are white too, set apart by a border and a soft shadow). 30% main, the logo green `#048157`: structure and identity, so the header, hero, offers band, footer, waves, navigation, the tops of the branch cards, the chat header, card icon tiles and secondary buttons. 10% accent, red: only what must catch the eye, so Add to cart, Send order, Browse products, the chat button, active states (filter pill), badges and small highlights. 50-40-10 is fine where green carries more of the layout.
- Two reds: the exact logo red `#fb0000` only for the logo itself (the `logo-*` tokens, which never change in dark mode), and a slightly deeper `#e00000` for buttons, badges and text, because white text on the logo red is only 4.1:1. Green text on light backgrounds uses a deeper green, `main-ink` `#03704b` (6.1:1 on white).
- Why this palette: it is the store's own logo, so the site and the shop signs match. Green says fresh food, and red stands out for the few things that must be clicked.
- Grays made from the neutral (ink, muted, line, with a hint of the logo green) are allowed for text and borders and don't count as extra colors. Because red and green are the brand colors, no status or warning relies on color: it always has an icon and clear text, and red or green alone never carries meaning (for color-blind visitors). No other colors.
- Define the tokens once as Tailwind @theme tokens in `src/index.css`: canvas, main and accent, each with an on-color for text (`ink`, `on-main`, `on-accent`), plus dark-mode versions. Components use only the tokens, never raw hex, so the palette is swapped in one place. Never name a color token after a size word (base, xs, sm, md, lg, xl): `text-base` would become that color instead of the font size and can make text invisible.
- Dark mode keeps the split: a near-black with a hint of green (`#08130e`) for the 60%, a green that is lighter than the page but kept deep (`#0b5a3e`, so white text on it is 8:1 and the bands don't glare) for the 30%, the same red for the 10%. The logo always sits on a white plate, so it looks the same in both modes.
- All text meets WCAG AA (4.5:1 body text, 3:1 large text). White on the logo green is only 4.9:1, so text on green is always full white (never see-through white), and nothing that lightens the green (white glows, see-through white hovers) goes behind text. Red and green are almost equally light (1.03:1): red on a green band always gets a white ring, and highlights inside green bands (menu underline, keyboard focus, the bar under a title) are white.
- On a screenshot, red is the rarest of the three colors. If it is everywhere, it stops standing out.

Interaction: everything reacts
- Every button, link, tab, chip, icon button, input, card, menu item, info box and empty-state box reacts to hover and tap. Nothing on the page stays still under the cursor. Interactive elements also have visible press, keyboard-focus and (where relevant) disabled states.
- Buttons: hover lifts slightly with a deeper shadow and brighter color; press scales to about 0.96; red buttons get a shine sweep on hover; icon buttons get a round highlight and a small icon motion (the sun turns, the cart rocks, close turns, plus turns, send nudges forward).
- Tabs and filter chips: the active one has a sliding indicator (the red pill) that moves between items.
- Navigation: an underline that grows from the start side (RTL aware), and the link of the section in view stays highlighted while scrolling (scrollspy).
- Inputs: focus ring and border animate in; icons inside respond on focus; a clear button appears when the search box or the chat's question box has text (the order form's short fields don't get one).
- Clickable cards (products): lift, the picture zooms slightly, hand cursor.
- Non-clickable cards and boxes (highlights, offers, branch cards, chat messages, the tour card, empty states, the error message): they still move on hover, with a small lift and tilt and a glow, and their icon animates (bounce, wiggle or spin), but they keep the normal cursor and no underline, so they don't look like links.
- Feedback for actions: badges pop, numbers roll when they change, small confirmations slide in.
- Touch: the same reactions show on tap (`tapReaction.js` for cards), and tap targets are at least 44 px.

Motion
- Interactions take 150 to 400 ms: ease-out when entering, ease-in when leaving.
- Entrance: sections and cards fade and rise in as they scroll into view (IntersectionObserver), with a small stagger in lists. Smooth dialog, drawer and chat transitions, and a skeleton (a softly pulsing box) while photos load.
- Never block input and never cause layout shift (elements keep the same size before and after the web font loads).
- Respect prefers-reduced-motion: no movement, instant state changes. When motion seems missing on Ahmed's own computer, first check Windows Settings > Accessibility > Visual effects > Animation effects, because turning it off triggers reduced motion.
- Prefer CSS and IntersectionObserver. If a library is really needed, only `motion` (Motion for React).

Live background (always moving)
- It moves on its own all the time, without scrolling or touching, and the motion is obvious within 2 to 3 seconds.
- Waves at the edges of the green bands: 2 or 3 layered waves in green and a lighter green, each sliding sideways at its own speed in seamless loops (6 to 12 s), with a gentle up-and-down swell.
- Circles: 4 to 6 soft green and red circles of different sizes, each floating on its own path across a wide area (10 to 20 s per loop), some slowly growing and shrinking. The hero moves a bit more than the rest of the page.
- Animate only transform and opacity, with pre-blurred radial gradients and wide SVG waves (no animated blur or box-shadow), so it stays smooth on phones. Pause it while the tab is hidden, and turn it off with prefers-reduced-motion.
- Text on top of it stays AA at every point of the animation (even with every circle behind it at once).

Graphics
- A hero with depth: soft glows (a red glow and a dark green shade, which never make the green lighter) and a faint eight-pointed star pattern in a darker green.
- One consistent outline icon set (`src/components/Icons.jsx`), tinted green, with red for the active item. The store's mark (`LogoMark.jsx`, redrawn from the logo) appears next to the store name in the header, and the full logo in the footer, both on a white plate. No emoji.
- Consistent rounded corners, soft layered shadows, generous spacing, and waves between the green bands.
- Shapes and illustrations as inline SVG and CSS, so they stay sharp and light.

Checks before finishing (any design change)
- Screenshots at 360 px and 1280 px, in light and dark mode, including the chat open and one tour step (`e2e/screenshots.spec.js`). Is the 60-30-10 split visible, and is red rare and on the right things?
- Every kind of element reacts on hover and tap, including non-clickable cards and empty states; the waves and circles visibly move within 3 seconds, and stop with reduced motion.
- AA contrast for every visible text, including dialogs, the drawer, the chat and the tour, in both themes; Lighthouse mobile stays 90+ (or no worse than before); no layout shift.
- State the palette in two lines with hex values and why it fits the site.

## How to work (keep token use low)
- Do only the step Ahmed asks for. Do not start the next step.
- Make small, focused changes. Do not rewrite files that do not need it.
- The first time you use a new React or Tailwind idea, explain it in one or two plain sentences.
- Before finishing a step, follow "Checks and Git" below and fix any errors.

## Things that need Ahmed
- Never stop or wait for me. When something needs my input (store details, real content, photos, a decision or a confirmation), use a placeholder and keep going.
- Tag every placeholder in code and data with NEEDS-AHMED instead of TODO. On the page, never show "TODO": show a neutral "قريبًا" / "Coming soon" or hide the element. Never invent phone numbers: keep the call and WhatsApp buttons hidden or disabled until a real number is added.
- Keep one list of everything you need from me in NEEDS_FROM_AHMED.md, grouped into store details, content and photos, and decisions, with where each item goes. Update it every step.
- Don't list "what you must do yourself" after each step. Give me the full NEEDS_FROM_AHMED.md list only after Step 8, as everything needed to finish version 1.

## Checks and Git (after every step)
- I keep `npm run dev` running in my own terminal on port 5173. Never stop it or start another dev server.
- Run lint, format:check and build (and `npm test` once unit tests exist).
- Run `npm run check`: Playwright (Chromium) tests against `vite preview` on port 4173. Load the site in Arabic and English at 360 px and 1280 px wide, fail on console errors or sideways scrolling, and test the step's new features. Save two screenshots (Arabic at 360 px, English at 1280 px) to `screenshots/` (git-ignored) and look at them yourself.
- Add or update Playwright tests for each new feature.
- When everything passes, commit with a clear message and push (`git add -A`, `git commit`, `git push`).
- End with: what changed (5 lines max) and what the checks covered.

## Build plan
1. Setup: Vite + React + Tailwind, ESLint and Prettier, folders (`components`, `sections`, `data`, `i18n`, `lib`, `assets`), font, RTL base layout, `store.json` with NEEDS-AHMED placeholders.
2. Language system: AR/EN context, header toggle, `lang`/`dir` switch, saved choice. Header with logo and navigation, plus footer.
3. Home and store info: hero, short "why shop with us" highlights, opening hours, Google Maps embed, call and WhatsApp buttons.
4. Products: category filter, search that ignores Arabic letter variants (أ إ آ to ا, ة to ه, ى to ي) and diacritics, product cards, product details dialog.
5. Offers: offer cards from `offers.json` with valid-until dates, expired offers hidden.
6. Cart and WhatsApp order: cart drawer, quantities, order form, message builder, wa.me link, Vitest tests for the cart and the message.
7. Polish: dark mode, subtle animations, accessibility pass, image optimization, empty and error states.
8. SEO and launch: meta tags, Open Graph image, favicon, JSON-LD, GitHub Actions deploy to GitHub Pages, README with screenshots and the live link.
9. Real content: replace every NEEDS-AHMED placeholder with the owner's details, photos, products and offers, then run a final Lighthouse check.
