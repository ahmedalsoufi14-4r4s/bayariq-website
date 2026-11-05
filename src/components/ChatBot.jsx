import { useEffect, useRef, useState } from 'react'
import products from '../data/products.json'
import store from '../data/store.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { matchQuestion } from '../lib/chatQuestions.js'
import { useTour } from '../tour/TourContext.js'
import ChatMessage from './ChatMessage.jsx'
import { ChatIcon, CloseIcon, SendIcon } from './Icons.jsx'
import { BUTTON_MAIN, ICON_BUTTON } from './styles.js'

// How long the typing dots show before each answer.
const TYPING_MS = 700

// The room left above the newest message when the conversation scrolls to it (p-4 below).
const LOG_PADDING_PX = 16

// The conversation starts with the helper's greeting and the topic chips.
const GREETING = { id: 0, from: 'bot', question: { topic: 'greeting' } }

// The round saffron button in the corner. Like the other saffron buttons (BUTTON_ACCENT in
// styles.js) it lifts and shines under the pointer and shrinks a little when pressed, with a
// bigger shadow because it floats above the page. Its keyboard focus shows a white ring inside
// the usual navy outline, so it stays visible over the navy bands too.
const CHAT_BUTTON =
  'shine group pointer-events-auto flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent shadow-lg shadow-main/30 transition duration-150 ease-out hover:bg-accent-hover hover:shadow-xl focus-visible:ring-2 focus-visible:ring-on-main motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-90'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// The quick-answer helper: a round button in the bottom corner (on the end side) opens a
