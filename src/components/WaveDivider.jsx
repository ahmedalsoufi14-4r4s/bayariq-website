// A soft navy wave across the full width, on the page side of a navy band, so the band's edge
// seems to curve into the page. Put it right above a band, or right below one with flip
// (turned over). Around the wave the page shows through, with its drifting shapes.
// It overlaps the band by 1px (-mb-px, -mt-px), so no thin line can show between them.
// Its height is fixed in CSS, so it never moves anything around it (no layout shift).
function WaveDivider({ flip = false }) {
  return (
    <svg
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-6 w-full fill-main md:h-12 ${flip ? '-mt-px rotate-180' : '-mb-px'}`}
    >
      <path d="M0 48h1440V18C1200 46 960 46 720 24S240-4 0 18Z" />
    </svg>
  )
}

export default WaveDivider
