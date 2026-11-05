import { useCart } from '../cart/CartContext.js'
import offers from '../data/offers.json'
import products from '../data/products.json'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { buildAnswer, getQuestionLabel } from '../lib/chatAnswers.js'
import { formatPrice } from '../lib/price.js'
import {
  CartIcon,
  ChatIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
} from './Icons.jsx'
import { BUTTON_ACCENT, BUTTON_MAIN, BUTTON_OUTLINE } from './styles.js'

// Messages grow in from a little below (pop-in in index.css).
const POP_IN = 'motion-safe:animate-pop-in'

// A quick question to tap: navy text and outline on white. Like the other buttons it lifts
// under the pointer and shrinks a little while pressed. min-h-11 makes it 44px for fingers.
const CHIP =
  'min-h-11 rounded-full border border-main-ink/30 bg-surface px-4 text-sm text-main-ink transition duration-150 ease-out hover:border-main-ink hover:bg-main-soft motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95'

// The icon on each kind of link in an answer (see chatAnswers.js).
const LINK_ICONS = { whatsapp: ChatIcon, call: PhoneIcon, map: MapPinIcon }

// Three dots that hop one after another while the helper "types" (typing in index.css).
// Screen readers skip them and read the answer when it comes.
function TypingDots() {
  return (
    <div
      aria-hidden="true"
      className={`flex w-fit gap-1.5 rounded-2xl rounded-es-sm bg-surface px-4 py-4 shadow-sm ring-1 ring-line ${POP_IN}`}
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
          className="size-2 rounded-full bg-muted motion-safe:animate-typing"
        />
      ))}
    </div>
  )
}

// A product the helper found, with its own Add to cart button (like on the product cards).
function ChatProduct({ product }) {
  const { t, localize } = useLanguage()
  const { add, getQuantity } = useCart()
  const name = localize(product, 'name')
  const quantity = getQuantity(product.id)

  return (
    <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl bg-surface p-3 shadow-sm ring-1 ring-line">
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-sm text-muted">
          {localize(product, 'unit')} ·{' '}
          {product.price === null
            ? t.products.priceOnRequest
            : formatPrice(product.price, t.currency)}
          {!product.inStock && ` · ${t.products.outOfStock}`}
        </p>
        {/* A new key makes React draw a new line, so it slides in again on every change. */}
        {quantity > 0 && (
          <p
            key={quantity}
            className="text-sm font-bold text-main-ink motion-safe:animate-appear"
          >
            {t.cart.inCart} {quantity}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => add(product)}
        disabled={!product.inStock}
        aria-label={`${t.cart.add}: ${name}`}
        className={`${BUTTON_ACCENT} min-h-11 px-3 text-sm`}
      >
        <PlusIcon className="size-4" />
        {t.cart.add}
      </button>
    </li>
  )
}

// One message in the chat. The visitor's sit on the end side in navy, the helper's on the
// start side in white. The answer is built here, on every render, from the question
// (chatAnswers.js), so the whole conversation follows the language switch.
// The hidden "أنت:" / "مساعد بيارق:" tells screen reader users who is speaking.
function ChatMessage({ message, isTyping, onAsk }) {
  const { t, language } = useLanguage()
  const { openCart } = useCart()
  const context = { store, offers, products, t, language, now: new Date() }

  if (message.from === 'visitor') {
    return (
      <div className={`flex justify-end ${POP_IN}`}>
        <p className="max-w-[85%] rounded-2xl rounded-ee-sm bg-main px-4 py-2 text-on-main">
          <span className="sr-only">{t.chat.you}: </span>
          {message.text ?? getQuestionLabel(message.question, context)}
        </p>
      </div>
    )
  }

  if (isTyping) return <TypingDots />

  const answer = buildAnswer(message.question, context)
  const hasButtons = answer.links?.length > 0 || answer.showCart

  return (
    <div className={`flex flex-col items-start gap-2 ${POP_IN}`}>
      <div className="max-w-[90%] rounded-2xl rounded-es-sm bg-surface px-4 py-3 shadow-sm ring-1 ring-line">
        <span className="sr-only">{t.chat.title}: </span>
        <p>{answer.text}</p>
        {answer.list && (
          <ul className="mt-2 list-disc space-y-1 ps-5">
            {answer.list.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        )}
        {answer.steps && (
          <ol className="mt-2 list-decimal space-y-1 ps-5">
            {answer.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        )}
        {answer.note && (
          <p className="mt-2 text-sm text-muted">{answer.note}</p>
        )}
      </div>

      {answer.products && (
        <ul className="w-full space-y-2">
          {answer.products.map((product) => (
            <ChatProduct key={product.id} product={product} />
          ))}
        </ul>
      )}

      {hasButtons && (
        <div className="flex flex-wrap gap-2">
          {answer.links?.map((link) => {
            const LinkIcon = LINK_ICONS[link.type]
            // A call stays in this tab; WhatsApp and Google Maps open in a new one.
            const newTab = link.type !== 'call'
            return (
              <a
                key={link.href}
                href={link.href}
                target={newTab ? '_blank' : undefined}
                rel={newTab ? 'noopener noreferrer' : undefined}
                className={`${BUTTON_MAIN} min-h-11 px-4 text-sm`}
              >
                <LinkIcon className="size-5" />
                {link.label}
              </a>
            )
          })}
          {answer.showCart && (
            <button
              type="button"
              onClick={openCart}
              className={`${BUTTON_OUTLINE} min-h-11 px-4 text-sm`}
            >
              <CartIcon className="size-5" />
              {t.chat.openCart}
            </button>
          )}
        </div>
      )}

      {answer.chips && (
        <div
          role="group"
          aria-label={t.chat.suggestions}
          className="flex flex-wrap gap-2"
        >
          {answer.chips.map((chip) => (
            <button
              key={`${chip.topic} ${chip.branchId ?? ''}`}
              type="button"
              onClick={() => onAsk(chip)}
              className={CHIP}
            >
              {getQuestionLabel(chip, context)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChatMessage
