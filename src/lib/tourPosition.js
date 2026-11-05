// Where the first-visit tour (src/components/TourGuide.jsx) draws its spotlight and tooltip.
// Boxes are { x, y, width, height } in screen pixels, like getBoundingClientRect() gives,
// with x measured from the left in both languages.

// The spotlight: the element's box with some room around it.
export function spotlightBox(box, padding) {
  return {
    x: box.x - padding,
    y: box.y - padding,
    width: box.width + padding * 2,
    height: box.height + padding * 2,
  }
}

// The tooltip goes under the spotlight when it fits, otherwise above it, otherwise at the
// bottom of the screen. Sideways it is centered on the spotlight, but always at least
// `margin` from both edges, so it never leaves the screen, even on a 360px phone.
export function placeTooltip({
  spotlight,
  tooltip,
  screen,
  gap = 12,
  margin = 16,
}) {
  const centered = spotlight.x + spotlight.width / 2 - tooltip.width / 2
  const x = Math.max(
    margin,
    Math.min(centered, screen.width - margin - tooltip.width),
  )

  const below = spotlight.y + spotlight.height + gap
  const above = spotlight.y - gap - tooltip.height
  let y
  if (below + tooltip.height <= screen.height - margin) y = below
  else if (above >= margin) y = above
  else y = Math.max(margin, screen.height - margin - tooltip.height)

  return { x, y }
}
