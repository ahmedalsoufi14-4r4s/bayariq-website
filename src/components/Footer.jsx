import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import WaveDivider from './WaveDivider.jsx'

function Footer() {
  const { t, localize } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <>
      <WaveDivider />
      {/* pb-24 keeps the last line clear of the round chat button in the corner (ChatBot.jsx). */}
      <footer className="surface-main">
        <div className="mx-auto max-w-6xl px-4 pt-4 pb-24 text-sm text-on-main/80">
          <p>
            © {year} {localize(store, 'name')}. {t.footer.rights}
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer
