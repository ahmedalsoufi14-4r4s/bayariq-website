import { useLanguage } from '../i18n/LanguageContext.js'
import { formatDate } from '../lib/offers.js'
import { ClockIcon, TagIcon } from './Icons.jsx'

function OfferCard({ offer }) {
  const { t, localize } = useLanguage()

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {offer.image ? (
        <img
          // Photos go in public/, so their path must start with the site's base path.
          src={import.meta.env.BASE_URL + offer.image}
          alt={localize(offer, 'title')}
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-emerald-100 text-emerald-700">
          <TagIcon className="size-12" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold">{localize(offer, 'title')}</h3>
        <p className="text-gray-600">{localize(offer, 'details')}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium text-emerald-700">
          <ClockIcon className="size-4" />
          <span>
            {t.offers.validUntil}{' '}
            <time dateTime={offer.validUntil}>
              {formatDate(offer.validUntil, t.dateLocale)}
            </time>
          </span>
        </p>
      </div>
    </article>
  )
}

export default OfferCard
