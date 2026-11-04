import { useState } from 'react'

// How the site shows a photo from public/: lazy-loaded, with alt text, and with
// `fallback` shown instead when there is no photo or it fails to load
// (for example because of a wrong file name in a data file).
// width and height only give the photo's shape, so the page keeps room for it while it loads.
function Photo({ src, alt, width, height, className, fallback }) {
  // Remembers which photo failed, so a different photo in the same spot still gets a try.
  const [failedSrc, setFailedSrc] = useState(null)

  if (!src || src === failedSrc) return fallback

  return (
    <img
      // Photos go in public/, so their path must start with the site's base path.
      src={import.meta.env.BASE_URL + src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={className}
    />
  )
}

export default Photo
