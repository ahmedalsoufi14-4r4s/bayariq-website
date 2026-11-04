import BranchCard from '../components/BranchCard.jsx'
import { reveal } from '../components/reveal.js'
import SectionHeading from '../components/SectionHeading.jsx'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'

// "Our branches": one card for each branch in store.json.
function StoreInfo() {
  const { t } = useLanguage()

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto max-w-6xl px-4 py-16"
    >
      <SectionHeading id="contact-title">{t.contact.title}</SectionHeading>

      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {store.branches.map((branch) => (
          <li key={branch.id} ref={reveal} className="reveal">
            <BranchCard branch={branch} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default StoreInfo
