import { createContext, useContext } from 'react'

export const ProductsContext = createContext(null)

// Any component can call useProducts() to read the products loaded so far and to load more.
export function useProducts() {
  return useContext(ProductsContext)
}
