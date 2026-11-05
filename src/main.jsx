import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CartProvider from './cart/CartProvider.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { listenForCardTaps } from './components/tapReaction.js'
import LanguageProvider from './i18n/LanguageProvider.jsx'
import TourProvider from './tour/TourProvider.jsx'

// Cards react to a tap on phones, like they do to the mouse (see tapReaction.js).
listenForCardTaps()

// CartProvider sits inside LanguageProvider because its messages use the current language.
// ErrorBoundary sits inside LanguageProvider too, so its error message can use the current language.
// TourProvider shows the first-visit tour after the page, in the current language.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ErrorBoundary>
        <CartProvider>
          <TourProvider>
            <App />
          </TourProvider>
        </CartProvider>
      </ErrorBoundary>
    </LanguageProvider>
  </StrictMode>,
)
