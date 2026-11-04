import BranchCard from '../components/BranchCard.jsx'
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
      <h2 id="contact-title" className="text-2xl font-bold md:text-3xl">
        {t.contact.title}
      </h2>

      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {store.branches.map((branch) => (
          <li key={branch.id}>
            <BranchCard branch={branch} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default StoreInfo
