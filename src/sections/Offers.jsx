import EmptyState from '../components/EmptyState.jsx'
import { TagIcon } from '../components/Icons.jsx'
import OfferCard from '../components/OfferCard.jsx'
import { reveal } from '../components/reveal.js'
import SectionHeading from '../components/SectionHeading.jsx'
import WaveDivider from '../components/WaveDivider.jsx'
import offers from '../data/offers.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { getActiveOffers } from '../lib/offers.js'

// A navy band between two waves, so the offers stand out from the rest of the page.
// The <> </> (a fragment) returns the waves and the band side by side without an extra element.
// NEEDS-AHMED: offers.json stays empty (the page says "no offers right now") until real offers arrive.
function Offers() {
  const { t } = useLanguage()
  const activeOffers = getActiveOffers(offers, new Date())

  return (
    <>
      <WaveDivider />
      <section
        id="offers"
        aria-labelledby="offers-title"
        className="surface-main"
      >
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading id="offers-title">{t.offers.title}</SectionHeading>

          {activeOffers.length > 0 ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeOffers.map((offer) => (
                <li key={offer.id} ref={reveal} className="reveal">
                  <OfferCard offer={offer} />
                </li>
              ))}
            </ul>
          ) : (
            <div ref={reveal} className="reveal mt-8">
              <EmptyState Icon={TagIcon} text={t.offers.none} />
            </div>
          )}
        </div>
      </section>
      <WaveDivider flip />
    </>
  )
}

export default Offers
