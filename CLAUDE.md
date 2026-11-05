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
- Tests: Vitest for pure logic only (cart totals, WhatsApp message, branch rules, Arabic search, JSON-LD).
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

## Quality bar
- Mobile first. Must look right from 360 px wide up to desktop.
- Accessibility: semantic HTML, visible focus, AA contrast, keyboard friendly, aria-live for cart changes.
- Lighthouse 90+ on mobile for Performance, Accessibility, Best Practices and SEO.
- SEO: Arabic title and description, Open Graph image, favicon, JSON-LD (a schema.org Organization with one GroceryStore per branch).

## Design style (60-30-10)
- Colors: 60% a main neutral (page backgrounds), 30% a second main color (header, footer, section bands, cards), 10% one strong contrasting accent, used only for the most important things: Add to cart, Send order, badges, active states and key highlights. Only these three, plus grays and status colors.
- Define them once as Tailwind @theme tokens (canvas, main, accent, with dark-mode versions) and use only the tokens in components, so the palette can be swapped in one place when the logo arrives.
- Replace the current green with a modern palette that suits a Saudi supermarket, for example off-white + deep navy + saffron yellow. Explain your choice in two lines with hex values. Dark mode keeps the same split. All text must pass AA contrast; if the accent fails as text, use it only as a background.
- Motion: sections and cards fade and rise in on scroll (IntersectionObserver), with a small stagger in the product grid. Buttons and cards react to hover and press, the cart badge animates when items are added, and dialogs and the drawer transition smoothly. 150 to 400 ms, eased, never blocking, and all of it off with prefers-reduced-motion.
- Everything reacts: every button, link, chip, input and card has visible hover, press and keyboard-focus states (and disabled where relevant). Saffron buttons get a soft shine on hover; icon buttons a round highlight and a small icon motion; the active filter a sliding pill; menu links an underline that grows from the start side, and the link of the section in view stays highlighted (scrollspy). Inputs animate their focus ring, and the search box shows a clear button. Changed numbers roll, small confirmations slide in. Tap targets at least 44 px. Nothing on the page stays still under the cursor.
- Cards: every card and box reacts on hover, and on tap on phones. Clickable cards lift and zoom their picture, and buttons and links show the hand cursor. Cards that are not clickable also react: they lift and tilt slightly, glow, and their icon animates (bounce, wiggle or spin), but they keep the normal cursor and no underline, so they don't look like links.
- Moving background: visibly moving all the time, easy to notice within 2 to 3 seconds without touching the page. At the edges of the navy bands, 2 or 3 layered waves in navy and a lighter navy, each sliding sideways at its own speed in seamless loops (6 to 12 s) with a gentle up-and-down swell. Behind the page, 4 to 6 soft navy and saffron circles of different sizes, each floating on its own path across a wide area (10 to 20 s per loop), some growing and shrinking. The hero moves a bit more than the rest of the page.
- All of this motion: only transform and opacity (pre-blurred radial gradients, no animated blur or box-shadow), smooth on phones, paused while the tab is hidden, off with prefers-reduced-motion, and all text stays AA at every point (even with every circle behind it at once).
- Graphics: a hero with depth (soft gradient shapes or a subtle pattern in the main and accent colors), one consistent icon style for categories and highlights instead of mixed emoji, and shapes or dividers that add depth between sections. Use inline SVG and CSS.
- Prefer CSS only. If a motion library is really needed, only `motion` (Motion for React) is allowed.
- Keep Lighthouse 90+ on mobile, with no layout shift from animations.

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
