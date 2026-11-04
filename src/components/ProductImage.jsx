import categories from '../data/categories.json'
import { useLanguage } from '../i18n/LanguageContext.js'

// Shows the product photo, or the category icon until a photo is added.
function ProductImage({ product, className = '' }) {
  const { localize } = useLanguage()

  if (product.image) {
    return (
      <img
        // Photos go in public/, so their path must start with the site's base path.
        src={import.meta.env.BASE_URL + product.image}
        alt={localize(product, 'name')}
        loading="lazy"
        className={`aspect-square w-full object-cover ${className}`}
      />
    )
  }

  const category = categories.find((item) => item.id === product.category)

  return (
    <div
      className={`flex aspect-square w-full items-center justify-center bg-emerald-50 text-5xl ${className}`}
    >
      <span aria-hidden="true">{category?.icon}</span>
    </div>
  )
}

export default ProductImage
