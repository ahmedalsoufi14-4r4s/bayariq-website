import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CartProvider from './cart/CartProvider.jsx'
import LanguageProvider from './i18n/LanguageProvider.jsx'

// CartProvider sits inside LanguageProvider because its messages use the current language.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LanguageProvider>
  </StrictMode>,
)
