// Scroll-in animation: an element with the "reveal" class fades and rises in the first time
// it scrolls into view. The animation itself is in index.css; this file only says when.
// An IntersectionObserver tells us when an element enters the screen, without running
// code on every scroll. One observer watches all the elements.

// Elements that come into view together (like a row of cards) start 60 ms apart, up to 240 ms.
const STAGGER_MS = 60
const MAX_STAGGER_MS = 240

let observer = null

function showEntries(entries) {
  const entering = entries.filter((entry) => entry.isIntersecting)
  entering.forEach((entry, index) => {
    const element = entry.target
    const delay = Math.min(index * STAGGER_MS, MAX_STAGGER_MS)
    element.style.setProperty('--reveal-delay', `${delay}ms`)
    // index.css starts the animation when this attribute appears.
    element.dataset.revealed = 'true'
    observer.unobserve(element)
  })
}

// Made on first use. The negative bottom margin waits until the element is
// 40 px inside the screen, so the animation is not over before anyone sees it.
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(showEntries, {
      rootMargin: '0px 0px -40px 0px',
    })
  }
  return observer
}

// A ref callback, used like this: <li ref={reveal} className="reveal">.
// React calls it with the element when it is added to the page, and calls the
// function it returns when the element is removed (for example by a filter).
export function reveal(element) {
  getObserver().observe(element)
  return () => getObserver().unobserve(element)
}
