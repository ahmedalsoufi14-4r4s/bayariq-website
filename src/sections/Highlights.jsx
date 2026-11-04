import { ChatIcon, MapPinIcon, TagIcon } from '../components/Icons.jsx'
import { useLanguage } from '../i18n/LanguageContext.js'

// Each id is a key in the "highlights" texts.
// NEEDS-AHMED: the family should confirm these points, especially "prices".
const HIGHLIGHTS = [
  { id: 'prices', Icon: TagIcon },
  { id: 'whatsapp', Icon: ChatIcon },
  { id: 'nearby', Icon: MapPinIcon },
]

function Highlights() {
  const { t } = useLanguage()

  return (
    <section
      aria-labelledby="highlights-title"
      className="mx-auto max-w-6xl px-4 py-16"
    >
      <h2 id="highlights-title" className="text-2xl font-bold md:text-3xl">
        {t.highlights.title}
      </h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map(({ id, Icon }) => (
          <li key={id} className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
            <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{t.highlights[id].title}</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {t.highlights[id].text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Highlights
