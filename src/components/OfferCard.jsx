import { useLanguage } from '../i18n/LanguageContext.js'
import { formatDate } from '../lib/offers.js'
import { ClockIcon, TagIcon } from './Icons.jsx'
import Photo from './Photo.jsx'

function OfferCard({ offer }) {
  const { t, localize } = useLanguage()

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <Photo
        src={offer.image}
        alt={localize(offer, 'title')}
        width={640}
        height={360}
        className="aspect-video w-full object-cover"
        fallback={
          <div className="flex aspect-video w-full items-center justify-center bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            <TagIcon className="size-12" />
          </div>
        }
      />

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold">{localize(offer, 'title')}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {localize(offer, 'details')}
        </p>
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-sm text-emerald-700 dark:text-emerald-400">
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
