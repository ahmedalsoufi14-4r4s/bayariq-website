import OfferCard from '../components/OfferCard.jsx'
import offers from '../data/offers.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { getActiveOffers } from '../lib/offers.js'

// NEEDS-AHMED: offers.json stays empty (the page says "no offers right now") until real offers arrive.
function Offers() {
  const { t } = useLanguage()
  const activeOffers = getActiveOffers(offers, new Date())

  return (
    <section id="offers" aria-labelledby="offers-title" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="offers-title" className="text-2xl font-bold md:text-3xl">
          {t.offers.title}
        </h2>

        {activeOffers.length > 0 ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeOffers.map((offer) => (
              <li key={offer.id}>
                <OfferCard offer={offer} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-2xl bg-white p-6 text-center text-gray-600">
            {t.offers.none}
          </p>
        )}
      </div>
    </section>
  )
}

export default Offers
