import { useState } from 'react'
import { useCart } from '../cart/CartContext.js'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { getSendHintKey } from '../lib/branches.js'
import { buildOrderMessage, buildWhatsAppUrl } from '../lib/orderMessage.js'
import { isPlaceholder } from '../lib/placeholder.js'
import { fillIn } from '../lib/text.js'
import { ChatIcon } from './Icons.jsx'
import { BUTTON_ACCENT } from './styles.js'

// The border darkens on hover; on focus it turns navy and a soft ring fades in around it.
const INPUT =
  'mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2 transition duration-200 ease-out hover:border-muted focus:border-main-ink focus:ring-4 focus:ring-main-ink/15'

function OrderForm() {
  const { t, language, localize } = useLanguage()
  const { lines, extraItems, setExtraItems } = useCart()
  const [customer, setCustomer] = useState({
    branch: '',
    name: '',
    district: '',
    method: 'pickup',
    time: '',
    notes: '',
  })

  const branch = store.branches.find((item) => item.id === customer.branch)
  // Delivery is only offered when the chosen branch delivers ("delivers": true in store.json).
  const canDeliver = branch?.delivers === true
  // A branch that does not deliver always means pickup, even if delivery was picked for another branch.
  const method = canDeliver ? customer.method : 'pickup'
  const hasOrder = lines.length > 0 || extraItems.trim() !== ''
  // Never send orders to a made-up number: the button stays disabled until the
  // chosen branch has its real WhatsApp number (see src/lib/branches.js).
  const sendHintKey = getSendHintKey({
    branches: store.branches,
    branch,
    hasOrder,
  })

  function branchLabel(item) {
    return fillIn(t.contact.branch, { district: localize(item, 'district') })
  }

  // One handler for every field: the input's name says which value to update.
  function handleChange(event) {
    const { name, value } = event.target
    setCustomer((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const message = buildOrderMessage({
      lines,
      extraItems,
      customer: { ...customer, method },
      branch: branchLabel(branch),
      language,
      labels: t.order.message,
      currency: t.currency,
    })
    window.open(
      buildWhatsAppUrl(branch.whatsapp, message),
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 border-t border-line pt-6"
    >
      <div>
        <label htmlFor="extra-items">{t.order.extraItems}</label>
        <textarea
          id="extra-items"
          value={extraItems}
          onChange={(event) => setExtraItems(event.target.value)}
          rows={2}
          placeholder={t.order.extraItemsPlaceholder}
          className={INPUT}
        />
      </div>

      <h3 className="pt-2 text-lg font-bold">{t.order.title}</h3>

      <fieldset>
        <legend>{t.order.branch}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {store.branches.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name="branch"
                value={item.id}
                checked={customer.branch === item.id}
                onChange={handleChange}
                required
                className="size-4 accent-main-ink"
              />
              {branchLabel(item)}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="order-name">{t.order.name}</label>
        <input
          id="order-name"
          name="name"
          value={customer.name}
          onChange={handleChange}
          required
          autoComplete="name"
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="order-district">{t.order.district}</label>
        <input
          id="order-district"
          name="district"
          value={customer.district}
          onChange={handleChange}
          required={method === 'delivery'}
          className={INPUT}
        />
      </div>

      {canDeliver ? (
        <fieldset>
          <legend>{t.order.method}</legend>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {['pickup', 'delivery'].map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="radio"
                  name="method"
                  value={option}
                  checked={method === option}
                  onChange={handleChange}
                  className="size-4 accent-main-ink"
                />
                {t.order.message[option]}
              </label>
            ))}
          </div>
          {method === 'delivery' && !isPlaceholder(branch.delivery_ar) && (
            <p className="mt-2 text-sm text-muted">
              {localize(branch, 'delivery')}
            </p>
          )}
        </fieldset>
      ) : (
        <p>
          <span>{t.order.message.method}</span> {t.order.message.pickup}
        </p>
      )}

      <div>
        <label htmlFor="order-time">{t.order.time}</label>
        <input
          id="order-time"
          name="time"
          value={customer.time}
          onChange={handleChange}
          placeholder={t.order.timePlaceholder}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="order-notes">{t.order.notes}</label>
        <textarea
          id="order-notes"
          name="notes"
          value={customer.notes}
          onChange={handleChange}
          rows={2}
          className={INPUT}
        />
      </div>

      <button
        type="submit"
        disabled={sendHintKey !== null}
        aria-describedby={sendHintKey ? 'send-hint' : undefined}
        className={`${BUTTON_ACCENT} w-full px-5 py-3`}
      >
        <ChatIcon className="size-5" />
        {t.order.send}
      </button>
      {sendHintKey && (
        <p id="send-hint" className="text-center text-sm text-muted">
          {t.order[sendHintKey]}
        </p>
      )}
    </form>
  )
}

export default OrderForm
