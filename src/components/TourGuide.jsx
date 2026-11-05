import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.js'
import { fillIn } from '../lib/text.js'
import { placeTooltip, spotlightBox } from '../lib/tourPosition.js'
import {
  CartIcon,
  ChatIcon,
  MapPinIcon,
  MenuIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
} from './Icons.jsx'
import { BUTTON_ACCENT, BUTTON_OUTLINE, CARD } from './styles.js'

// The room around the highlighted element.
const SPOTLIGHT_PADDING = 8

// The icon of each step ("icon" in src/data/tour.json).
const STEP_ICONS = {
  menu: MenuIcon,
  moon: MoonIcon,
  search: SearchIcon,
  plus: PlusIcon,
  cart: CartIcon,
  pin: MapPinIcon,
  chat: ChatIcon,
}

// Brings the step's element on screen. The sticky header and the chat button never leave it;
// anything else that is not fully visible under the header scrolls to the middle.
function scrollToStep(target) {
  if (target.closest('header')) return
  const headerBottom = document
    .querySelector('header')
    .getBoundingClientRect().bottom
  const box = target.getBoundingClientRect()
  if (box.top >= headerBottom && box.bottom <= window.innerHeight) return
  target.scrollIntoView({ block: 'center' })
}

// Puts an element at screen position x, y. The first time it jumps there; after that
// data-ready turns its transition on, so it glides from step to step (like the category pill).
function moveTo(element, x, y) {
  element.style.translate = `${x}px ${y}px`
  if (!element.dataset.ready) {
    element.getBoundingClientRect()
    element.dataset.ready = 'true'
  }
}

// The first-visit tour: a spotlight on one part of the page and a tooltip that explains it,
// one step after another. It is a <dialog> opened with showModal(), so it sits above
// everything, screen readers announce it, keyboard focus stays inside it, and Escape closes
// it. The spotlight is a clear box whose very wide shadow dims the rest of the page
// (tour-spotlight in index.css).
function TourGuide({ steps, onEnd }) {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const dialogRef = useRef(null)
  const spotlightRef = useRef(null)
  const tooltipRef = useRef(null)
  const nextRef = useRef(null)

  const step = steps[index]
  const isLast = index === steps.length - 1
  const StepIcon = STEP_ICONS[step.icon]
  const stepTexts = t.tour.steps[step.id]

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  // Places the spotlight on the step's element and the tooltip next to it, and keeps them
  // there while the page scrolls to it, the window changes size, the element or the tooltip
  // changes size, or a card finishes fading in.
  useLayoutEffect(() => {
    if (!isOpen) return
    const target = document.querySelector(step.target)
    const spotlight = spotlightRef.current
    const tooltip = tooltipRef.current

    function place() {
      const box = spotlightBox(
        target.getBoundingClientRect(),
        SPOTLIGHT_PADDING,
      )
      spotlight.style.width = `${box.width}px`
      spotlight.style.height = `${box.height}px`
      // As round as the element, so a round button gets a round spotlight.
      const radius = parseFloat(getComputedStyle(target).borderRadius)
      spotlight.style.borderRadius = `${radius + SPOTLIGHT_PADDING}px`
      moveTo(spotlight, box.x, box.y)

      const { x, y } = placeTooltip({
        spotlight: box,
        tooltip: { width: tooltip.offsetWidth, height: tooltip.offsetHeight },
        screen: {
          width: document.documentElement.clientWidth,
          height: window.innerHeight,
        },
      })
      moveTo(tooltip, x, y)
    }

    scrollToStep(target)
    place()
    window.addEventListener('scroll', place)
    window.addEventListener('resize', place)
    document.addEventListener('animationend', place)
    const observer = new ResizeObserver(place)
    observer.observe(target)
    observer.observe(tooltip)
    return () => {
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
      document.removeEventListener('animationend', place)
      observer.disconnect()
    }
  }, [step, isOpen])

  // Keyboard focus sits on "Next", so Enter goes on to the next step.
  useEffect(() => {
    nextRef.current.focus()
  }, [index])

  // Skip, the last "Next" and Escape all close the dialog, and its "close" event ends the tour.
  function close() {
    dialogRef.current.close()
  }

  function handleClose() {
    setIsOpen(false)
    onEnd()
  }

  function goNext() {
    if (isLast) close()
    else setIndex(index + 1)
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-label={t.tour.label}
      aria-describedby="tour-step"
      className="tour m-0 size-full max-h-none max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-transparent"
    >
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="tour-spotlight absolute top-0 left-0 ease-out motion-safe:data-ready:transition-[translate,width,height,border-radius] motion-safe:data-ready:duration-300"
      />

      {/* The tooltip is a card, so it lifts, tilts and glows under the pointer or a tap,
          and its icon wiggles. aria-live reads each new step aloud. */}
      <div
        ref={tooltipRef}
        className="tour-tooltip absolute top-0 left-0 w-[calc(100vw-2rem)] max-w-xs ease-out motion-safe:data-ready:transition-[translate] motion-safe:data-ready:duration-300"
      >
        <div className={`${CARD} p-4 text-ink`}>
          <div id="tour-step" aria-live="polite">
            {/* A new key draws the step's text again, so it slides in at each step. */}
            <div key={step.id} className="motion-safe:animate-appear">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-main-soft text-main-ink motion-safe:card-active:animate-wiggle">
                  <StepIcon className="size-6" />
                </span>
                {/* dir="ltr" keeps "2 / 7" in this order in Arabic too. */}
                <p dir="ltr" className="text-sm font-bold text-muted">
                  {fillIn(t.tour.counter, {
                    current: index + 1,
                    total: steps.length,
                  })}
                </p>
              </div>
              <h2 className="mt-3 text-lg font-bold">{stepTexts.title}</h2>
              <p className="mt-1">{stepTexts.text}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={close}
              className="me-auto min-h-11 rounded-full px-2 text-sm text-muted underline hover:bg-main-soft hover:text-ink"
            >
              {t.tour.skip}
            </button>
            {index > 0 && (
              <button
                type="button"
                onClick={() => setIndex(index - 1)}
                className={`${BUTTON_OUTLINE} min-h-11 px-4 text-sm`}
              >
                {t.tour.back}
              </button>
            )}
            <button
              ref={nextRef}
              type="button"
              onClick={goNext}
              className={`${BUTTON_ACCENT} min-h-11 px-5 text-sm`}
            >
              {isLast ? t.tour.done : t.tour.next}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default TourGuide
