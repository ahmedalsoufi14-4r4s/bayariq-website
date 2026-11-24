// A product name. The names are only in Arabic for now, so in the English version this tells
// browsers and screen readers that the text is Arabic (lang). <bdi> keeps its words, numbers
// and stars in their own right-to-left run inside left-to-right text.
function ProductName({ product }) {
  return <bdi lang="ar">{product.name}</bdi>
}

export default ProductName
