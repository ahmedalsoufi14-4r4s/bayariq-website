import { useEffect } from 'react'
import Circle from './Circle.jsx'

// The page background is never still: soft navy and saffron circles of different sizes float
// across it, each on its own path (see Circle.jsx). They show on the off-white parts of the
// page; the navy bands and the cards cover them. One swing takes 6 to 10 s, so one loop takes
// 12 to 20 s, and the circles cover a wide area (vmax is a share of the screen's longer side).
const CIRCLES = [
  {
    color: '--circle-main',
    size: '42vmax',
    top: '-12%',
    start: '-12%',
    x: '40vmax',
    y: '30vh',
    xTime: '9s',
    yTime: '7s',
    grow: true,
  },
  {
    color: '--circle-accent',
    size: '28vmax',
    top: '15%',
    start: '62%',
    x: '36vmax',
    y: '34vh',
    xTime: '7s',
    yTime: '9.5s',
  },
  {
    color: '--circle-main',
    size: '24vmax',
    top: '58%',
    start: '6%',
    x: '34vmax',
    y: '28vh',
    xTime: '8.5s',
    yTime: '6s',
    grow: true,
  },
  {
    color: '--circle-accent',
    size: '20vmax',
    top: '70%',
    start: '72%',
    x: '30vmax',
    y: '24vh',
    xTime: '6.5s',
    yTime: '8s',
    grow: true,
  },
  {
    color: '--circle-main',
    size: '32vmax',
    top: '30%',
    start: '34%',
    x: '44vmax',
    y: '20vh',
    xTime: '10s',
    yTime: '7.5s',
  },
]

// fixed keeps the circles in the window while the page scrolls past, and -z-10 puts them
// behind it. h-lvh is the window's height with the phone's address bar hidden, so the layer
// still reaches the bottom when the bar slides away.
function PageBackdrop() {
  // Pauses the background while the tab is in the background, so it uses no battery there.
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
      {CIRCLES.map((circle) => (
        <Circle key={`${circle.top} ${circle.start}`} {...circle} />
      ))}
    </div>
  )
}

export default PageBackdrop
