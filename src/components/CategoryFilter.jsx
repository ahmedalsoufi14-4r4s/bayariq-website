import { useLayoutEffect, useRef } from 'react'
import categories from '../data/categories.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { CategoryIcon } from './Icons.jsx'

// aria-pressed tells screen readers which button is the active filter.
// The active filter is saffron (the accent): a saffron pill slides behind the buttons to it
// (see CategoryFilter below). The button itself turns saffron a moment later (delay-150),
// once the pill has arrived, so it is saffron even if the pill could not be placed.
// The other buttons have no background, so the pill shows through them as it passes.
// relative draws the buttons above the pill.
function FilterButton({ isSelected, onClick, children }) {
  const colors = isSelected
    ? 'border-accent bg-accent text-on-accent motion-safe:delay-150'
    : 'border-line hover:border-main-ink'

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`relative flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm transition duration-150 ease-out motion-safe:active:scale-97 ${colors}`}
    >
      {children}
    </button>
  )
}

// Puts the pill exactly over a button. offsetLeft, offsetTop, offsetWidth and offsetHeight
// give the button's place and size inside the row (the row is "relative").
function placePill(pill, button) {
  pill.style.width = `${button.offsetWidth}px`
  pill.style.height = `${button.offsetHeight}px`
  pill.style.translate = `${button.offsetLeft}px ${button.offsetTop}px`
}

// A row of category buttons. On small screens the row scrolls sideways on its own.
function CategoryFilter({ selected, onSelect }) {
  const { t, localize } = useLanguage()
  const rowRef = useRef(null)
  const pillRef = useRef(null)

  // Runs after each new choice, before the browser paints. The pill's style is written
  // directly, so React does not have to draw the row again.
  useLayoutEffect(() => {
    const row = rowRef.current
    const pill = pillRef.current
    function place() {
      placePill(pill, row.querySelector('[aria-pressed="true"]'))
    }

    place()
    // The very first time, the pill shows up in place instead of sliding in: reading its size
    // makes the browser apply the place first, and only then data-ready turns the slide on.
    if (!pill.dataset.ready) {
      pill.getBoundingClientRect()
      pill.dataset.ready = 'true'
    }

    // The buttons change size when the web font arrives or the language changes, which can
    // move the chosen one. A ResizeObserver says when that happens, and the pill follows.
    const observer = new ResizeObserver(place)
    for (const button of row.querySelectorAll('button')) {
      observer.observe(button)
    }
    return () => observer.disconnect()
  }, [selected])

  return (
    <div
      ref={rowRef}
      role="group"
      aria-label={t.products.categoriesLabel}
      className="relative mt-4 flex gap-2 overflow-x-auto pb-2"
    >
      {/* left-0, not start-0: offsetLeft is always measured from the left, in both languages. */}
      <span
        ref={pillRef}
        aria-hidden="true"
        className="absolute top-0 left-0 rounded-full bg-accent shadow-sm shadow-main/20 ease-out motion-safe:data-ready:transition-[translate,width,height] motion-safe:data-ready:duration-300"
      />
      <FilterButton
        isSelected={selected === 'all'}
        onClick={() => onSelect('all')}
      >
        {t.products.all}
      </FilterButton>
      {categories.map((category) => (
        <FilterButton
          key={category.id}
          isSelected={selected === category.id}
          onClick={() => onSelect(category.id)}
        >
          <CategoryIcon name={category.icon} className="size-5" />
          {localize(category, 'name')}
        </FilterButton>
      ))}
    </div>
  )
}

export default CategoryFilter
