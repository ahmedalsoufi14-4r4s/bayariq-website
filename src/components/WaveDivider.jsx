// The moving edge of a navy band: three layered waves, a solid navy one in front that joins the
// band and two lighter navy ones behind it (--wave-middle and --wave-back in index.css). Each one
// slides sideways at its own speed and slowly swells up and down (.wave-layer in index.css), so
// the band's edge moves like the sea.
// Put it right above a band, or right below one with flip (turned over). It overlaps the band
// by 1px, so no thin line can show between them. Its height is fixed, so the motion never
// moves anything around it (no layout shift).
//
// Each path draws the same wave twice across its 2880-wide box, which the slide needs: the
// back wave rises and falls three times per screen width, the middle and front ones twice.
// fill-(--wave-back) fills the shape with the color in that CSS variable.
const LAYERS = [
  {
    color: 'fill-(--wave-back)',
    time: '12s',
    swell: '5s',
    path: 'M0 20C80 6 160 6 240 20C320 34 400 34 480 20C560 6 640 6 720 20C800 34 880 34 960 20C1040 6 1120 6 1200 20C1280 34 1360 34 1440 20C1520 6 1600 6 1680 20C1760 34 1840 34 1920 20C2000 6 2080 6 2160 20C2240 34 2320 34 2400 20C2480 6 2560 6 2640 20C2720 34 2800 34 2880 20V64H0Z',
  },
  {
    color: 'fill-(--wave-middle)',
    time: '9s',
    swell: '4s',
    direction: 'reverse',
    path: 'M0 28C120 46 240 46 360 28C480 10 600 10 720 28C840 46 960 46 1080 28C1200 10 1320 10 1440 28C1560 46 1680 46 1800 28C1920 10 2040 10 2160 28C2280 46 2400 46 2520 28C2640 10 2760 10 2880 28V64H0Z',
  },
  {
    color: 'fill-main',
    time: '7s',
    swell: '6s',
    path: 'M0 40C120 24 240 24 360 40C480 56 600 56 720 40C840 24 960 24 1080 40C1200 56 1320 56 1440 40C1560 24 1680 24 1800 40C1920 56 2040 56 2160 40C2280 24 2400 24 2520 40C2640 56 2760 56 2880 40V64H0Z',
  },
]

function WaveDivider({ flip = false }) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-12 overflow-hidden md:h-20 ${flip ? '-mt-px rotate-180' : '-mb-px'}`}
    >
      {LAYERS.map((layer) => (
        <div
          key={layer.color}
          className="wave-layer"
          style={{
            '--wave-time': layer.time,
            '--swell-time': layer.swell,
            '--wave-direction': layer.direction ?? 'normal',
          }}
        >
          <svg
            viewBox="0 0 2880 64"
            preserveAspectRatio="none"
            className={`block size-full ${layer.color}`}
          >
            <path d={layer.path} />
          </svg>
        </div>
      ))}
    </div>
  )
}

export default WaveDivider
