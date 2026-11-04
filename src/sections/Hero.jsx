import ContactButtons from '../components/ContactButtons.jsx'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'

function Hero() {
  const { t, localize } = useLanguage()

  return (
    <section id="home" aria-labelledby="hero-title" className="bg-emerald-50">
      {/* TODO: add a photo of the store here once we have one. */}
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h1
          id="hero-title"
          className="max-w-2xl text-3xl leading-snug font-bold md:text-5xl"
        >
          {localize(store, 'name')}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-700">{t.hero.tagline}</p>
        <div className="mt-8">
          <ContactButtons />
        </div>
      </div>
    </section>
  )
}

export default Hero
