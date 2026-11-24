// The cart items are a list of { product, quantity }, in the order the products were added.
// Each keeps a copy of its product, because the product files are loaded one category at a time
// and the cart must show right away when the visitor comes back.
// Every function returns a new list instead of changing the old one,
// because React only notices a change when it gets a new list.

// The parts of a product that the cart and the order message need.
function copyProduct({ id, name, category, price, unit }) {
  return { id, name, category, price, unit }
}

export function getQuantity(items, productId) {
  return items.find((item) => item.product.id === productId)?.quantity ?? 0
}

export function addItem(items, product) {
  const quantity = getQuantity(items, product.id)
  return quantity > 0
    ? setQuantity(items, product.id, quantity + 1)
    : [...items, { product: copyProduct(product), quantity: 1 }]
}

// A quantity of 0 or less removes the product.
export function setQuantity(items, productId, quantity) {
  if (quantity <= 0) return removeItem(items, productId)
  return items.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item,
  )
}

export function removeItem(items, productId) {
  return items.filter((item) => item.product.id !== productId)
}

// The cart as it shows: once a product's category has loaded, its saved copy is replaced by the
// product of today (with today's price), and a product that is no longer in it is left out.
// byCategory is { dairy: [products], ... }, with only the categories loaded so far.
export function getCartLines(items, byCategory) {
  return items
    .map(({ product, quantity }) => {
      const loaded = byCategory[product.category]
      const current = loaded
        ? loaded.find((item) => item.id === product.id)
        : product
      return { product: current, quantity }
    })
    .filter((line) => line.product)
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
