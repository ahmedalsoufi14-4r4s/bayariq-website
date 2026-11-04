import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import store from './data/store.json'
import { useLanguage } from './i18n/LanguageContext.js'

// Page layout. The page sections are added inside <main> from Step 3.
function App() {
  const { localize } = useLanguage()

  return (
    <div className="flex min-h-dvh flex-col bg-white text-gray-900">
      <Header />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-start text-3xl font-bold">
          {localize(store, 'name')}
        </h1>
      </main>
      <Footer />
    </div>
  )
}

export default App
