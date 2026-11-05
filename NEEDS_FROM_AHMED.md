# What the site still needs

Everything below is tagged `NEEDS-AHMED` in the code or data, or is a decision still open. Until a detail is filled in, the site hides it or says "قريبًا / Coming soon": on the branch cards, in the order form, in the chat helper's answers, and in what search engines read. Nothing made up ever appears.

**Who:** **Family** = the store owners know it, have it or decide it (numbers, hours, photos, prices). **Ahmed** = Ahmed (with Claude) prepares it or decides it. Ahmed puts every Family answer into the files.

## Store details, per branch

All go in that branch's entry in `branches` in `src/data/store.json`. The four branches, their districts and their names are already there: Al Hamdaniyah, Kilo 14 and Al Mahamid (أسواق بيارق الخير), and Al Harazat (بيارق التوفيق). Tick a box when that branch's detail is in.

| Detail                                          | Field                                    | Who    | Al Hamdaniyah | Kilo 14 | Al Mahamid | Al Harazat |
| ----------------------------------------------- | ---------------------------------------- | ------ | :-----------: | :-----: | :--------: | :--------: |
| Name exactly as on the sign (confirm)           | `name_ar`, `name_en`                     | Family |       ☐       |    ☐    |     ☐      |     ☐      |
| Phone number                                    | `phone`                                  | Family |       ☐       |    ☐    |     ☐      |     ☐      |
| WhatsApp number for orders                      | `whatsapp`                               | Family |       ☐       |    ☐    |     ☐      |     ☐      |
| Opening hours                                   | `hours`                                  | Family |       ☐       |    ☐    |     ☐      |     ☐      |
| Opening hours for search engines                | `openingHours`                           | Ahmed  |       ☐       |    ☐    |     ☐      |     ☐      |
| Street address and nearest landmark             | `address_ar`, `address_en`               | Family |       ☐       |    ☐    |     ☐      |     ☐      |
| Google Maps link (the branch's pin)             | `mapsUrl`                                | Family |       ☐       |    ☐    |     ☐      |     ☐      |
| Google Maps embed link                          | `mapsEmbedUrl`                           | Ahmed  |       ☐       |    ☐    |     ☐      |     ☐      |
| Delivery: yes or no, areas, fee, minimum, times | `delivers`, `delivery_ar`, `delivery_en` | Family |       ☐       |    ☐    |     ☐      |     ☐      |

What each one does, and how to write it:

- **Name on the sign**: the three Al Khair branches say "أسواق بيارق الخير" now (the site's name is "أسواق بيارق الخير الاقتصادية"), and Al Harazat says "بيارق التوفيق". Each card shows its branch's name.
- **Phone**: for example `+9661XXXXXXXX`. Shows the branch's "Call us" button, and the chat helper gives the number with a call button.
- **WhatsApp**: international digits only, for example `9665XXXXXXXX`. Shows the branch's WhatsApp button, turns on "Send order" for that branch, and adds a "Message this branch" button to the chat helper's answers about it. Until at least one branch has one, the cart and the chat say WhatsApp ordering is coming soon.
- **Opening hours**: one row per group of days, `[{ "days_ar": "…", "days_en": "…", "time_ar": "…", "time_en": "…" }]`. Shown on the card and in the chat. Ahmed then writes the short form for search engines in `openingHours`, for example `["Sa-Th 07:00-23:00", "Fr 16:00-23:00"]`.
- **Address**: shown on the card and in the chat's "where is it?" answer.
- **Google Maps link**: Google Maps → the branch's pin → Share → Copy link. Shows "Open in Google Maps" on the card and in the chat.
- **Embed link**: Ahmed makes it from the share link (Share → Embed a map → only the link inside `src="…"`). Replaces the "Map coming soon" box.
- **Delivery**: `delivers` is `true` or `false`. With `true`, the order form offers delivery for that branch and the chat says it delivers, with the details. With `false`, the chat says orders are picked up at the branch.

## For the whole store

- **Social media accounts** (Family) → `social` in `src/data/store.json`: which networks, their links, and whether Bayariq Al Tawfiq has its own accounts.

## Content and photos

Photos: WebP, under 200 KB each. A free way to convert them is [squoosh.app](https://squoosh.app) (WebP, quality about 75, width about 800 px). `npm run check` fails if a photo is missing, too big or not WebP; a photo that fails to load falls back to the category icon.

- **Logo** (Family) → `public/images/`. Replaces the saffron bag mark and the text logo in `src/components/Header.jsx`, and the bag in `public/favicon.svg`; then `npm run images` remakes the share image and the iPhone icon. SVG is best, PNG or WebP also works. Send the Bayariq Al Tawfiq logo too, if it has its own.
- **Store photo for the hero** (Family): the front or inside of one branch → `public/images/`. Used in `src/sections/Hero.jsx` in place of the four icon tiles on wide screens.
- **Real product list** (Family) → `src/data/products.json` (12 sample products now). For each product: Arabic and English name, category, price (or none for "price on request"), unit or size, featured or not, in stock or not. The search, the cart and the chat's "do you have…?" all use this list.
- **Real categories** (Family) → `src/data/categories.json` (6 sample categories now): the store's sections in Arabic and English. Claude picks or draws a matching icon for each (`carrot`, `milk`, `bread`, `jar`, `cup` and `spray` exist now, in `src/components/Icons.jsx`).
- **Product photos** (Family) → `public/images/products/`, then each product's `image`, for example `"images/products/milk.webp"`. Square photos look best.
- **Current offers** (Family) → `src/data/offers.json` (empty now). For each offer: Arabic and English title and details, last day (`YYYY-MM-DD`), and an optional photo in `public/images/offers/`. The offers section and the chat's "current offers" show them until their last day.

## Decisions

- **Palette from the logo** (Ahmed) → the color tokens in `src/index.css` (`@theme`, and the dark versions under `:root.dark`), `theme-color` in `index.html` and the two colors in `public/favicon.svg`; then `npm run images`. Until then: off-white `#f8f6f1`, deep navy `#14284b` and saffron `#f4b41a`.
  Recommended: once the logo arrives, take the navy (30%) and the saffron (10%) from its two main colors and keep the off-white. `npm run check` then confirms every text still passes AA contrast.
- **"Why shop with us" points** (Family) → `highlights` in `src/i18n/ar.json` and `en.json`: "أسعار اقتصادية", "اطلب بسهولة" and "فرع قريب منك".
  Recommended: keep all three. "أسعار اقتصادية" matches the store's name ("الاقتصادية"), if the family is comfortable saying it.
- **Are products, prices and offers the same in every branch?** (Family) The site has one product list and one offers list for all four branches.
  Recommended: yes, one shared list for version 1. The cart calls its total an estimate, and the branch confirms the final price on WhatsApp. If they really differ, the data needs a price per branch, or a "this branch only" field on offers.
- **How the two store names show** (Family) → the site is called "أسواق بيارق الخير الاقتصادية" in the header, hero and footer; each branch card shows its own name, so Al Harazat says "بيارق التوفيق"; the search description names both.
  Recommended: keep it as it is.
- **Offer dates: Gregorian or Hijri** (Family) → `dateLocale` in `src/i18n/ar.json`. Gregorian now ("30 نوفمبر 2026").
  Recommended: Gregorian. The end dates are stored that way, and one calendar avoids confusion.
- **Search and share text** (Ahmed) → `description` and `og:description` in `index.html`: "أسواق بيارق الخير الاقتصادية: أربعة فروع في جدة، في الحمدانية وكيلو 14 والمحاميد، وبيارق التوفيق في الحرازات. تصفّح منتجاتنا وعروضنا، وأرسل طلبك عبر واتساب."
  Recommended: keep it. It names both stores and all four districts.
- **Chat helper's name and example question** (Ahmed) → `chat` in `src/i18n/ar.json` and `en.json`: "مساعد بيارق" / "Bayariq helper", and the example "هل عندكم حليب؟" in its greeting and in the tour's last step.
  Recommended: keep both. If milk is not on the real product list, change the example (in `chat.greeting` and `tour.steps.chat`) to a product that is.
- **First-visit tour** (Ahmed) → the 7 steps in `src/data/tour.json` and their texts under `tour` in `src/i18n/ar.json` and `en.json`: menu, language and dark mode, search and categories, Add to cart, cart and WhatsApp order, branches, chat helper. It shows once per browser, and "take the tour again" is in the chat and the footer.
  Recommended: keep the steps and the wording. Read the Arabic once on a phone, and shorten any step that feels long.
- **Own domain (optional)** (Family, because it costs money) → for example `bayariq.sa`. Then Ahmed changes `website` in `src/data/store.json`, the four full URLs in `index.html` and `base` in `vite.config.js`, and sets the domain in GitHub → Settings → Pages.
  Recommended: not for version 1. Launch on the free GitHub address and decide later.
