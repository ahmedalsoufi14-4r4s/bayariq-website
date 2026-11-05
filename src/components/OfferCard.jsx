import { useLanguage } from '../i18n/LanguageContext.js'
import { formatDate } from '../lib/offers.js'
import { ClockIcon, TagIcon } from './Icons.jsx'
import Photo from './Photo.jsx'
import { CARD } from './styles.js'

function OfferCard({ offer }) {
  const { t, localize } = useLanguage()

  return (
    // The photo has its own rounded top corners, because the card cannot clip it
    // (overflow-hidden would cut off the card's glow).
    <article className={`flex h-full flex-col text-ink ${CARD}`}>
      <Photo
        src={offer.image}
        alt={localize(offer, 'title')}
        width={640}
        height={360}
        className="aspect-video w-full rounded-t-2xl object-cover"
        fallback={
          <div className="flex aspect-video w-full items-center justify-center rounded-t-2xl bg-main-soft text-main-ink">
            <TagIcon className="size-12 motion-safe:card-active:animate-wiggle" />
          </div>
        }
      />

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold">{localize(offer, 'title')}</h3>
        <p className="text-muted">{localize(offer, 'details')}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-bold text-main-ink">
          <ClockIcon className="size-4 motion-safe:card-active:animate-spin-once" />
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
