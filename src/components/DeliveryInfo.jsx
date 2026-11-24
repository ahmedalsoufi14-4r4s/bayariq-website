import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import {
  findNearestDeliveringBranch,
  formatDistance,
  formatFees,
  getDeliveryFee,
  getMaxKm,
  getMissingAmount,
  getZone,
  isFreeDelivery,
} from '../lib/delivery.js'
import { formatPrice } from '../lib/price.js'
import { fillIn } from '../lib/text.js'
import {
  AlertIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  TruckIcon,
} from './Icons.jsx'
import { BUTTON_OUTLINE, CARD, TEXT_BUTTON } from './styles.js'

const { delivery } = store
const ICON = 'mt-0.5 size-5 shrink-0 text-main-ink'

// One line of the box: an icon and its text.
function Line({ Icon, motion = '', children }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className={`${ICON} ${motion}`} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

// Everything about delivery in the order form, shown once the customer picks delivery: the fee,
// how much is missing for free delivery, the hours, and the optional "use my location" button.
// distanceKm is null until the location is known. branchLabel(branch) gives "فرع المحاميد".
function DeliveryInfo({
  total,
  distanceKm,
  customerLocation,
  branchLabel,
  onChooseBranch,
  onChoosePickup,
}) {
  const { t, language } = useLanguage()
  const texts = t.order.delivery
  const { place, status, locate, forget } = customerLocation
  const km = getMaxKm(delivery)
  const isFree = isFreeDelivery(total, delivery)
  const isOutside = distanceKm !== null && !getZone(distanceKm, delivery)
  const distance =
    distanceKm === null ? '' : formatDistance(distanceKm, language)

  // The fee in words: not known yet, free, or by distance.
  function feeText() {
    if (isFree && distanceKm === null) {
      return fillIn(texts.freeWithinArea, { km })
    }
    if (isFree) return texts.free
    if (distanceKm === null) {
      return fillIn(texts.feeUnknown, {
        fees: formatFees(delivery, language, t.currency),
      })
    }
    const fee = getDeliveryFee({ total, distanceKm, delivery })
    return fillIn(texts.fee, { distance, fee: formatPrice(fee, t.currency) })
  }

  const nearest =
    isOutside && findNearestDeliveringBranch(place, store.branches, delivery)

  return (
    <div className={`mt-3 space-y-3 p-4 text-sm ${CARD}`}>
      {/* aria-live reads the new fee after the location or the cart changes. */}
      <div aria-live="polite" className="space-y-3">
        {isOutside ? (
          <Line
            Icon={AlertIcon}
            motion="motion-safe:card-active:animate-wiggle"
          >
            <p className="font-bold">
              {fillIn(texts.outside, { distance, km })}
            </p>
            <p className="mt-1">
              {nearest
                ? fillIn(texts.nearest, { branch: branchLabel(nearest) })
                : texts.noneNearby}
            </p>
          </Line>
        ) : (
          <Line Icon={TruckIcon} motion="motion-safe:card-active:animate-hop">
            <p className="font-bold">{feeText()}</p>
          </Line>
        )}
        {!isOutside && !isFree && (
          <Line Icon={TagIcon} motion="motion-safe:card-active:animate-wiggle">
            <p>
              {fillIn(texts.addForFree, {
                missing: formatPrice(
                  getMissingAmount(total, delivery.freeFrom),
                  t.currency,
                ),
              })}
            </p>
          </Line>
        )}
      </div>

      {isOutside && (
        <div className="flex flex-wrap gap-2">
          {nearest && (
            <button
              type="button"
              onClick={() => onChooseBranch(nearest)}
              className={`${BUTTON_OUTLINE} min-h-11 px-4`}
            >
              {fillIn(texts.chooseBranch, { branch: branchLabel(nearest) })}
            </button>
          )}
          <button
            type="button"
            onClick={onChoosePickup}
            className={`${BUTTON_OUTLINE} min-h-11 px-4`}
          >
            {texts.choosePickup}
          </button>
        </div>
      )}

      <Line Icon={ClockIcon} motion="motion-safe:card-active:animate-spin-once">
        <p>{texts.hours}</p>
        <ul className="text-muted">
          {delivery.hours.map((row) => (
            <li key={row.days_en}>
              {row[`days_${language}`]}: {row[`time_${language}`]}
            </li>
          ))}
        </ul>
      </Line>

      <Line Icon={MapPinIcon} motion="motion-safe:card-active:animate-hop">
        {place ? (
          <div className="flex flex-wrap items-center gap-x-3">
            <p>{texts.located}</p>
            <button type="button" onClick={forget} className={TEXT_BUTTON}>
              {texts.forgetLocation}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              type="button"
              onClick={locate}
              disabled={status === 'locating'}
              className={`${BUTTON_OUTLINE} min-h-11 px-4`}
            >
              {status === 'locating' ? texts.locating : texts.useLocation}
            </button>
            <p className="text-muted">{texts.optional}</p>
          </div>
        )}
        <p role="status" className="mt-1">
          {status === 'failed' && texts.locationFailed}
        </p>
        <p className="text-muted">{texts.privacy}</p>
      </Line>
    </div>
  )
}

export default DeliveryInfo
