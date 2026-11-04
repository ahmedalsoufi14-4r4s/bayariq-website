import categories from '../data/categories.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import Photo from './Photo.jsx'

// Shows the product photo, or the category icon until a photo is added.
function ProductImage({ product, className = '' }) {
  const { localize } = useLanguage()
  const category = categories.find((item) => item.id === product.category)

  return (
    <Photo
      src={product.image}
      alt={localize(product, 'name')}
      width={400}
      height={400}
      className={`aspect-square w-full object-cover ${className}`}
      fallback={
        <div
          className={`flex aspect-square w-full items-center justify-center bg-emerald-50 text-5xl dark:bg-emerald-950 ${className}`}
        >
          <span aria-hidden="true">{category?.icon}</span>
        </div>
      }
    />
  )
}

export default ProductImage
