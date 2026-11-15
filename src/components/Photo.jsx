import { useState } from 'react'

// How the site shows a photo from public/: lazy-loaded, with alt text, and with
// `fallback` shown instead when there is no photo or it fails to load
// (for example because of a wrong file name in a data file).
// width and height only give the photo's shape, so the page keeps room for it while it loads.
// Until the photo has loaded, its place is a light navy box that softly pulses (a skeleton),
// so the visitor sees that something is coming. animate-pulse only changes opacity.
function Photo({ src, alt, width, height, className, fallback }) {
  // Remembers which photo failed, so a different photo in the same spot still gets a try.
  const [failedSrc, setFailedSrc] = useState(null)
  // The same for the photo that has loaded, so a new photo shows the skeleton again.
  const [loadedSrc, setLoadedSrc] = useState(null)

  if (!src || src === failedSrc) return fallback

  const skeleton =
    src === loadedSrc ? '' : 'bg-main-soft motion-safe:animate-pulse'

  return (
    <img
      // Photos go in public/, so their path must start with the site's base path.
      src={import.meta.env.BASE_URL + src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoadedSrc(src)}
      onError={() => setFailedSrc(src)}
      className={`${className} ${skeleton}`}
    />
  )
}

export default Photo
