import { CategoryIcon, MapPinIcon } from '../components/Icons.jsx'
import { BUTTON_ACCENT, BUTTON_ON_MAIN } from '../components/styles.js'
import WaveDivider from '../components/WaveDivider.jsx'
import categories from '../data/categories.json'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'

// Depth behind the text: a saffron glow, a light navy glow, and a faint pattern of
// eight-pointed stars (two overlapping squares), a shape often seen in Saudi design.
// All CSS gradients and inline SVG, so nothing extra to download.
// The text itself never animates, so it shows right away (Lighthouse measures when it appears).
function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="absolute -end-48 -top-56 size-[32rem] rounded-full bg-radial from-accent/20 to-transparent to-70%" />
      <div className="absolute -start-48 -bottom-56 size-[34rem] rounded-full bg-radial from-on-main/15 to-transparent to-70%" />
      <svg className="absolute inset-0 size-full opacity-8">
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
// NEEDS-AHMED: a photo of one of the branches can take this place.
function HeroArt() {
  return (
    <div aria-hidden="true" className="hidden grid-cols-2 gap-5 md:grid">
      {categories.slice(0, 4).map((category, index) => (
        <span
          key={category.id}
          className={`flex size-28 items-center justify-center rounded-3xl shadow-xl shadow-black/20 ${
            index === 1
              ? 'bg-accent text-on-accent'
              : 'bg-on-main/10 ring-1 ring-on-main/15'
          } ${index % 2 === 1 ? 'translate-y-10' : ''}`}
        >
          <CategoryIcon name={category.icon} className="size-12" />
        </span>
      ))}
    </div>
  )
}

function Hero() {
  const { t, localize } = useLanguage()

  return (
    // isolate starts a new layer stack, so -z-10 puts the backdrop behind the text but not behind the page.
    <section
      id="home"
      aria-labelledby="hero-title"
      className="surface-main relative isolate overflow-hidden"
    >
      <HeroBackdrop />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-24 md:grid-cols-[1fr_auto] md:pt-24 md:pb-32">
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

      <WaveDivider className="absolute inset-x-0 -bottom-px fill-base" />
    </section>
  )
}

export default Hero
