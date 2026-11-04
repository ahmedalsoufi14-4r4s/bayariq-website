import ContactButtons from '../components/ContactButtons.jsx'
import { ClockIcon, MapPinIcon } from '../components/Icons.jsx'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'

function StoreInfo() {
  const { t, localize } = useLanguage()

  // An iframe with "TODO" as its address would show an error page inside the site,
  // so we show a placeholder box until the real embed link is in store.json.
  const hasMap = !store.mapsEmbedUrl.startsWith('TODO')

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
              <ClockIcon className="size-5 text-emerald-700" />
              {t.contact.hours}
            </h3>
            <dl className="mt-3 space-y-2">
              {store.hours.map((row) => (
                <div
                  key={row.days_en}
                  className="flex justify-between gap-4 border-b border-gray-200 pb-2"
                >
                  <dt>{localize(row, 'days')}</dt>
                  <dd className="font-medium">{localize(row, 'time')}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <MapPinIcon className="size-5 text-emerald-700" />
              {t.contact.address}
            </h3>
            <p className="mt-3">{localize(store, 'address')}</p>
            <a
              href={store.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-medium text-emerald-700 underline hover:text-emerald-800"
            >
              {t.contact.openInMaps}
            </a>
          </div>

          <ContactButtons />
        </div>

        {hasMap ? (
          <iframe
            src={store.mapsEmbedUrl}
            title={t.contact.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-80 w-full rounded-2xl border-0"
          />
        ) : (
          <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
            {t.contact.mapComingSoon}
          </div>
        )}
      </div>
    </section>
  )
}

export default StoreInfo
