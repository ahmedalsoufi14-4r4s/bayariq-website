import { reveal } from './reveal.js'

// A section title with a short red bar under it. after: draws the bar after the text,
// so it needs no extra element. In a green band the bar is white (--highlight, set by
// surface-main in index.css), because red barely shows on green. The title fades in as it scrolls into view.
function SectionHeading({ id, children }) {
  return (
    <h2
      id={id}
      ref={reveal}
      className="reveal text-2xl font-bold after:mt-3 after:block after:h-1 after:w-12 after:rounded-full after:bg-[var(--highlight,var(--color-accent))] md:text-3xl"
    >
      {children}
    </h2>
  )
}

export default SectionHeading
