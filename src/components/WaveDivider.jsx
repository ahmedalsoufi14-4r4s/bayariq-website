// A soft wave across the full width, where a navy band meets the off-white page.
// It is filled with the color of the section next to the band (fill-canvas), so that
// section's edge seems to curve into the band. flip turns it over for the top edge of a band.
// Its height is fixed in CSS, so it never moves anything around it (no layout shift).
function WaveDivider({ flip = false, className = '' }) {
  return (
    <svg
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-6 w-full md:h-12 ${flip ? 'rotate-180' : ''} ${className}`}
    >
      <path d="M0 48h1440V18C1200 46 960 46 720 24S240-4 0 18Z" />
    </svg>
  )
}

export default WaveDivider
