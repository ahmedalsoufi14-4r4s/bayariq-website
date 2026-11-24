import { useState } from 'react'
import { useCart } from '../cart/CartContext.js'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { getSendHintKey } from '../lib/branches.js'
import { getEstimatedTotal } from '../lib/cart.js'
import {
  formatFees,
  getDeliveryFee,
  getDistanceKm,
  getLocationUrl,
  getMissingAmount,
  getZone,
  reachesMinimum,
} from '../lib/delivery.js'
import { buildOrderMessage, buildWhatsAppUrl } from '../lib/orderMessage.js'
import { formatPrice } from '../lib/price.js'
import { fillIn } from '../lib/text.js'
import DeliveryInfo from './DeliveryInfo.jsx'
import { AlertIcon, ChatIcon } from './Icons.jsx'
import { BUTTON_ACCENT } from './styles.js'
import { useCustomerLocation } from './useCustomerLocation.js'

const { delivery } = store

// The border darkens on hover; on focus it turns green and a soft ring fades in around it.
// py-2.5 makes the one-line fields 46px tall, easy to tap.
const INPUT =
  'mt-1 w-full rounded-xl border border-line bg-canvas px-3 py-2.5 transition duration-200 ease-out hover:border-muted focus:border-main-ink focus:ring-4 focus:ring-main-ink/15'

// A radio choice: the whole row can be clicked, and it is 44px tall for fingers. It gets a soft
// highlight under the pointer, and while pressed (active:) it lights up and shrinks a little,
// so a tap on a phone shows too. -mx-2 and px-2 give the highlight some room without moving the text.
const RADIO_LABEL =
  'flex min-h-11 cursor-pointer items-center gap-2 -mx-2 rounded-lg px-2 transition duration-150 ease-out hover:bg-main-soft active:bg-main-soft motion-safe:active:scale-98 has-disabled:cursor-not-allowed has-disabled:text-muted'

function OrderForm() {
  const { t, language, localize } = useLanguage()
  const { lines, extraItems, setExtraItems } = useCart()
  const customerLocation = useCustomerLocation()
  const [customer, setCustomer] = useState({
    branch: '',
    name: '',
    district: '',
    method: 'pickup',
    time: '',
    notes: '',
  })

  const total = getEstimatedTotal(lines)
  const branch = store.branches.find((item) => item.id === customer.branch)
  // Delivery is only offered when the chosen branch delivers ("delivers": true in store.json),
  // and only for orders that reach the minimum.
  const branchDelivers = branch?.delivers === true
  const isBelowMinimum = !reachesMinimum(total, delivery)
  // Without delivery the order is always picked up, even if delivery was chosen before.
  const method = branchDelivers && !isBelowMinimum ? customer.method : 'pickup'

  // How far the customer is from the chosen branch, or null without a location.
  const { place } = customerLocation
  const distanceKm = place && branch ? getDistanceKm(place, branch) : null
  const isOutsideArea =
    method === 'delivery' &&
    distanceKm !== null &&
    !getZone(distanceKm, delivery)

  const hasOrder = lines.length > 0 || extraItems.trim() !== ''
  // Never send orders to a made-up number: the button stays disabled until the
  // chosen branch has its real WhatsApp number (see src/lib/branches.js).
  const sendHintKey = getSendHintKey({
    branches: store.branches,
    branch,
    hasOrder,
    isOutsideArea,
  })

  function branchLabel(item) {
    return fillIn(t.contact.branch, { district: localize(item, 'district') })
  }

  function change(name, value) {
    setCustomer((current) => ({ ...current, [name]: value }))
  }

  // One handler for every field: the input's name says which value to update.
  function handleChange(event) {
    change(event.target.name, event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const message = buildOrderMessage({
      lines,
      extraItems,
      customer: { ...customer, method },
      branch: branchLabel(branch),
      // Only for delivery. The location goes into the message and nowhere else.
      delivery:
        method === 'delivery'
          ? {
              fee: getDeliveryFee({ total, distanceKm, delivery }),
              fees: formatFees(delivery, language, t.currency),
              distanceKm,
              locationUrl: place && getLocationUrl(place),
            }
          : null,
      language,
      labels: t.order.message,
      units: t.products.units,
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
            <label key={item.id} className={RADIO_LABEL}>
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

      {branchDelivers ? (
        <fieldset>
          <legend>{t.order.method}</legend>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {['pickup', 'delivery'].map((option) => {
              const isDisabled = option === 'delivery' && isBelowMinimum
              return (
                <label key={option} className={RADIO_LABEL}>
                  <input
                    type="radio"
                    name="method"
                    value={option}
                    checked={method === option}
                    onChange={handleChange}
                    disabled={isDisabled}
                    aria-describedby={isDisabled ? 'minimum-hint' : undefined}
                    className="size-4 accent-main-ink"
                  />
                  {t.order.message[option]}
                </label>
              )
            })}
          </div>
          {/* Why delivery is off: an icon and clear text, never color alone. */}
          {isBelowMinimum && (
            <p
              id="minimum-hint"
              className="mt-1 flex items-start gap-1.5 text-sm text-muted"
            >
              <AlertIcon className="mt-0.5 size-4 shrink-0" />
              {fillIn(t.order.delivery.minimum, {
                minimum: formatPrice(delivery.minimumOrder, t.currency),
                missing: formatPrice(
                  getMissingAmount(total, delivery.minimumOrder),
                  t.currency,
                ),
              })}
            </p>
          )}
          {method === 'delivery' && (
            <DeliveryInfo
              total={total}
              distanceKm={distanceKm}
              customerLocation={customerLocation}
              branchLabel={branchLabel}
              onChooseBranch={(item) => change('branch', item.id)}
              onChoosePickup={() => change('method', 'pickup')}
            />
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
      {/* Why the button is off. A warning never relies on color alone: an icon and clear text. */}
      {sendHintKey && (
        <p
          id="send-hint"
          className="flex items-start justify-center gap-1.5 text-center text-sm text-muted"
        >
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          {t.order[sendHintKey]}
        </p>
      )}
    </form>
  )
}

export default OrderForm
