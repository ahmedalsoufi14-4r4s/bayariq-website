import categories from '../data/categories.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { CategoryIcon } from './Icons.jsx'

// aria-pressed tells screen readers which button is the active filter.
// The active filter is saffron (the accent), the others are white.
function FilterButton({ isSelected, onClick, children }) {
  const colors = isSelected
    ? 'border-accent bg-accent text-on-accent shadow-sm'
    : 'border-line bg-surface hover:border-main-ink'

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition duration-150 ease-out motion-safe:active:scale-97 ${colors}`}
    >
      {children}
    </button>
  )
}

// A row of category buttons. On small screens the row scrolls sideways on its own.
function CategoryFilter({ selected, onSelect }) {
  const { t, localize } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t.products.categoriesLabel}
      className="mt-4 flex gap-2 overflow-x-auto pb-2"
    >
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
