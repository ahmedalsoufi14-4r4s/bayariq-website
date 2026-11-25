import categories from '../data/categories.json'
import CategoryIllustration from './CategoryIllustration.jsx'
import Photo from './Photo.jsx'

// On a product card (a "group"), the picture grows a little while the pointer is over the card.
const HOVER_ZOOM =
  'transition duration-300 ease-out motion-safe:group-hover:scale-105'

// The tile of each "tint" in categories.json (the tint-* colors in index.css).
const TINTS = {
  leaf: 'bg-tint-leaf',
  mint: 'bg-tint-mint',
  mist: 'bg-tint-mist',
}

// Shows the product photo, on white. In dark mode it is a little dimmer, so a white tile does
// not glare on the dark page. A product without one, or whose photo fails to load, shows the
// picture of its category on a soft tile instead.
function ProductImage({ product, className = '' }) {
  const category = categories.find((item) => item.id === product.category)

  return (
    <div className={`aspect-square overflow-hidden ${className}`}>
      <Photo
        src={product.image}
        alt={product.name}
        width={400}
        height={400}
        className={`size-full object-contain dark:brightness-90 ${HOVER_ZOOM}`}
        fallback={
          <div
            className={`flex size-full items-center justify-center text-main-ink ${TINTS[category?.tint] ?? TINTS.leaf}`}
          >
            <CategoryIllustration
              name={category?.icon}
              className={`size-2/3 ${HOVER_ZOOM}`}
            />
          </div>
        }
      />
    </div>
  )
}

export default ProductImage
