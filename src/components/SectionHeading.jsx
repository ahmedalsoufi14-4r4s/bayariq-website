import { reveal } from './reveal.js'

// A section title with a short saffron bar under it. after: draws the bar after the text,
// so it needs no extra element. The title fades in as it scrolls into view.
function SectionHeading({ id, children }) {
  return (
    <h2
      id={id}
      ref={reveal}
      className="reveal text-2xl font-bold after:mt-3 after:block after:h-1 after:w-12 after:rounded-full after:bg-accent md:text-3xl"
    >
      {children}
    </h2>
  )
}

export default SectionHeading
