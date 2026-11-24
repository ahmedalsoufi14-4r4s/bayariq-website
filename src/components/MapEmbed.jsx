import { useEffect, useRef, useState } from 'react'

// A Google map. The map brings hundreds of kilobytes of Google's own code, so its <iframe> is only
// added once the visitor is close to it. (loading="lazy" alone starts much earlier: as soon as
// the map is within a few screens.) Until then a box of the same size keeps its place.
function MapEmbed({ src, title, className }) {
  const boxRef = useRef(null)
  const [isNear, setIsNear] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setIsNear(true)
        observer.disconnect()
      },
      { rootMargin: '300px' },
    )
    observer.observe(boxRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={boxRef}
      className={`overflow-hidden rounded-xl bg-main-soft ${className}`}
    >
      {isNear && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="size-full border-0"
        />
      )}
    </div>
  )
}

export default MapEmbed
