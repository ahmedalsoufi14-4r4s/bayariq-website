# What the site still needs

Everything else is on the site. Until an item below is filled in, the site hides it or says "قريبًا / Coming soon". Nothing made up ever appears.

**Who:** **Family** = the store owners have it or decide it. **Ahmed** = Ahmed (with Claude) does it. Ahmed puts every Family answer into the files.

## Photos and logo

- **Photo of the Kilo 14 branch** (Family): the storefront with its sign, taken by the family. Put the original in `photos/kilo-14/`, add it to the list in `scripts/make-photos.js`, run `npm run images`, then set the branch's `photo` in `src/data/store.json`. Its card says "صورة الفرع: قريبًا" until then.
- **Photo of the Al Hamdaniyah branch** (Family): the same, in `photos/al-hamdaniyah/`.
- **Original logo file** (Family) → `photos/logo.png`. The logo on the site is the real one, but from a small, blurry copy. The original from whoever designed it is best as SVG, PDF or AI, otherwise a PNG at least 2000 px wide. Then run `npm run images`.

## Product photos

- **Check the sample** (Ahmed) → `photo-check.md`: the 18 featured products, 20 photos to compare with the shelf, and the counts by category. No more photos are added until you confirm.
- **A POS export with barcodes** (Family, Ahmed is asking): `الاصناف.xlsx` has no barcode column. When it arrives, photos are matched by exact barcode first, so many more products can get one.
- **Photos of 16 featured products** (Family): the ones without a photo in `photo-check.md`. Best: a phone photo of each on a white background, or the pictures the suppliers' sales reps give to shops.
- **Permission from Rabea Tea and Abu Kass** (Family): their photos of شاي ربيع إكسبرس (25 خيط, id 1090535, [page](https://rabea.com/product/rabea-express-tea/)) and رز ابو كاس مزة 5 كيلو (id 1090253, [page](https://www.abukass.com/en/product/20237/abu-kass-mazza)) are all rights reserved, so they were removed and the category drawings show instead. With a yes by email or WhatsApp from each company, the photos can come back.
- **Permission from other suppliers** (Family): Almarai, Puck, Tide (P&G) and Fine forbid using their website photos without written permission, so none are used.

## Content

- **Social media accounts** (Family) → `social` in `src/data/store.json`: which networks and their links. The footer and the chat helper say "coming soon" until then.
- **Current offers** (Family) → `src/data/offers.json`: for each offer the title and details in Arabic and English, the last day (`YYYY-MM-DD`) and an optional photo. The offers section and the chat helper say "coming soon" until then.

## Products to check

- **The 200 items of the "للمراجعة" sheet** (Family): 129 with the same name but different prices, and 71 with a very high price. All 200 are hidden (188 supermarket items and 12 Nafhat Bun items, which are not on the site anyway). Their ids are in `data/hidden-products.json`, and their names and prices in the sheet of the Excel file in `data/`. For each one: the right name and price, or "leave it out".
  Ahmed then corrects it in `data/supermarket.json`, deletes its id from `data/hidden-products.json` and runs `npm run products`.
- **`attara-moves.md`** (Ahmed): the 273 products moved into "عطارة: بهارات ومكسرات وأعشاب". To undo one, delete its id from `data/attara-moves.json` and run `npm run products`.
- **`price-check.md`** (Family): 2,350 products whose name has a pack count but whose price looks like the price of one piece. The first list (554 packs of 2 to 12 pieces) matters most. They are not hidden.

## Later

- **Turn the Al Harazat branch (بيارق التوفيق) back on** (Family, then Ahmed): the family decides on delivery and sends a photo of the storefront. Ahmed then sets `"active": true`, `delivers` and `photo` for `al-harazat` in `src/data/store.json`, and adds the branch to the two descriptions in `index.html`. Everything else (card, order form, chat, search engines) follows on its own.
