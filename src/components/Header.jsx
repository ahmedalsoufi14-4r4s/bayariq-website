import { useCart } from '../cart/CartContext.js'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { CartIcon } from './Icons.jsx'
import ThemeToggle from './ThemeToggle.jsx'

// Each id is a page section and a key in the "nav" texts.
const NAV_IDS = ['home', 'offers', 'products', 'contact']

function Header() {
  const { language, t, toggleLanguage, localize } = useLanguage()
  const { count, openCart } = useCart()
  const otherLanguage = language === 'ar' ? 'en' : 'ar'

  return (
    // z-30 keeps the sticky header above everything on the page.
    // Dialogs (the cart and product details) still open above it, because showModal() puts them in a top layer.
    <header className="surface-main sticky top-0 z-30 border-b border-on-main/10 shadow-md shadow-black/10">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-2 focus:z-20 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        {t.skipToContent}
      </a>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 md:gap-x-6">
        {/* NEEDS-AHMED: replace the bag mark and the text logo with the store's real logo image.
            On phones, basis-0 grow gives the logo only the space left next to the buttons
            (it wraps onto two lines if it must), so the cart button never drops to another row. */}
        <a
          href="#home"
          className="flex min-w-0 grow basis-0 items-center gap-2 font-bold md:grow-0 md:basis-auto md:text-lg"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent">
            <CartIcon className="size-5" />
          </span>
          {localize(store, 'name')}
        </a>

        {/* On phones the menu moves to its own row under the logo. */}
        <nav className="order-last w-full md:order-none md:w-auto">
          <ul className="flex flex-wrap gap-x-5 text-sm">
            {NAV_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-block py-1 text-on-main/85 hover:text-accent"
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            lang={otherLanguage}
            onClick={toggleLanguage}
            className="me-1 rounded-full border border-on-main/40 px-4 py-2 text-sm hover:border-on-main hover:bg-on-main/10"
          >
            {t.switchLanguage}
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={openCart}
            aria-label={`${t.cart.open} ${count}`}
            className="relative rounded-full p-2 hover:bg-on-main/10"
          >
            <CartIcon className="size-6" />
            {/* A new key makes React draw a new badge, so the pop animation plays on every change. */}
            {count > 0 && (
              <span
                key={count}
                className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-on-accent motion-safe:animate-pop"
              >
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
