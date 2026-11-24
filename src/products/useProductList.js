import { useState } from 'react'
import categories from '../data/categories.json'
import { filterProducts } from '../lib/productSearch.js'
import { useProducts } from './ProductsContext.js'

// How many cards show at first, and how many "show more" adds. Drawing the thousands of
// products of a category at once would make the page slow.
const PAGE_SIZE = 24

// The product list of the products section: which products show for the chosen category and the
// search text, and the loading behind it.
export function useProductList() {
  const {
    status,
    retry,
    productCount,
    byCategory,
    products,
    isComplete,
    loadCategory,
    loadAll,
  } = useProducts()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [hasFailed, setHasFailed] = useState(false)

  // Loads what a choice needs: the category's products, or every category for a search in all.
  async function load(nextCategory, nextQuery) {
    setHasFailed(false)
    try {
      if (nextCategory !== 'all') await loadCategory(nextCategory)
      else if (nextQuery.trim() !== '') await loadAll()
    } catch {
      setHasFailed(true)
    }
  }

  function chooseCategory(id) {
    setCategory(id)
    setLimit(PAGE_SIZE)
    load(id, query)
  }

  function search(text) {
    setQuery(text)
    setLimit(PAGE_SIZE)
    load(category, text)
  }

  function showAll() {
    setCategory('all')
    setQuery('')
    setLimit(PAGE_SIZE)
    load('all', '')
  }

  function tryAgain() {
    if (status === 'failed') retry()
    load(category, query)
  }

  const isSearching = query.trim() !== ''
  const isBrowsingAll = category === 'all' && !isSearching
  // Everything that matches so far. Not stored in state: worked out again on every render.
  const found = filterProducts(
    category === 'all' ? products : (byCategory[category] ?? []),
    query,
  )
  const total = isBrowsingAll ? productCount : found.length

  // Without a category or a search, "show more" goes on with the next category when the loaded
  // products run out.
  async function showMore() {
    const nextLimit = limit + PAGE_SIZE
    setLimit(nextLimit)
    if (!isBrowsingAll || found.length >= nextLimit) return
    const next = categories.find(({ id }) => !byCategory[id])
    if (next) await load(next.id, '')
  }

  let isLoading = status === 'loading'
  if (category !== 'all') isLoading = !byCategory[category]
  else if (isSearching) isLoading = !isComplete

  return {
    category,
    query,
    visible: found.slice(0, limit),
    total,
    hasMore: total > limit || (isBrowsingAll && total > found.length),
    isLoading: isLoading && !hasFailed && status !== 'failed',
    hasFailed: hasFailed || status === 'failed',
    chooseCategory,
    search,
    showAll,
    showMore,
    tryAgain,
  }
}
