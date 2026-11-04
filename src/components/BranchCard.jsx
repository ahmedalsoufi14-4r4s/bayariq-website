import { useLanguage } from '../i18n/LanguageContext.js'
import { isPlaceholder } from '../lib/placeholder.js'
import { fillIn } from '../lib/text.js'
import ContactButtons from './ContactButtons.jsx'
import { ClockIcon, MapPinIcon } from './Icons.jsx'

const MUTED = 'mt-2 text-gray-600 dark:text-gray-400'

// One branch in the "Our branches" section: its name, hours, address, buttons and map.
// Details that are still NEEDS-AHMED show "coming soon" or stay hidden.
function BranchCard({ branch }) {
  const { t, localize } = useLanguage()
  const label = fillIn(t.contact.branch, {
    district: localize(branch, 'district'),
  })
  const titleId = `branch-${branch.id}-title`

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col gap-5 rounded-2xl border border-gray-200 p-5 dark:border-gray-800"
    >
      <div>
        {/* Each branch shows its own name, for example "بيارق التوفيق" in Al Harazat. */}
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          {localize(branch, 'name')}
        </p>
        <h3 id={titleId} className="text-xl font-bold">
          {label}
        </h3>
      </div>

      <div>
        <h4 className="flex items-center gap-2 font-bold">
          <ClockIcon className="size-5 text-emerald-700 dark:text-emerald-400" />
          {t.contact.hours}
        </h4>
        {isPlaceholder(branch.hours) ? (
          <p className={MUTED}>{t.comingSoon}</p>
        ) : (
          <dl className="mt-2 space-y-2">
            {branch.hours.map((row) => (
              <div
                key={row.days_en}
                className="flex justify-between gap-4 border-b border-gray-200 pb-2 dark:border-gray-800"
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
          <MapPinIcon className="size-5 text-emerald-700 dark:text-emerald-400" />
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
            className="mt-2 inline-block text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            {t.contact.openInMaps}
          </a>
        )}
      </div>

      <ContactButtons branch={branch} branchLabel={label} />

      {/* mt-auto pushes the map to the bottom, so maps line up in cards side by side. */}
      {isPlaceholder(branch.mapsEmbedUrl) ? (
        <div className="mt-auto flex h-40 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
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
    </article>
  )
}

export default BranchCard
