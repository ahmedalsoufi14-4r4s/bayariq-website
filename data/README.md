# Product data

The source of the product list on the site: the POS item export of 2026-11-22, supermarket section only. `npm run products` turns it into the small files the site loads from `public/data/`.

| File                     | Contents                                                                                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supermarket.json`       | 16,164 products: `id` (POS item number, a string with its leading zeros), `name`, `category`, `price` (SAR, VAT included), `unit` (`piece`, or `kg` for weighed items) |
| `catalog.json`           | The category names and counts of the export                                                                                                                           |
| `featured-products.json` | The ids of the featured products, in the order they show                                                                                                              |
| `attara-moves.json`      | The ids moved into the Attara category (`spices`). The readable list is `attara-moves.md`                                                                             |
| `hidden-products.json`   | The ids left out of the site: the 200 in the workbook's "للمراجعة" sheet, and 3 that are not supermarket products (two Nafhat Bun items and one named "deleted")       |
| `*.xlsx`                 | The POS workbook itself. Git-ignored, because the repository is public                                                                                                |

Which products have a photo is in `public/data/photo-credits.json` (a product id, its source and license per photo); the photos are in `public/images/products/`.

After changing any of these, run `npm run products` (and `npm run price-check` for `price-check.md`).

When the family has reviewed a hidden product, delete its id from `hidden-products.json`.

The Nafhat Bun products are kept in `extras/nafhat-bun/`. They are not part of the site.
