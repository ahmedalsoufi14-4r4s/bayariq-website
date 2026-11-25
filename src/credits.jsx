import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { listenForCardTaps } from './components/tapReaction.js'
import LanguageProvider from './i18n/LanguageProvider.jsx'
import PhotoCredits from './sections/PhotoCredits.jsx'

// Cards react to a tap on phones, like on the shop page (see main.jsx).
listenForCardTaps()

// The photo credits page (photo-credits.html). It needs no cart, no products and no tour,
// so it only has the language around it.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider title="creditsTitle">
      <ErrorBoundary>
        <PhotoCredits />
      </ErrorBoundary>
    </LanguageProvider>
  </StrictMode>,
)
