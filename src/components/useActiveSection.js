import { useEffect, useState } from 'react'

// Scrollspy: tells which page section is on screen, so the header can highlight its menu link.
// A section counts once its top has scrolled past a line 35% down the screen (well below the
// sticky header). The active one is the last section past that line, so a part of the page
// without a menu link (like "why shop with us") keeps the link of the section above it.
// The ids must be in page order.
const LINE = 0.35

export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id))

    function update() {
      const line = window.innerHeight * LINE
      const passed = sections.filter(
        (section) => section.getBoundingClientRect().top <= line,
      )
      setActiveId(passed.at(-1)?.id ?? ids[0])
    }

    // The observer watches a thin band at the line (rootMargin cuts 35% off the top of the
    // screen and 64% off the bottom) and calls update each time a section's edge crosses it.
    // So nothing runs on every scroll, only when the answer can change.
    const observer = new IntersectionObserver(update, {
      rootMargin: '-35% 0px -64% 0px',
    })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
