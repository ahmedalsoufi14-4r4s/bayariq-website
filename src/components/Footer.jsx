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
      {/* pb-24 keeps the last line clear of the round chat button in the corner (ChatBot.jsx). */}
      <footer className="surface-main">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 px-4 pt-4 pb-24 text-sm text-on-main/80">
          <p>
            © {year} {localize(store, 'name')}. {t.footer.rights}
          </p>
          {/* Starts the first-visit tour again. Focus comes back to this link afterwards. */}
          <button
            type="button"
            onClick={(event) => startTour(event.currentTarget)}
            className="min-h-11 underline underline-offset-4 hover:text-on-main hover:decoration-accent"
          >
            {t.tour.again}
          </button>
        </div>
      </footer>
    </>
  )
}

export default Footer
