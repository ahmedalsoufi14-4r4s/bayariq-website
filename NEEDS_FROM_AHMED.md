# What the site needs from Ahmed

Every item below is tagged `NEEDS-AHMED` in the code or data. Until an item is filled in, the site hides it or shows "قريبًا / Coming soon", so nothing fake ever appears on the page.

## Store details

All of these go in `src/data/store.json`.

- **Phone number** → `phone`, for example `+9661XXXXXXXX`. Shows the "Call us" buttons.
- **WhatsApp number** → `whatsapp`, international digits only, for example `9665XXXXXXXX`. Shows the WhatsApp buttons and turns on "Send order" in the cart.
- **Opening hours** → `hours`. Replace `"NEEDS-AHMED"` with one row per group of days:
  `[{ "days_ar": "…", "days_en": "…", "time_ar": "…", "time_en": "…" }]`
- **Full street address** → `address_ar`, `address_en`. Right now it only says "حي الحمدانية، جدة".
- **Google Maps link** → `mapsUrl` (Google Maps → Share → Copy link). Shows "Open in Google Maps".
- **Google Maps embed link** → `mapsEmbedUrl` (Google Maps → Share → Embed a map → copy only the link inside `src="…"`). Replaces the "Map coming soon" box.
- **Social media accounts** → `social`: which networks the store uses and their links.
- **Delivery** → `delivers` (`true` or `false`), plus `delivery_ar` and `delivery_en` (areas, fee, minimum order, times). With `true`, the order form offers delivery and shows these details.

## Content and photos

Photos: WebP, under 200 KB each. A free way to convert them is [squoosh.app](https://squoosh.app) (choose WebP, quality about 75, width about 800 px). `npm run check` fails if a photo in the data files is missing from `public/`, is not WebP, or is 200 KB or larger. A photo that fails to load on the site falls back to the category icon.

- **Logo** → `public/images/`, replaces the text logo in `src/components/Header.jsx`. SVG is best, PNG or WebP also works.
- **Store photo for the hero** → `public/images/`, used in `src/sections/Hero.jsx`.
- **Real product list** → `src/data/products.json` (12 sample products now). For each product: Arabic and English name, category, price (or none for "price on request"), unit or size, featured or not, in stock or not.
- **Real categories** → `src/data/categories.json` (6 sample categories now): Arabic and English name and an emoji icon.
- **Product photos** → `public/images/products/`, then set each product's `image`, for example `"images/products/milk.webp"`. Square photos look best.
- **Current offers** → `src/data/offers.json` (empty now). For each offer: Arabic and English title and details, last day (`YYYY-MM-DD`), and an optional photo in `public/images/offers/`.

## Decisions

- **"Why shop with us" points** → `highlights` in `src/i18n/ar.json` and `src/i18n/en.json`. Please confirm all three, especially "أسعار اقتصادية" (budget-friendly prices).
- **Offer dates: Gregorian or Hijri** → `dateLocale` in `src/i18n/ar.json`. It shows Gregorian dates now ("30 نوفمبر 2026").
