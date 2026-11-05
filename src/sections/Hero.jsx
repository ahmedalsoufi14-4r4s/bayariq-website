import Circle from '../components/Circle.jsx'
import { CategoryIcon, MapPinIcon } from '../components/Icons.jsx'
import { BUTTON_ACCENT, BUTTON_ON_MAIN } from '../components/styles.js'
import WaveDivider from '../components/WaveDivider.jsx'
import categories from '../data/categories.json'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'

// The hero moves a bit more than the rest of the page: its two glows (a saffron one and a
// light one) swing further and faster than the circles behind the page (see Circle.jsx).
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
    color: '--hero-circle-light',
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
// overlapping squares), a shape often seen in Saudi design, which slowly slides (stars-pan in
// index.css). The pattern is one star (3rem) bigger than the hero on the top and left, so the
// slide never shows an empty edge. All CSS gradients and inline SVG, nothing to download.
// mask-b-from-60% fades all of it out toward the bottom, so it meets the navy wave under the
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
      <svg className="stars-pan absolute -top-12 -left-12 h-[calc(100%+3rem)] w-[calc(100%+3rem)] opacity-8">
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

// On wider screens: the first four category icons on floating tiles, one of them saffron.
// The tiles bob gently, one after another (tile-bob in index.css, with a different delay each).
// Under the pointer a tile grows a little and its icon spins.
// NEEDS-AHMED: a photo of one of the branches can take this place.
function HeroArt() {
  return (
    <div aria-hidden="true" className="hidden grid-cols-2 gap-5 md:grid">
      {categories.slice(0, 4).map((category, index) => (
        <span
          key={category.id}
          style={{ animationDelay: `${index * -0.6}s` }}
          className={`tile-bob group flex size-28 items-center justify-center rounded-3xl shadow-xl shadow-black/20 transition-[scale] duration-300 ease-out motion-safe:hover:scale-110 ${
            index === 1
              ? 'bg-accent text-on-accent'
              : 'bg-on-main/10 ring-1 ring-on-main/15'
          } ${index % 2 === 1 ? 'translate-y-10' : ''}`}
        >
          <CategoryIcon
            name={category.icon}
            className="size-12 motion-safe:group-hover:animate-spin-once"
          />
        </span>
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

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-18 md:grid-cols-[1fr_auto] md:pt-24 md:pb-20">
          <div>
            <h1
              id="hero-title"
              className="max-w-2xl text-3xl leading-snug font-bold md:text-5xl"
            >
              {localize(store, 'name')}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-on-main/80">
              {t.hero.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#products" className={`${BUTTON_ACCENT} px-6 py-3`}>
                {t.hero.browse}
              </a>
              {/* With four branches there is no single number to call, so this leads to the branch list. */}
              <a href="#contact" className={`${BUTTON_ON_MAIN} px-5 py-3`}>
                <MapPinIcon className="size-5" />
                {t.hero.branches}
              </a>
            </div>
          </div>
          <HeroArt />
        </div>
      </section>
      <WaveDivider flip />
    </>
  )
}

export default Hero
