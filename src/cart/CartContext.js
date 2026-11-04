import { createContext, useContext } from 'react'

export const CartContext = createContext(null)

// Any component can call useCart() to read the cart and change it.
export function useCart() {
  return useContext(CartContext)
}
