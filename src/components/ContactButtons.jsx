import { useLanguage } from '../i18n/LanguageContext.js'
import { isPlaceholder } from '../lib/placeholder.js'
import { ChatIcon, PhoneIcon } from './Icons.jsx'

// WhatsApp and call buttons for one branch, used on its card in the branches section.
// Each button only shows once the branch's real number is in store.json.
// branchLabel (like "فرع الحمدانية") goes into the accessible name, so screen reader
// users can tell the four "Call us" buttons apart.
function ContactButtons({ branch, branchLabel }) {
  const { t } = useLanguage()
  const hasWhatsApp = !isPlaceholder(branch.whatsapp)
  const hasPhone = !isPlaceholder(branch.phone)

  if (!hasWhatsApp && !hasPhone) return null

  return (
    <div className="flex flex-wrap gap-3">
      {hasWhatsApp && (
        <a
          href={`https://wa.me/${branch.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.contact.whatsapp} – ${branchLabel}`}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-white hover:bg-emerald-800"
        >
          <ChatIcon className="size-5" />
          {t.contact.whatsapp}
        </a>
      )}
      {hasPhone && (
        <a
          href={`tel:${branch.phone}`}
          aria-label={`${t.contact.call} – ${branchLabel}`}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-white px-5 py-3 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-gray-950 dark:text-emerald-400 dark:hover:bg-emerald-950"
        >
          <PhoneIcon className="size-5" />
          {t.contact.call}
        </a>
      )}
    </div>
  )
}

export default ContactButtons
