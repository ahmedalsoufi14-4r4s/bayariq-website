// Phones have no pointer that hovers, so a card (.card in index.css) reacts to a tap instead:
// the tap sets data-tapped on the card for a moment, and index.css shows the same lift, tilt,
// glow and icon motion as on hover. One listener on the page handles every card, and the
// tour's spotlight too (its ring glows).
// pointerup only arrives for a real tap: when the finger scrolls the page, the browser sends
// pointercancel instead. Mouse clicks are left out, because the mouse already hovers.

const TAP_MS = 700
const timers = new WeakMap()

export function listenForCardTaps() {
  document.addEventListener('pointerup', (event) => {
    if (event.pointerType === 'mouse') return
    const card = event.target.closest('.card, .tour-spotlight')
    if (!card) return

    // Taking the attribute off and reading the card's size makes the browser notice the
    // change, so a second tap plays the icon motion again from the start.
    card.removeAttribute('data-tapped')
    card.getBoundingClientRect()
    card.setAttribute('data-tapped', '')
    clearTimeout(timers.get(card))
    timers.set(
      card,
      setTimeout(() => card.removeAttribute('data-tapped'), TAP_MS),
    )
  })
}
