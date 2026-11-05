import { useCart } from '../cart/CartContext.js'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { CartIcon } from './Icons.jsx'
import { BUTTON_ON_MAIN, ICON_BUTTON } from './styles.js'
import ThemeToggle from './ThemeToggle.jsx'
import { useActiveSection } from './useActiveSection.js'

// Each id is a page section and a key in the "nav" texts, in page order (useActiveSection needs that).
const NAV_IDS = ['home', 'offers', 'products', 'contact']

// A saffron underline (after:) grows from the start side on hover and keyboard focus, and stays
// under the link of the section on screen, which is saffron too (aria-current, set below).
// ltr: and rtl: pick the side it grows from: the left in English, the right in Arabic.
// The link is 44px tall for fingers; -my-2 and -mx-2 stop it from taking more room in the row.
const NAV_LINK =
  'relative -mx-2 -my-2 block px-2 py-3 text-on-main/85 hover:text-on-main aria-[current=true]:text-accent after:absolute after:inset-x-2 after:bottom-2 after:h-0.5 after:scale-x-0 after:rounded-full after:bg-accent after:ease-out motion-safe:after:transition-transform motion-safe:after:duration-300 ltr:after:origin-left rtl:after:origin-right hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=true]:after:scale-x-100'

function Header() {
  const { language, t, toggleLanguage, localize } = useLanguage()
  const { count, openCart } = useCart()
  const otherLanguage = language === 'ar' ? 'en' : 'ar'
  const activeId = useActiveSection(NAV_IDS)

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

      {/* The header keeps the same height while the web font loads. Until it arrives the text
          shows in a system font, which can be wider, so the store name could take more lines
          (or push the row onto two rows) and then jump back. Here its height never depends on
          the font: on phones the name always takes a two-line box, and from md up the row never
          wraps and the name stays on one line. Below 360px (narrower than the site is designed
          for) the name keeps its natural height instead, so it is never cut off. */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 md:flex-nowrap md:gap-x-6">
        {/* NEEDS-AHMED: replace the bag mark and the text logo with the store's real logo image.
            On phones, basis-0 grow gives the logo only the space left next to the buttons,
            so the cart button never drops to another row.
            Under the pointer the bag mark tilts and grows a little (group-hover:). */}
        <a
          href="#home"
          className="group flex min-w-0 grow basis-0 items-center gap-2 font-bold min-[360px]:h-12 md:h-auto md:grow-0 md:basis-auto md:text-lg"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent transition duration-300 ease-out motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6">
            <CartIcon className="size-5" />
          </span>
          {/* line-clamp-2 shows at most two lines and ends the text with "…" if it needs more.
              min-[360px]: works like md:, but from a width we choose (360px and wider). */}
          <span className="min-[360px]:line-clamp-2 md:line-clamp-1">
            {localize(store, 'name')}
          </span>
        </a>

        {/* On phones the menu moves to its own row under the logo.
            aria-current tells screen readers which link is the section on screen. */}
        {/* data-tour marks the elements the first-visit tour points to (src/data/tour.json). */}
        <nav
          data-tour="menu"
          className="order-last w-full md:order-none md:w-auto md:shrink-0"
        >
          <ul className="flex flex-wrap gap-x-5 text-sm">
            {NAV_IDS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={id === activeId ? 'true' : undefined}
                  className={NAV_LINK}
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <div data-tour="settings" className="flex items-center gap-1">
            <button
              type="button"
              lang={otherLanguage}
              onClick={toggleLanguage}
              className={`${BUTTON_ON_MAIN} me-1 min-h-11 px-3 text-sm`}
            >
              {t.switchLanguage}
            </button>

            <ThemeToggle />
          </div>

          {/* The cart icon rocks once when the pointer comes over the button. */}
          <button
            type="button"
            data-tour="cart"
            onClick={openCart}
            aria-label={`${t.cart.open} ${count}`}
            className={`${ICON_BUTTON} relative hover:bg-on-main/10`}
          >
            <CartIcon className="size-6 motion-safe:group-hover:animate-wiggle" />
            {/* A new key makes React draw a new badge, so the pop animation plays on every change. */}
            {count > 0 && (
              <span
                key={count}
                className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-on-accent motion-safe:animate-pop"
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
