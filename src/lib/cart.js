// The cart items are an object of product id -> quantity, for example { 'fresh-milk': 2 }.
// Every function returns a new object instead of changing the old one,
// because React only notices a change when it gets a new object.

export function addItem(items, productId) {
  return { ...items, [productId]: (items[productId] ?? 0) + 1 }
}

// A quantity of 0 or less removes the product.
export function setQuantity(items, productId, quantity) {
  if (quantity <= 0) return removeItem(items, productId)
  return { ...items, [productId]: quantity }
}

export function removeItem(items, productId) {
  const rest = { ...items }
  delete rest[productId]
  return rest
}

// Joins the cart with the product data, in the order the products were added.
// Ids that are no longer in products.json are skipped.
export function getCartLines(items, products) {
  return Object.entries(items)
    .map(([id, quantity]) => ({
      product: products.find((product) => product.id === id),
      quantity,
    }))
    .filter((line) => line.product && line.quantity > 0)
}

export function getItemCount(lines) {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}

// Adds up the products that have a price. Rounding to 2 decimals removes
// floating point leftovers such as 107.85000000000001.
export function getEstimatedTotal(lines) {
  const total = lines.reduce(
    (sum, { product, quantity }) =>
      product.price === null ? sum : sum + product.price * quantity,
    0,
  )
  return Math.round(total * 100) / 100
}
