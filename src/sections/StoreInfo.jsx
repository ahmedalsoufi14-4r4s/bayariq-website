import ContactButtons from '../components/ContactButtons.jsx'
import { ClockIcon, MapPinIcon } from '../components/Icons.jsx'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { isPlaceholder } from '../lib/placeholder.js'

function StoreInfo() {
  const { t, localize } = useLanguage()

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl px-4 py-16"
    >
      <h2 id="contact-title" className="text-2xl font-bold md:text-3xl">
        {t.contact.title}
      </h2>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <ClockIcon className="size-5 text-emerald-700 dark:text-emerald-400" />
              {t.contact.hours}
            </h3>
            {isPlaceholder(store.hours) ? (
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                {t.comingSoon}
              </p>
            ) : (
              <dl className="mt-3 space-y-2">
                {store.hours.map((row) => (
                  <div
                    key={row.days_en}
                    className="flex justify-between gap-4 border-b border-gray-200 pb-2 dark:border-gray-800"
                  >
                    <dt>{localize(row, 'days')}</dt>
                    <dd className="font-medium">{localize(row, 'time')}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <MapPinIcon className="size-5 text-emerald-700 dark:text-emerald-400" />
              {t.contact.address}
            </h3>
            <p className="mt-3">{localize(store, 'address')}</p>
            {!isPlaceholder(store.mapsUrl) && (
              <a
                href={store.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-medium text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                {t.contact.openInMaps}
              </a>
            )}
          </div>

          <ContactButtons />
        </div>

        {isPlaceholder(store.mapsEmbedUrl) ? (
          <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
            {t.contact.mapComingSoon}
          </div>
        ) : (
          <iframe
            src={store.mapsEmbedUrl}
            title={t.contact.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-80 w-full rounded-2xl border-0"
          />
        )}
      </div>
    </section>
  )
}

export default StoreInfo
