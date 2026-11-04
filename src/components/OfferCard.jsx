import { useLanguage } from '../i18n/LanguageContext.js'
import { formatDate } from '../lib/offers.js'
import { ClockIcon, TagIcon } from './Icons.jsx'
import Photo from './Photo.jsx'
import { CARD } from './styles.js'

function OfferCard({ offer }) {
  const { t, localize } = useLanguage()

  return (
    <article
      className={`flex h-full flex-col overflow-hidden text-ink ${CARD}`}
    >
      <Photo
        src={offer.image}
        alt={localize(offer, 'title')}
        width={640}
        height={360}
        className="aspect-video w-full object-cover"
        fallback={
          <div className="flex aspect-video w-full items-center justify-center bg-main-soft text-main-ink">
            <TagIcon className="size-12" />
          </div>
        }
      />

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold">{localize(offer, 'title')}</h3>
        <p className="text-muted">{localize(offer, 'details')}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-bold text-main-ink">
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
