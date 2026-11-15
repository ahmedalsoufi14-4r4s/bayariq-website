import { Component } from 'react'
import { useLanguage } from '../i18n/LanguageContext.js'
import { AlertIcon } from './Icons.jsx'
import PageBackdrop from './PageBackdrop.jsx'
import { BUTTON_MAIN, CARD } from './styles.js'

// The message sits in a card over the same moving circles as the page, so even this screen
// feels like the site: the card lifts, tilts and glows under the pointer or a tap, and its
// icon wiggles (card-active: in index.css).
function ErrorMessage() {
  const { t } = useLanguage()

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <PageBackdrop />
      <div
        className={`${CARD} flex max-w-md flex-col items-center gap-4 p-8 text-center`}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-main-soft text-main-ink motion-safe:card-active:animate-wiggle">
          <AlertIcon className="size-8" />
        </span>
        <h1 className="text-2xl font-bold">{t.error.title}</h1>
        <p className="text-muted">{t.error.text}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={`${BUTTON_MAIN} px-5 py-3`}
        >
          {t.error.reload}
        </button>
      </div>
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
