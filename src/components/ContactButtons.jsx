import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { ChatIcon, PhoneIcon } from './Icons.jsx'

// WhatsApp and call buttons, used in the hero and in the store info section.
function ContactButtons() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={`https://wa.me/${store.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-medium text-white hover:bg-emerald-800"
      >
        <ChatIcon className="size-5" />
        {t.contact.whatsapp}
      </a>
      <a
        href={`tel:${store.phone}`}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-white px-5 py-3 font-medium text-emerald-700 hover:bg-emerald-50"
      >
        <PhoneIcon className="size-5" />
        {t.contact.call}
      </a>
    </div>
  )
}

export default ContactButtons
