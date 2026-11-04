import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'

// Each id is a page section (added in later steps) and a key in the "nav" texts.
const NAV_IDS = ['home', 'products', 'offers', 'contact']

function Header() {
  const { language, t, toggleLanguage, localize } = useLanguage()
  const otherLanguage = language === 'ar' ? 'en' : 'ar'

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:z-20 focus:rounded focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-white"
      >
        {t.skipToContent}
      </a>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        {/* TODO: replace the text logo with the store's real logo image. */}
        <a href="#home" className="text-lg font-bold text-emerald-700">
          {localize(store, 'name')}
        </a>

        {/* On phones the menu moves to its own row under the logo. */}
        <nav className="order-last w-full md:order-none md:w-auto">
          <ul className="flex flex-wrap gap-x-5 text-sm font-medium">
            {NAV_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-block py-1 hover:text-emerald-700"
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          lang={otherLanguage}
          onClick={toggleLanguage}
          className="rounded-full border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          {t.switchLanguage}
        </button>
      </div>
    </header>
  )
}

export default Header
