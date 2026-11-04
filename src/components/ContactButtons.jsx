import { useLanguage } from '../i18n/LanguageContext.js'
import { isPlaceholder } from '../lib/placeholder.js'
import { ChatIcon, PhoneIcon } from './Icons.jsx'
import { BUTTON_MAIN, BUTTON_OUTLINE } from './styles.js'

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
          className={`${BUTTON_MAIN} px-5 py-3`}
        >
          <ChatIcon className="size-5" />
          {t.contact.whatsapp}
        </a>
      )}
      {hasPhone && (
        <a
          href={`tel:${branch.phone}`}
          aria-label={`${t.contact.call} – ${branchLabel}`}
          className={`${BUTTON_OUTLINE} px-5 py-3`}
        >
          <PhoneIcon className="size-5" />
          {t.contact.call}
        </a>
      )}
    </div>
  )
}

export default ContactButtons
