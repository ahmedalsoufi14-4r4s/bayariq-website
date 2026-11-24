import { useLanguage } from '../i18n/LanguageContext.js'
import { getMapEmbedUrl } from '../lib/branches.js'
import { isPlaceholder } from '../lib/placeholder.js'
import { fillIn } from '../lib/text.js'
import ContactButtons from './ContactButtons.jsx'
import { ClockIcon, MapPinIcon, PhoneIcon, PhotoIcon } from './Icons.jsx'
import MapEmbed from './MapEmbed.jsx'
import Photo from './Photo.jsx'
import { CARD } from './styles.js'

const MUTED = 'mt-2 text-muted'
const ICON = 'size-5 text-main-ink'

// The branch's photo at the top of its card, in the wide shape of the storefront photos. Until the
// family sends one (NEEDS-AHMED), a box of the same shape says it is coming soon.
function BranchPhoto({ branch, label }) {
  const { t } = useLanguage()

  return (
    <div className="overflow-hidden rounded-t-2xl">
      <Photo
        src={isPlaceholder(branch.photo) ? null : branch.photo}
        alt={fillIn(t.contact.photoAlt, { branch: label })}
        width={1080}
        height={350}
        className="aspect-[1080/350] w-full object-cover"
        fallback={
          <p className="flex aspect-[1080/350] w-full flex-col items-center justify-center gap-1 bg-main-soft text-sm text-main-ink">
            <PhotoIcon className="size-8 motion-safe:card-active:animate-wiggle" />
            {t.contact.photoComingSoon}
          </p>
        }
      />
    </div>
  )
}

// One branch in the "Our branches" section: its photo, its name on a green band, then hours,
// address, phone, buttons and map. Details that are still NEEDS-AHMED show "coming soon" or stay
// hidden. Under the pointer (or on a tap) the big pin hops and the clock spins (card-active: in
// index.css).
function BranchCard({ branch }) {
  const { t, language, localize } = useLanguage()
  const label = fillIn(t.contact.branch, {
    district: localize(branch, 'district'),
  })
  const titleId = `branch-${branch.id}-title`

  return (
    // The photo has its own rounded corners, because the card cannot clip it
    // (overflow-hidden would cut off the card's glow).
    <article
      aria-labelledby={titleId}
      className={`flex h-full flex-col ${CARD}`}
    >
      {/* The first-visit tour points at this top part: the whole card is taller than a phone. */}
      <div data-tour="branch">
        <BranchPhoto branch={branch} label={label} />
        <div className="surface-main relative overflow-hidden px-5 py-4">
          {/* Each branch shows the name on its own sign. */}
          <p className="text-sm text-on-main">{localize(branch, 'name')}</p>
          <h3 id={titleId} className="text-xl font-bold">
            {label}
          </h3>
          <MapPinIcon className="absolute -end-2 -bottom-5 size-24 text-on-main/10 motion-safe:card-active:animate-hop" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div>
          <h4 className="flex items-center gap-2 font-bold">
            <ClockIcon
              className={`${ICON} motion-safe:card-active:animate-spin-once`}
            />
            {t.contact.hours}
          </h4>
          {isPlaceholder(branch.hours) ? (
            <p className={MUTED}>{t.comingSoon}</p>
          ) : (
            <dl className="mt-2 space-y-2">
              {branch.hours.map((row) => (
                <div
                  key={row.days_en}
                  className="flex justify-between gap-4 border-b border-line pb-2"
                >
                  <dt>{localize(row, 'days')}</dt>
                  <dd>{localize(row, 'time')}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div>
          <h4 className="flex items-center gap-2 font-bold">
            <MapPinIcon className={ICON} />
            {t.contact.address}
          </h4>
          {isPlaceholder(branch.address_ar) ? (
            <p className={MUTED}>{t.comingSoon}</p>
          ) : (
            <p className="mt-2">{localize(branch, 'address')}</p>
          )}
          {!isPlaceholder(branch.mapsUrl) && (
            <a
              href={branch.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-11 items-center text-main-ink underline transition duration-150 ease-out hover:no-underline motion-safe:active:scale-95"
            >
              {t.contact.openInMaps}
            </a>
          )}
        </div>

        {!isPlaceholder(branch.phone) && (
          <p className="flex items-center gap-2">
            <PhoneIcon className={ICON} />
            <span className="sr-only">{t.contact.phone}: </span>
            {/* dir="ltr" keeps the groups of digits in order inside Arabic text. */}
            <span dir="ltr">{branch.phone}</span>
          </p>
        )}

        <ContactButtons branch={branch} branchLabel={label} />

        {/* mt-auto pushes the map to the bottom, so maps line up in cards side by side. */}
        <MapEmbed
          src={getMapEmbedUrl(branch, language)}
          title={fillIn(t.contact.mapTitle, { branch: label })}
          className="mt-auto h-56 w-full"
        />
      </div>
    </article>
  )
}

export default BranchCard
