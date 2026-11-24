import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import categories from '../data/categories.json'
import { joinProducts, prepareProducts } from '../lib/productSearch.js'
import { ProductsContext } from './ProductsContext.js'

// The product files in public/data/ (made by `npm run products`) are fetched when they are
// needed, so they are not part of the page's JavaScript.
async function fetchJson(file) {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${file}`)
  if (!response.ok) throw new Error(`${file}: ${response.status}`)
  return response.json()
}

// Loads the products. The page starts with one small file, the catalog: how many products there
// are, and the featured ones. The others come one category at a time: when the visitor opens a
// category, and one after another for a search in all of them. Each file is loaded only once.
function ProductsProvider({ children }) {
  const [catalog, setCatalog] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading', 'ready' or 'failed'
  const [attempt, setAttempt] = useState(1)
  const [byCategory, setByCategory] = useState({})
  // Category id -> the promise of its products, so a second request waits for the first one.
  const requests = useRef({})

  // Runs again when retry() changes the attempt.
  useEffect(() => {
    let cancelled = false
    fetchJson('catalog.json')
      .then((data) => {
        if (cancelled) return
        setCatalog({ ...data, featured: prepareProducts(data.featured) })
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('failed')
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  function retry() {
    setStatus('loading')
    setAttempt(attempt + 1)
  }

  // Gives the products of one category. When it fails, the next call tries again.
  const loadCategory = useCallback((id) => {
    requests.current[id] ??= fetchJson(`products/${id}.json`)
      .then((list) => {
        const products = prepareProducts(list)
        setByCategory((current) => ({ ...current, [id]: products }))
        return products
      })
      .catch((error) => {
        delete requests.current[id]
        throw error
      })
    return requests.current[id]
  }, [])

  const featured = useMemo(() => catalog?.featured ?? [], [catalog])

  // Loads the categories that are still missing, one after another, and gives every product.
  const loadAll = useCallback(async () => {
    const all = {}
    for (const { id } of categories) all[id] = await loadCategory(id)
    return joinProducts(featured, all)
  }, [loadCategory, featured])

  // useMemo keeps the joined list until something new has loaded, instead of making a list of
  // thousands of products again on every render.
  const products = useMemo(
    () => joinProducts(featured, byCategory),
    [featured, byCategory],
  )

  const value = {
    status,
    retry,
    productCount: catalog?.productCount ?? 0,
    featured,
    byCategory,
    products,
    loadCategory,
    loadAll,
    isComplete: categories.every(({ id }) => byCategory[id]),
  }

  return <ProductsContext value={value}>{children}</ProductsContext>
}

export default ProductsProvider
