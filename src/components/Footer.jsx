import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { useTour } from '../tour/TourContext.js'
import WaveDivider from './WaveDivider.jsx'

function Footer() {
  const { t, localize } = useLanguage()
  const { startTour } = useTour()
  const year = new Date().getFullYear()

  return (
    <>
      <WaveDivider />
      {/* pb-24 keeps the last line clear of the round chat button in the corner (ChatBot.jsx).
          The text is full white: white on the green is only just above AA. */}
      <footer className="surface-main">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 pt-4 pb-24 text-sm">
          {/* The full logo (mark and both names) on a white plate, so it looks the same in light
              and dark mode. It is a card, so it lifts, tilts and glows under the pointer or a tap.
              public/logo.webp is made from photos/logo.png by `npm run images`, at twice this
              size for sharp phone screens. width and height keep its room while it loads. */}
          <div className="card rounded-2xl bg-logo-paper px-4 py-3 shadow-md shadow-black/20">
            <img
              src={`${import.meta.env.BASE_URL}logo.webp`}
              alt={t.footer.logoAlt}
              width={640}
              height={160}
              loading="lazy"
              decoding="async"
              className="h-auto w-72 sm:w-80"
            />
          </div>
          <p>
            © {year} {localize(store, 'name')}. {t.footer.rights}
          </p>
          {/* Starts the first-visit tour again. Focus comes back to this link afterwards.
              Its underline gets thicker on hover, and it shrinks a little while pressed. */}
          <button
            type="button"
            onClick={(event) => startTour(event.currentTarget)}
            className="min-h-11 underline underline-offset-4 transition duration-150 ease-out hover:decoration-2 motion-safe:active:scale-95"
          >
            {t.tour.again}
          </button>
        </div>
      </footer>
    </>
  )
}

export default Footer
