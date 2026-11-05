import { useEffect } from 'react'

// The page background is never fully still: a large navy shape and a saffron one drift slowly
// behind everything (drift, shape-main and shape-accent in index.css). They show on the
// off-white parts of the page; the navy bands and the cards cover them.
// fixed keeps them in the window while the page scrolls past, and -z-10 puts them behind it.
// h-lvh is the window's height with the phone's address bar hidden, so the layer still
// reaches the bottom when the bar slides away.
// [--drift-x:14vw] is a Tailwind class that sets a CSS variable: how far the shape travels
// (drift-x, drift-y) and how long one slow loop takes (drift-time).
function PageBackdrop() {
  // Pauses the drifting while the tab is in the background, so it uses no battery there.
  useEffect(() => {
    function updateTabState() {
      document.documentElement.toggleAttribute(
        'data-tab-hidden',
        document.hidden,
      )
    }
    document.addEventListener('visibilitychange', updateTabState)
    return () =>
      document.removeEventListener('visibilitychange', updateTabState)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden"
    >
      <div className="drift shape-main absolute -start-[20vmax] -top-[15vmax] size-[70vmax] [--drift-time:34s] [--drift-x:14vw] [--drift-y:30vh]" />
      <div className="drift shape-accent absolute -end-[20vmax] -bottom-[20vmax] size-[60vmax] [--drift-time:28s] [--drift-x:-16vw] [--drift-y:-25vh]" />
    </div>
  )
}

export default PageBackdrop
