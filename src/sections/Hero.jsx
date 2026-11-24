import Circle from '../components/Circle.jsx'
import { MapPinIcon } from '../components/Icons.jsx'
import Photo from '../components/Photo.jsx'
import { reveal } from '../components/reveal.js'
import { BUTTON_ACCENT, BUTTON_ON_MAIN } from '../components/styles.js'
import WaveDivider from '../components/WaveDivider.jsx'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'

// The hero moves a bit more than the rest of the page: its two glows (a red one and a dark
// green shade) swing further and faster than the circles behind the page (see Circle.jsx).
// Both make the green a little darker, never lighter, so the white text stays AA (index.css).
const HERO_CIRCLES = [
  {
    color: '--hero-circle-accent',
    size: '30rem',
    top: '-12rem',
    start: '55%',
    x: '24rem',
    y: '12rem',
    xTime: '5s',
    yTime: '4s',
    grow: true,
  },
  {
    color: '--hero-circle-shade',
    size: '32rem',
    top: '-2rem',
    start: '-12rem',
    x: '28rem',
    y: '10rem',
    xTime: '6s',
    yTime: '4.5s',
    grow: true,
  },
]

// Depth behind the text: the two glows and a faint pattern of eight-pointed stars (two
// overlapping squares, drawn in a darker green: see-through black lines), a shape often seen in
// Saudi design, which slowly slides (stars-pan in
// index.css). The pattern is one star (3rem) bigger than the hero on the top and left, so the
// slide never shows an empty edge. All CSS gradients and inline SVG, nothing to download.
// mask-b-from-60% fades all of it out toward the bottom, so it meets the green wave under the
// hero without a hard edge.
// The text itself never animates, so it shows right away (Lighthouse measures when it appears).
function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 mask-b-from-60%"
    >
      {HERO_CIRCLES.map((circle) => (
        <Circle key={circle.color} {...circle} />
      ))}
      <svg className="stars-pan absolute -top-12 -left-12 h-[calc(100%+3rem)] w-[calc(100%+3rem)] text-black opacity-15">
        <defs>
          <pattern
            id="hero-stars"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M16 16h16v16H16zM24 12.7 35.3 24 24 35.3 12.7 24Z"
              fill="none"
              stroke="currentColor"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-stars)" />
      </svg>
    </div>
  )
}

// The store's own photos: the Al Mahamid storefront across the top and two views from inside
// the branch under it. id is the key of the photo's alt text in the "photos" texts.
const HERO_PHOTOS = [
  {
    id: 'storefront',
    src: 'images/al-mahamid-storefront.webp',
    width: 1080,
    height: 350,
    span: 'col-span-2',
  },
  {
    id: 'produce',
    src: 'images/al-mahamid-produce.webp',
    width: 520,
    height: 293,
  },
  { id: 'aisle', src: 'images/al-mahamid-aisle.webp', width: 520, height: 293 },
]

// The photos in white frames that bob gently, one after another (tile-bob in index.css, with a
// different delay each). Under the pointer a frame grows a little and its photo zooms.
// The frames fade and rise in like the cards (reveal), while the text above them is there right
// away. The wrapper does the fading, because tile-bob already uses the frame's own animation.
function HeroPhotos() {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {HERO_PHOTOS.map(({ id, src, width, height, span = '' }, index) => (
        <div key={id} ref={reveal} className={`reveal ${span}`}>
          <div
            style={{ animationDelay: `${index * -0.8}s` }}
            className="tile-bob group overflow-hidden rounded-2xl bg-on-main p-1 shadow-xl shadow-black/20 transition-[scale] duration-300 ease-out motion-safe:hover:scale-104"
          >
            <div className="overflow-hidden rounded-xl">
              <Photo
                src={src}
                alt={t.photos[id]}
                width={width}
                height={height}
                className="h-auto w-full transition-[scale] duration-300 ease-out motion-safe:group-hover:scale-106"
                fallback={null}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Hero() {
  const { t, localize } = useLanguage()

  return (
    // The wave under the hero sits outside it, on the page, so the moving background shows around it.
    <>
      {/* isolate starts a new layer stack, so -z-10 puts the backdrop behind the text but not behind the page. */}
      <section
        id="home"
        aria-labelledby="hero-title"
        className="surface-main relative isolate overflow-hidden"
      >
        <HeroBackdrop />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-18 lg:grid-cols-[1fr_32rem] lg:gap-12 lg:pt-20 lg:pb-20">
          <div>
            <h1
              id="hero-title"
              className="max-w-2xl text-3xl leading-snug font-bold md:text-5xl"
            >
              {localize(store, 'name')}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-on-main">
              {t.hero.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {/* The white ring sets the red button apart from the green hero. */}
              <a
                href="#products"
                className={`${BUTTON_ACCENT} px-6 py-3 ring-2 ring-on-main`}
              >
                {t.hero.browse}
              </a>
              {/* With several branches there is no single number to call, so this leads to the branch list. */}
              <a href="#contact" className={`${BUTTON_ON_MAIN} px-5 py-3`}>
                <MapPinIcon className="size-5" />
                {t.hero.branches}
              </a>
            </div>
          </div>
          <HeroPhotos />
        </div>
      </section>
      <WaveDivider flip />
    </>
  )
}

export default Hero
