import { Component } from 'react'
import { useLanguage } from '../i18n/LanguageContext.js'
import { BUTTON_MAIN } from './styles.js'

function ErrorMessage() {
  const { t } = useLanguage()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">{t.error.title}</h1>
      <p className="text-muted">{t.error.text}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className={`${BUTTON_MAIN} px-5 py-3`}
      >
        {t.error.reload}
      </button>
    </main>
  )
}

// If any component inside crashes (for example because of a mistake in a data file),
// React shows this message instead of a blank page.
// Catching errors is the one thing React still only lets class components do.
class ErrorBoundary extends Component {
  state = { hasError: false }

  // React calls this after a crash. The returned object becomes the new state.
  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? <ErrorMessage /> : this.props.children
  }
}

export default ErrorBoundary
