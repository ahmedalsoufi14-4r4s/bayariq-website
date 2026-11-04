import { MapPinIcon } from '../components/Icons.jsx'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'

function Hero() {
  const { t, localize } = useLanguage()

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="bg-emerald-50 dark:bg-emerald-950"
    >
      {/* NEEDS-AHMED: add a photo of the store here. */}
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h1
          id="hero-title"
          className="max-w-2xl text-3xl leading-snug font-bold md:text-5xl"
        >
          {localize(store, 'name')}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-700 dark:text-gray-300">
          {t.hero.tagline}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#products"
            className="inline-flex items-center rounded-full bg-emerald-700 px-5 py-3 text-white hover:bg-emerald-800"
          >
            {t.hero.browse}
          </a>
          {/* With four branches there is no single number to call, so this leads to the branch list. */}
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-white px-5 py-3 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-gray-950 dark:text-emerald-400 dark:hover:bg-emerald-950"
          >
            <MapPinIcon className="size-5" />
            {t.hero.branches}
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
