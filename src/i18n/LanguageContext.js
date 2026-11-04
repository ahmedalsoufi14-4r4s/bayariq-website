import { createContext, useContext } from 'react'

export const LanguageContext = createContext(null)

// Any component can call useLanguage() to get the current language and its texts.
export function useLanguage() {
  return useContext(LanguageContext)
}
