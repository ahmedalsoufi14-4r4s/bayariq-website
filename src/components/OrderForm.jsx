import { useState } from 'react'
import { useCart } from '../cart/CartContext.js'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { buildOrderMessage, buildWhatsAppUrl } from '../lib/orderMessage.js'
import { isPlaceholder } from '../lib/placeholder.js'
import { ChatIcon } from './Icons.jsx'

const INPUT =
  'mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 focus:border-emerald-700'

function OrderForm() {
  const { t, language, localize } = useLanguage()
  const { lines, extraItems, setExtraItems } = useCart()
  const [customer, setCustomer] = useState({
    name: '',
    district: '',
    method: 'pickup',
    time: '',
    notes: '',
  })

  // Delivery is only offered when store.json says so ("delivers": true).
  const canDeliver = store.delivers === true
  // Never send orders to a made-up number: the button stays disabled until the real one is added.
  const hasWhatsApp = !isPlaceholder(store.whatsapp)
  const hasOrder = lines.length > 0 || extraItems.trim() !== ''

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
      customer,
      language,
      labels: t.order.message,
      currency: t.currency,
    })
    window.open(
      buildWhatsAppUrl(store.whatsapp, message),
      '_blank',
      'noopener,noreferrer',
    )
  }

  let sendHint = null
  if (!hasWhatsApp) sendHint = t.order.whatsappComingSoon
  else if (!hasOrder) sendHint = t.order.emptyHint

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 border-t border-gray-200 pt-6"
    >
      <div>
        <label htmlFor="extra-items" className="font-medium">
          {t.order.extraItems}
        </label>
        <textarea
          id="extra-items"
          value={extraItems}
          onChange={(event) => setExtraItems(event.target.value)}
          rows={2}
          placeholder={t.order.extraItemsPlaceholder}
          className={INPUT}
        />
      </div>

      <h3 className="pt-2 text-lg font-semibold">{t.order.title}</h3>

      <div>
        <label htmlFor="order-name" className="font-medium">
          {t.order.name}
        </label>
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
        <label htmlFor="order-district" className="font-medium">
          {t.order.district}
        </label>
        <input
          id="order-district"
          name="district"
          value={customer.district}
          onChange={handleChange}
          required={customer.method === 'delivery'}
          className={INPUT}
        />
      </div>

      {canDeliver ? (
        <fieldset>
          <legend className="font-medium">{t.order.method}</legend>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {['pickup', 'delivery'].map((method) => (
              <label key={method} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="method"
                  value={method}
                  checked={customer.method === method}
                  onChange={handleChange}
                  className="size-4 accent-emerald-700"
                />
                {t.order.message[method]}
              </label>
            ))}
          </div>
          {customer.method === 'delivery' &&
            !isPlaceholder(store.delivery_ar) && (
              <p className="mt-2 text-sm text-gray-600">
                {localize(store, 'delivery')}
              </p>
            )}
        </fieldset>
      ) : (
        <p>
          <span className="font-medium">{t.order.message.method}</span>{' '}
          {t.order.message.pickup}
        </p>
      )}

      <div>
        <label htmlFor="order-time" className="font-medium">
          {t.order.time}
        </label>
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
        <label htmlFor="order-notes" className="font-medium">
          {t.order.notes}
        </label>
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
        disabled={!hasWhatsApp || !hasOrder}
        aria-describedby={sendHint ? 'send-hint' : undefined}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600"
      >
        <ChatIcon className="size-5" />
        {t.order.send}
      </button>
      {sendHint && (
        <p id="send-hint" className="text-center text-sm text-gray-600">
          {sendHint}
        </p>
      )}
    </form>
  )
}

export default OrderForm
