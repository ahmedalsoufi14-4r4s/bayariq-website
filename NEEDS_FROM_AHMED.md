# What the site needs from Ahmed

Every item below is tagged `NEEDS-AHMED` in the code or data. Until an item is filled in, the site hides it or shows "قريبًا / Coming soon", so nothing fake ever appears on the page. The chat helper answers from the same files, so each detail you fill in also appears in its answers (and a branch's WhatsApp number adds a "message this branch" button there).

## Store details

All of these go in `src/data/store.json`. Its `branches` list has the four branches, with their names and districts already filled in: Al Hamdaniyah, Kilo 14 and Al Mahamid (أسواق بيارق الخير), and Al Harazat (بيارق التوفيق).

**For each branch:**

- **Phone number** → `phone`, for example `+9661XXXXXXXX`. Shows the branch's "Call us" button.
- **WhatsApp number** → `whatsapp`, international digits only, for example `9665XXXXXXXX`. Shows the branch's WhatsApp button and lets customers send orders to that branch.
- **Opening hours** → `hours`. Replace `"NEEDS-AHMED"` with one row per group of days:
  `[{ "days_ar": "…", "days_en": "…", "time_ar": "…", "time_en": "…" }]`
  The same hours also go in `openingHours` in the short form search engines read, for example `["Sa-Th 07:00-23:00", "Fr 16:00-23:00"]`. Claude can write this from the rows above.
- **Full street address** → `address_ar`, `address_en` (street and nearest landmark).
- **Google Maps link** → `mapsUrl` (Google Maps → Share → Copy link). Shows "Open in Google Maps".
- **Google Maps embed link** → `mapsEmbedUrl` (Google Maps → Share → Embed a map → copy only the link inside `src="…"`). Replaces the branch's "Map coming soon" box. Claude can make it from the share link.
- **Delivery** → `delivers` (`true` or `false`), plus `delivery_ar` and `delivery_en` (areas, fee, minimum order, times). With `true`, the order form offers delivery when the customer picks that branch.

**For the whole store:**

- **Social media accounts** → `social`: which networks the store uses and their links, and whether Bayariq Al Tawfiq has its own accounts.

## Content and photos

Photos: WebP, under 200 KB each. A free way to convert them is [squoosh.app](https://squoosh.app) (choose WebP, quality about 75, width about 800 px). `npm run check` fails if a photo in the data files is missing from `public/`, is not WebP, or is 200 KB or larger. A photo that fails to load on the site falls back to the category icon.

- **Logo** → `public/images/`, replaces the saffron bag mark and the text logo in `src/components/Header.jsx`. SVG is best, PNG or WebP also works. It also replaces the shopping-bag icon in `public/favicon.svg`; then `npm run images` remakes the share image (`public/og-image.png`) and the iPhone icon. If Bayariq Al Tawfiq has its own logo, send that too.
- **Store photo for the hero** (the front or inside of one of the branches) → `public/images/`, used in `src/sections/Hero.jsx` in place of the four category icon tiles on wide screens.
- **Real product list** → `src/data/products.json` (12 sample products now). For each product: Arabic and English name, category, price (or none for "price on request"), unit or size, featured or not, in stock or not.
- **Real categories** → `src/data/categories.json` (6 sample categories now): Arabic and English name, and which icon fits. The six icons now are `carrot`, `milk`, `bread`, `jar`, `cup` and `spray` (in `src/components/Icons.jsx`); Claude can draw more in the same style.
- **Product photos** → `public/images/products/`, then set each product's `image`, for example `"images/products/milk.webp"`. Square photos look best.
- **Current offers** → `src/data/offers.json` (empty now). For each offer: Arabic and English title and details, last day (`YYYY-MM-DD`), and an optional photo in `public/images/offers/`.

## Decisions

- **Match the palette to the logo once it arrives** → the color tokens in `src/index.css` (`@theme`, and the dark-mode versions under `:root.dark`), plus `theme-color` in `index.html` and the two colors in `public/favicon.svg`; then `npm run images`. The site uses off-white `#f8f6f1`, deep navy `#14284b` and saffron `#f4b41a` until then.
  Recommended: take the navy (30%) and the saffron (10%) from the logo's two main colors and keep the off-white. Claude can do it from the logo file and check that every text still passes AA contrast (`npm run check` tests it).

- **"Why shop with us" points** → `highlights` in `src/i18n/ar.json` and `src/i18n/en.json`. "فرع قريب منك" lists the four districts from `store.json`. Please confirm all three, especially "أسعار اقتصادية" (budget-friendly prices).
  Recommended: keep all three. "أسعار اقتصادية" matches the store's name ("الاقتصادية"), if the family is comfortable saying it.
- **Offer dates: Gregorian or Hijri** → `dateLocale` in `src/i18n/ar.json`. It shows Gregorian dates now ("30 نوفمبر 2026").
  Recommended: Gregorian. The end dates are stored as Gregorian, and one calendar avoids confusion.
- **Search and share text** → `description` and `og:description` in `index.html`: "أسواق بيارق الخير الاقتصادية: أربعة فروع في جدة، في الحمدانية وكيلو 14 والمحاميد، وبيارق التوفيق في الحرازات. تصفّح منتجاتنا وعروضنا، وأرسل طلبك عبر واتساب."
  Recommended: keep it. It names both store names and all four districts, so people find the site whichever they search for.
- **Font weights** → the site loads only regular and bold IBM Plex Sans Arabic, because each extra weight made the page clearly slower on phones (Lighthouse 85 → 95).
  Recommended: keep it.
- **Chat helper's name and greeting** → `chat` in `src/i18n/ar.json` and `src/i18n/en.json`. It is called "مساعد بيارق" / "Bayariq helper" (one name for both stores) and its greeting gives "هل عندكم حليب؟" as an example question.
  Recommended: keep both. If milk is not on the real product list, change the example to a product that is.
- **Own domain (optional)** → if the store buys one (for example `bayariq.sa`), change `website` in `src/data/store.json`, the four full URLs in `index.html`, and `base` in `vite.config.js`, then set the domain in GitHub → Settings → Pages.
  Recommended: not for version 1. Launch on the free GitHub address and decide later.
- **Are products, prices and offers the same in every branch?** The site has one product list and one offers list for all four branches.
  Recommended: yes, one shared list for version 1. The cart already calls the total an estimate, and the branch confirms the final price on WhatsApp. If prices or offers really differ between branches, the data needs a price per branch, or a "this branch only" field on offers.
- **How to show the Bayariq Al Tawfiq name next to Bayariq Al Khair?**
  Recommended (this is what the site does now): keep "أسواق بيارق الخير الاقتصادية" as the site name in the header, hero and footer. Each branch card shows its own name above the branch title, so the Al Harazat card says "بيارق التوفيق". The search description mentions both names. Please also confirm each branch's exact name as written on its sign: the three Al Khair branches say "أسواق بيارق الخير" now, while the site name is "أسواق بيارق الخير الاقتصادية".
