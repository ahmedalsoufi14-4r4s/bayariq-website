import { useState } from 'react'
import { useCart } from '../cart/CartContext.js'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { getSendHintKey } from '../lib/branches.js'
import { buildOrderMessage, buildWhatsAppUrl } from '../lib/orderMessage.js'
import { isPlaceholder } from '../lib/placeholder.js'
import { fillIn } from '../lib/text.js'
import { ChatIcon } from './Icons.jsx'

const INPUT =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:border-emerald-700 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-emerald-400'

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
      className="mt-6 space-y-4 border-t border-gray-200 pt-6 dark:border-gray-800"
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
            <label key={item.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="branch"
                value={item.id}
                checked={customer.branch === item.id}
                onChange={handleChange}
                required
                className="size-4 accent-emerald-700 dark:accent-emerald-400"
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
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="method"
                  value={option}
                  checked={method === option}
                  onChange={handleChange}
                  className="size-4 accent-emerald-700 dark:accent-emerald-400"
                />
                {t.order.message[option]}
              </label>
            ))}
          </div>
          {method === 'delivery' && !isPlaceholder(branch.delivery_ar) && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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
        className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
      >
        <ChatIcon className="size-5" />
        {t.order.send}
      </button>
      {sendHintKey && (
        <p
          id="send-hint"
          className="text-center text-sm text-gray-600 dark:text-gray-400"
        >
          {t.order[sendHintKey]}
        </p>
      )}
    </form>
  )
}

export default OrderForm
