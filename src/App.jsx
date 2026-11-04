import CartAnnouncer from './cart/CartAnnouncer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Hero from './sections/Hero.jsx'
import Highlights from './sections/Highlights.jsx'
import Offers from './sections/Offers.jsx'
import Products from './sections/Products.jsx'
import StoreInfo from './sections/StoreInfo.jsx'

// Page layout. The cart drawer stays hidden until the cart button opens it.
function App() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-gray-900">
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <Highlights />
        <Offers />
        <Products />
        <StoreInfo />
      </main>
      <Footer />
      <CartDrawer />
      <CartAnnouncer />
    </div>
  )
}

export default App
