import { useLanguage } from '../i18n/LanguageContext.js'
import { isPlaceholder } from '../lib/placeholder.js'
import { fillIn } from '../lib/text.js'
import ContactButtons from './ContactButtons.jsx'
import { ClockIcon, MapPinIcon } from './Icons.jsx'
import { CARD } from './styles.js'

const MUTED = 'mt-2 text-muted'
const ICON = 'size-5 text-main-ink'

// One branch in the "Our branches" section: its name on a navy top, then hours, address, buttons and map.
// Details that are still NEEDS-AHMED show "coming soon" or stay hidden.
// Under the pointer (or on a tap) the big pin hops and the clock spins (card-active: in index.css).
function BranchCard({ branch }) {
  const { t, localize } = useLanguage()
  const label = fillIn(t.contact.branch, {
    district: localize(branch, 'district'),
  })
  const titleId = `branch-${branch.id}-title`

  return (
    // The navy top has its own rounded corners, because the card cannot clip it
    // (overflow-hidden would cut off the card's glow).
    <article
      aria-labelledby={titleId}
      className={`flex h-full flex-col ${CARD}`}
    >
      <div className="surface-main relative overflow-hidden rounded-t-2xl px-5 py-4">
        {/* Each branch shows its own name, for example "بيارق التوفيق" in Al Harazat. */}
        <p className="text-sm text-on-main/75">{localize(branch, 'name')}</p>
        <h3 id={titleId} className="text-xl font-bold">
          {label}
        </h3>
        <MapPinIcon className="absolute -end-2 -bottom-5 size-24 text-on-main/10 motion-safe:card-active:animate-hop" />
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
              className="mt-2 inline-block text-main-ink underline hover:no-underline"
            >
              {t.contact.openInMaps}
            </a>
          )}
        </div>

        <ContactButtons branch={branch} branchLabel={label} />

        {/* mt-auto pushes the map to the bottom, so maps line up in cards side by side. */}
        {isPlaceholder(branch.mapsEmbedUrl) ? (
          <div className="mt-auto flex h-40 items-center justify-center rounded-xl bg-main-soft text-muted">
            {t.contact.mapComingSoon}
          </div>
        ) : (
          <iframe
            src={branch.mapsEmbedUrl}
            title={fillIn(t.contact.mapTitle, { branch: label })}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="mt-auto h-56 w-full rounded-xl border-0"
          />
        )}
      </div>
    </article>
  )
}

export default BranchCard
