import categories from '../data/categories.json'
import { useLanguage } from '../i18n/LanguageContext.js'

// aria-pressed tells screen readers which button is the active filter.
function FilterButton({ isSelected, onClick, children }) {
  const colors = isSelected
    ? 'border-emerald-700 bg-emerald-700 text-white'
    : 'border-gray-300 bg-white hover:border-emerald-700 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-emerald-400'

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm ${colors}`}
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
          <span aria-hidden="true">{category.icon}</span>
          {localize(category, 'name')}
        </FilterButton>
      ))}
    </div>
  )
}

export default CategoryFilter
