import { useCart } from './CartContext.js'

// role="status" makes screen readers read this text whenever it changes, without moving focus.
// An open modal dialog hides the rest of the page from screen readers,
// so the page and each dialog render their own copy.
function CartAnnouncer() {
  const { announcement } = useCart()

  return (
    <p role="status" className="sr-only">
      {announcement}
    </p>
  )
}

export default CartAnnouncer
