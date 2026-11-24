// Softly pulsing boxes in the shape of product cards, shown while products load.
// aria-hidden, because the results line says that products are loading (Products.jsx).
function ProductSkeletons({ count }) {
  return (
    <div
      aria-hidden="true"
      className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line motion-safe:animate-pulse"
        >
          <div className="aspect-square bg-main-soft" />
          <div className="space-y-3 p-3">
            <div className="h-5 rounded-full bg-main-soft" />
            <div className="h-4 w-1/3 rounded-full bg-main-soft" />
            <div className="h-5 w-1/2 rounded-full bg-main-soft" />
            <div className="h-11 rounded-full bg-main-soft" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductSkeletons
