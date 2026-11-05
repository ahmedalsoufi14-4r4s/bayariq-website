import { useLayoutEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.js'
import { MoonIcon, SunIcon } from './Icons.jsx'
import { ICON_BUTTON } from './styles.js'

// On hover the sun turns a little and the moon tilts.
const ICON_MOTION = 'size-6 transition duration-300 ease-out'

// Same key as in the script in index.html.
const STORAGE_KEY = 'bayariq-theme'

// The script in index.html has already chosen light or dark, so we start from its choice.
function isDarkNow() {
  return document.documentElement.classList.contains('dark')
}

// aria-pressed tells screen readers whether dark mode is on.
function ThemeToggle() {
  const { t } = useLanguage()
  const [isDark, setIsDark] = useState(isDarkNow)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Saved only when the visitor clicks. Until then the site keeps following the device setting.
  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      // Storage is blocked: the theme still changes, it is just not remembered.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={t.darkMode}
      className={`${ICON_BUTTON} hover:bg-on-main/10`}
    >
      {isDark ? (
        <SunIcon
          className={`${ICON_MOTION} motion-safe:group-hover:rotate-45`}
        />
      ) : (
        <MoonIcon
          className={`${ICON_MOTION} motion-safe:group-hover:-rotate-12`}
        />
      )}
    </button>
  )
}

export default ThemeToggle
