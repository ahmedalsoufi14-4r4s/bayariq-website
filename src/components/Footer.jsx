import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'

function Footer() {
  const { t, localize } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600 dark:text-gray-400">
        <p>
          © {year} {localize(store, 'name')}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}

export default Footer
