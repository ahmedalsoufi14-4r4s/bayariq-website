import { useCallback, useEffect, useRef, useState } from 'react'
import TourGuide from '../components/TourGuide.jsx'
import tourSteps from '../data/tour.json'
import { useProducts } from '../products/ProductsContext.js'
import { TourContext } from './TourContext.js'

// GitHub Pages sites of the same user share one localStorage, so the key has a unique prefix.
// playwright.config.js saves the same key, so the browser tests start as returning visitors.
const STORAGE_KEY = 'bayariq-tour-seen'

// True when this browser has already seen the tour. When storage is blocked the tour cannot
// be remembered, so it does not start by itself: it would come back on every visit.
function hasSeenTour() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return true
  }
}

function rememberTourSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, 'yes')
  } catch {
    // Storage is blocked: the tour just cannot be remembered.
  }
}

// Shows the tour by itself on the first visit, and lets the chat helper and the footer
// start it again (startTour from useTour()).
function TourProvider({ children }) {
  const { status } = useProducts()
  // The first products are on the page, or could not be loaded: either way, nothing more to wait for.
  const isPageReady = status !== 'loading'
  // How many tours have started. Each one gets a fresh TourGuide (its key), from step one.
  const [run, setRun] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState([])
  // Where focus and the page were before the tour, to go back there afterwards.
  const before = useRef(null)

  // returnFocusTo is the element that gets focus back when the tour ends, like the footer
  // link that started it. useCallback keeps the same function on every render, so the
  // first-visit effect below runs only once.
  const startTour = useCallback((returnFocusTo) => {
    // Only the steps whose element is on the page: "Add to cart" needs a product.
    const available = tourSteps.filter((step) =>
      document.querySelector(step.target),
    )
    if (available.length === 0) return
    before.current = { element: returnFocusTo, scrollY: window.scrollY }
    rememberTourSeen()
    setSteps(available)
    setIsRunning(true)
    setRun((current) => current + 1)
  }, [])

  // After the tour the page scrolls back to where the visitor was, and focus goes back.
  function endTour() {
    setIsRunning(false)
    const { element, scrollY } = before.current
    window.scrollTo({ top: scrollY })
    element?.focus({ preventScroll: true })
  }

  // The first visit: the tour starts by itself once the first products and the web font have
  // loaded, so the page has its final layout and every step has its element. It is remembered
  // right away, so it never shows twice.
  useEffect(() => {
    if (!isPageReady || hasSeenTour()) return
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) startTour(null)
    })
    return () => {
      cancelled = true
    }
  }, [startTour, isPageReady])

  return (
    <TourContext value={{ startTour, isRunning }}>
      {children}
      {run > 0 && <TourGuide key={run} steps={steps} onEnd={endTour} />}
    </TourContext>
  )
}

export default TourProvider
