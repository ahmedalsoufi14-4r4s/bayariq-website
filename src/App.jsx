import CartAnnouncer from './cart/CartAnnouncer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import ChatBot from './components/ChatBot.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import PageBackdrop from './components/PageBackdrop.jsx'
import Hero from './sections/Hero.jsx'
import Highlights from './sections/Highlights.jsx'
import Offers from './sections/Offers.jsx'
import Products from './sections/Products.jsx'
import StoreInfo from './sections/StoreInfo.jsx'

// Page layout. The cart drawer stays hidden until the cart button opens it.
// The page colors for light and dark mode are set on <body> in index.html,
// and PageBackdrop adds the floating circles behind everything.
// ChatBot floats in the bottom corner. It comes after the footer, so keyboard users reach
// it after the rest of the page.
function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PageBackdrop />
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <Highlights />
        <Offers />
        <Products />
        <StoreInfo />
      </main>
      <Footer />
      <ChatBot />
      <CartDrawer />
      <CartAnnouncer />
    </div>
  )
}

export default App