// small chat panel above it. Every answer comes from the data files (src/lib/chatAnswers.js).
function ChatBot() {
  const { t } = useLanguage()
  const { startTour, isRunning: isTourRunning } = useTour()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  // The id of the answer whose typing dots are showing, or null.
  const [typingId, setTypingId] = useState(null)
  const [draft, setDraft] = useState('')
  const panelRef = useRef(null)
  const buttonRef = useRef(null)
  const logRef = useRef(null)
  const inputRef = useRef(null)
  // The panel steps aside while the first-visit tour runs, so it never covers what the tour
  // points at, and comes back afterwards if it was open.
  const isPanelOpen = isOpen && !isTourRunning

  // show() opens the <dialog> without blocking the page, unlike showModal() for the cart:
  // the visitor can still scroll, add products and open the cart while the chat is open.
  // It also moves keyboard focus into the panel.
  useEffect(() => {
    const panel = panelRef.current
    if (isPanelOpen && !panel.open) panel.show()
    if (!isPanelOpen && panel.open) panel.close()
  }, [isPanelOpen])

  // The typing dots show for a moment, then the answer takes their place.
  useEffect(() => {
    if (typingId === null) return
    const timer = setTimeout(() => setTypingId(null), TYPING_MS)
    return () => clearTimeout(timer)
  }, [typingId])

  // Scrolls so the newest message starts near the top of the conversation, or as far down as
  // it goes, so a long answer is read from its start. offsetTop is measured from the log,
  // because the log is "relative". The browser stops at the end on its own.
  useEffect(() => {
    const log = logRef.current
    log.scrollTop = log.lastElementChild.offsetTop - LOG_PADDING_PX
  }, [messages, typingId, isPanelOpen])

  // Adds the visitor's question and the helper's answer to it. typedText is what the visitor
  // typed; a tapped chip has none, and its label shows instead (ChatMessage.jsx).
  // Messages are never removed, so their count gives each new one its own id.
  function ask(question, typedText) {
    // The "take the tour again" chip closes the chat and starts the tour instead.
    // Focus comes back to the chat button when the tour ends.
    if (question.topic === 'tour') {
      close()
      startTour(buttonRef.current)
      return
    }
    const id = messages.length
    setMessages([
      ...messages,
      { id, from: 'visitor', question, text: typedText },
      { id: id + 1, from: 'bot', question },
    ])
    // With less motion asked for, the answer shows at once, without the dots.
    setTypingId(prefersReducedMotion() ? null : id + 1)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const text = draft.trim()
    if (text === '') return
    ask(matchQuestion(text, { branches: store.branches, products }), text)
    setDraft('')
    // The send button turns off once the box is empty. If it was clicked, it had the focus,
    // which would then be lost, so focus goes back to the box for the next question.
    inputRef.current.focus()
  }

  // The close button, Escape and the round button all close the panel, and focus goes back
  // to the round button, so keyboard users carry on from where they opened it.
  function close() {
    setIsOpen(false)
    buttonRef.current.focus()
  }

  function toggle() {
    if (isOpen) close()
    else setIsOpen(true)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && isOpen) close()
  }

  return (
    // fixed keeps the button and the panel in the corner while the page scrolls. This box
    // reaches from under the sticky header (top-32 on phones, top-24 from md) down to the
    // corner, so the panel can never grow over the header and its cart button. z-20 puts it
    // above the page but under the header (z-30). The cart and the product details open above
    // it, because showModal() puts them in the browser's top layer.
    // pointer-events-none lets clicks on the empty part of the box reach the page below.
    <div
      onKeyDown={handleKeyDown}
      className="pointer-events-none fixed end-4 top-32 bottom-4 z-20 flex flex-col items-end justify-end gap-3 md:top-24"
    >
      {/* The panel is 32rem tall, and shrinks (min-h-0) when the screen is shorter.
          It slides up and grows out of the button (chat-panel in index.css). */}
      <dialog
        ref={panelRef}
        id="chat-panel"
        aria-labelledby="chat-title"
        className="chat-panel pointer-events-auto relative h-[32rem] min-h-0 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl bg-canvas p-0 text-ink shadow-2xl ring-1 ring-line"
      >
        <div className="flex h-full flex-col">
          <div className="surface-main flex items-center gap-3 px-4 py-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-on-main/10">
              <ChatIcon className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="chat-title" className="font-bold">
                {t.chat.title}
              </h2>
              <p className="text-sm text-on-main/80">{t.chat.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={t.chat.close}
              className={`${ICON_BUTTON} -me-2 hover:bg-on-main/10`}
            >
              <CloseIcon className="size-6 transition duration-300 ease-out motion-safe:group-hover:rotate-90" />
            </button>
          </div>

          {/* role="log" makes screen readers read each new message, without moving focus.
              aria-relevant="additions" reads only new messages, not the old ones again
              when the language changes. overscroll-contain stops the page from scrolling
              once the conversation reaches its end. */}
          <div
            ref={logRef}
            role="log"
            aria-label={t.chat.log}
            aria-relevant="additions"
            className="relative min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 motion-safe:scroll-smooth"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isTyping={message.id === typingId}
                onAsk={ask}
              />
            ))}
          </div>

          {/* enterKeyHint shows "send" on the Enter key of phone keyboards. */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-line bg-surface p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              {t.chat.inputLabel}
            </label>
            <input
              ref={inputRef}
              id="chat-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t.chat.inputPlaceholder}
              autoComplete="off"
              enterKeyHint="send"
              className="min-h-11 min-w-0 flex-1 rounded-full border border-line bg-canvas px-4 transition duration-200 ease-out hover:border-muted focus:border-main-ink focus:ring-4 focus:ring-main-ink/15"
            />
            <button
              type="submit"
              disabled={draft.trim() === ''}
              aria-label={t.chat.send}
              className={`${BUTTON_MAIN} size-11 shrink-0`}
            >
              <SendIcon className="size-5 rtl:-scale-x-100" />
            </button>
          </form>
        </div>
      </dialog>

      {/* aria-expanded tells screen readers whether the panel is open.
          The chat bubble rocks under the pointer, and turns into a cross while the panel is open. */}
      <button
        ref={buttonRef}
        type="button"
        data-tour="chat"
        onClick={toggle}
        aria-label={t.chat.open}
        aria-expanded={isPanelOpen}
        aria-controls="chat-panel"
        aria-haspopup="dialog"
        className={CHAT_BUTTON}
      >
        {isPanelOpen ? (
          <CloseIcon className="size-7 transition duration-300 ease-out motion-safe:group-hover:rotate-90" />
        ) : (
          <ChatIcon className="size-7 motion-safe:group-hover:animate-wiggle" />
        )}
      </button>
    </div>
  )
}

export default ChatBot
