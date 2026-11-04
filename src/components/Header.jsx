import { useCart } from '../cart/CartContext.js'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { CartIcon } from './Icons.jsx'

// Each id is a page section and a key in the "nav" texts.
const NAV_IDS = ['home', 'offers', 'products', 'contact']

function Header() {
  const { language, t, toggleLanguage, localize } = useLanguage()
  const { count, openCart } = useCart()
  const otherLanguage = language === 'ar' ? 'en' : 'ar'

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:z-20 focus:rounded focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-white"
      >
        {t.skipToContent}
      </a>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 md:gap-x-6">
        {/* NEEDS-AHMED: replace the text logo with the store's real logo image.
            On phones, basis-0 grow gives the logo only the space left next to the buttons
            (it wraps onto two lines if it must), so the cart button never drops to another row. */}
        <a
          href="#home"
          className="min-w-0 grow basis-0 text-base font-bold text-emerald-700 md:grow-0 md:basis-auto md:text-lg"
        >
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            lang={otherLanguage}
            onClick={toggleLanguage}
            className="rounded-full border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            {t.switchLanguage}
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={`${t.cart.open} ${count}`}
            className="relative rounded-full p-2 text-emerald-700 hover:bg-emerald-50"
          >
            <CartIcon className="size-6" />
            {count > 0 && (
              <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
