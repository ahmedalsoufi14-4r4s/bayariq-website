import { CARD } from './styles.js'

// A card for a part of the page whose content is on its way, like the offers: a green icon tile
// with a faint big copy of the icon in the corner for depth, a title and a short text.
// Like every card it lifts, tilts and glows under the pointer or a tap, and its icons move.
// The big copy is clipped by its own box, because the card cannot clip it (overflow-hidden
// would cut off the card's glow).
function ComingSoonCard({ Icon, title, text }) {
  return (
    <article
      className={`mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-10 text-center text-ink sm:flex-row sm:text-start ${CARD}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden rounded-2xl"
      >
        <Icon className="absolute -end-6 -bottom-8 size-40 text-main-ink/10 motion-safe:card-active:animate-hop" />
      </div>
      <span className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-main text-on-main shadow-lg shadow-main/30 motion-safe:card-active:animate-wiggle">
        <Icon className="size-9" />
      </span>
      <div className="relative">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-1 text-muted">{text}</p>
      </div>
    </article>
  )
}

export default ComingSoonCard
