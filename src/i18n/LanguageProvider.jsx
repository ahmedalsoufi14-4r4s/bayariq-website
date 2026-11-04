import { useLayoutEffect, useState } from 'react'
import { LanguageContext } from './LanguageContext.js'
import ar from './ar.json'
import en from './en.json'

const translations = { ar, en }

// GitHub Pages sites of the same user share one localStorage, so the key has a unique prefix.
const STORAGE_KEY = 'bayariq-language'

// Arabic is the default. localStorage throws when the browser blocks storage,
// so in that case we also fall back to Arabic.
function getSavedLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ar'
  } catch {
    return 'ar'
  }
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getSavedLanguage)

  // Runs before the browser paints, so the page never flashes in the wrong direction.
  useLayoutEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Storage is blocked: the site still works, the choice is just not remembered.
    }
  }, [language])

  function toggleLanguage() {
    setLanguage((current) => (current === 'ar' ? 'en' : 'ar'))
  }

  // Reads a bilingual field from the data files.
  // Example: localize(store, 'name') gives store.name_ar in Arabic and store.name_en in English.
  function localize(item, field) {
    return item[`${field}_${language}`]
  }

  const value = {
    language,
    t: translations[language],
    toggleLanguage,
    localize,
  }

  return <LanguageContext value={value}>{children}</LanguageContext>
}

export default LanguageProvider
