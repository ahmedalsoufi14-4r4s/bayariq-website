// The store's mark from its logo (photos/logo.png), redrawn as a clean SVG: a red shopping bag
// with white bubbles, and a green leaf in front of it with a white outline and veins.
// It uses the exact logo colors (--color-logo-* in index.css), which stay the same in dark
// mode. The white parts need a white background, so put it on a white plate (bg-logo-paper).
// public/favicon.svg draws the same shapes, so change both together.
// aria-hidden hides it from screen readers, because the store name is always next to it.
function LogoMark({ className }) {
  return (
    <svg viewBox="4 3 88 99" aria-hidden="true" className={className}>
      {/* The bag: its handle, the knot where the handle meets the bag, and the body. */}
      <path
        d="M26.75 36V22.5a15.25 13.75 0 0 1 30.5 0V36"
        fill="none"
        strokeWidth="6.5"
        className="stroke-logo-red"
      />
      <circle cx="42" cy="36" r="4.5" className="fill-logo-red" />
      <path
        d="M6.5 34.5H77L67.3 96.6Q66.9 99 64.5 99H22.1Q19.7 99 19.4 96.6Z"
        className="fill-logo-red"
      />
      {/* Three white bubbles on the bag. */}
      <g className="fill-logo-paper">
        <ellipse cx="18.5" cy="45" rx="2.3" ry="3.2" />
        <circle cx="27.5" cy="49" r="3.9" />
        <ellipse cx="23.5" cy="65" rx="5.6" ry="7.6" />
      </g>
      {/* The leaf. paint-order="stroke" draws its white outline under the green, so only the
          outer half of the outline shows and the leaf keeps its size. */}
      <path
        d="M85.8 35.5C84 60 75 81 61.5 88.2C54.5 91.8 46.5 91.6 41.5 90.4L36.6 100H33.6C35 80 38.5 58.5 51 46.5C60 38 72.5 35.8 85.8 35.5Z"
        strokeWidth="3.2"
        strokeLinejoin="round"
        paintOrder="stroke"
        className="fill-logo-green stroke-logo-paper"
      />
      {/* The leaf's two white veins. */}
      <g fill="none" strokeLinecap="round" className="stroke-logo-paper">
        <path d="M39.5 81.5Q51 69 66.5 59.5" strokeWidth="2" />
        <path d="M79.8 55Q77 74 62 83" strokeWidth="1.4" />
      </g>
    </svg>
  )
}

export default LogoMark
