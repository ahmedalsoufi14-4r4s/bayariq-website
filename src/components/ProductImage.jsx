import categories from '../data/categories.json'
import { useLanguage } from '../i18n/LanguageContext.js'
import { CategoryIcon } from './Icons.jsx'
import Photo from './Photo.jsx'

// On a product card (a "group"), the picture grows a little while the pointer is over the card.
const HOVER_ZOOM =
  'transition duration-300 ease-out motion-safe:group-hover:scale-105'

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
      className={`aspect-square w-full object-cover ${HOVER_ZOOM} ${className}`}
      fallback={
        <div
          className={`flex aspect-square w-full items-center justify-center bg-main-soft text-main-ink ${className}`}
        >
          <CategoryIcon
            name={category?.icon}
            className={`size-16 ${HOVER_ZOOM}`}
          />
        </div>
      }
    />
  )
}

export default ProductImage
