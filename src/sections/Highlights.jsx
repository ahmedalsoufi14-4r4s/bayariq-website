import { ChatIcon, MapPinIcon, TagIcon } from '../components/Icons.jsx'
import { reveal } from '../components/reveal.js'
import SectionHeading from '../components/SectionHeading.jsx'
import { CARD } from '../components/styles.js'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { fillIn } from '../lib/text.js'

// Each id is a key in the "highlights" texts.
// NEEDS-AHMED: the family should confirm these points, especially "prices".
const HIGHLIGHTS = [
  { id: 'prices', Icon: TagIcon },
  { id: 'whatsapp', Icon: ChatIcon },
  { id: 'nearby', Icon: MapPinIcon },
]

function Highlights() {
  const { t, language, localize } = useLanguage()
  // The "nearby" text lists the branch districts from store.json. Intl.ListFormat joins them
  // the way each language writes a list: "الحمدانية وكيلو 14 والمحاميد" or "Al Hamdaniyah, Kilo 14, and Al Mahamid".
  const districts = new Intl.ListFormat(language, {
    type: 'conjunction',
  }).format(store.branches.map((branch) => localize(branch, 'district')))

  return (
    <section
      aria-labelledby="highlights-title"
      className="mx-auto max-w-6xl px-4 py-16"
    >
      <SectionHeading id="highlights-title">
        {t.highlights.title}
      </SectionHeading>
      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map(({ id, Icon }) => (
          <li key={id} ref={reveal} className={`reveal ${CARD} p-6`}>
            <span className="flex size-12 items-center justify-center rounded-xl bg-main-soft text-main-ink">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{t.highlights[id].title}</h3>
            <p className="mt-1 text-muted">
              {fillIn(t.highlights[id].text, { districts })}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Highlights
