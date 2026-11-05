// Shared looks for buttons and cards, so every one of a kind looks and moves the same way.
// Buttons work on <button> and on links styled as buttons. Add the size where it is used,
// for example `${BUTTON_ACCENT} px-5 py-3`.
// Buttons lift a little on hover and shrink a little while pressed. motion-safe: limits that
// to people who have not asked their device for less motion. not-disabled: keeps
// disabled buttons still; they turn grey instead.

const BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-full transition duration-150 ease-out motion-safe:hover:not-disabled:-translate-y-0.5 motion-safe:active:not-disabled:scale-97 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:shadow-none'

// Saffron, the 10% accent: only for the most important actions (Add to cart, Send order, Browse products).
// shine (index.css) sweeps a soft light across it on hover.
export const BUTTON_ACCENT = `${BUTTON} shine bg-accent font-bold text-on-accent shadow-sm shadow-main/20 hover:not-disabled:bg-accent-hover hover:not-disabled:shadow-md`

// Navy: other main actions, like WhatsApp on a branch card.
export const BUTTON_MAIN = `${BUTTON} bg-main text-on-main shadow-sm shadow-main/20 hover:not-disabled:bg-main-hover hover:not-disabled:shadow-md`

// Outlined, for quieter actions on light backgrounds.
export const BUTTON_OUTLINE = `${BUTTON} border border-main-ink bg-surface text-main-ink hover:not-disabled:bg-main-soft`

// Outlined, for quieter actions inside a navy area (surface-main).
export const BUTTON_ON_MAIN = `${BUTTON} border border-on-main/50 hover:border-on-main hover:bg-on-main/10`

// Round buttons with only an icon (theme, cart, close): 44px, so they are easy to tap, and a
// small press. Add the round hover highlight where it is used (hover:bg-on-main/10 on navy,
// hover:bg-main-soft on white). group lets the icon inside move on hover (group-hover:).
export const ICON_BUTTON =
  'group flex size-11 shrink-0 items-center justify-center rounded-full transition duration-150 ease-out motion-safe:active:scale-90'

// A white card on the off-white page. card (index.css) makes it react to the pointer and to a
// tap: it lifts, tilts a little and glows. Give its icon a card-active: motion, for example
// motion-safe:card-active:animate-hop. Don't add overflow-hidden: it would cut off the glow.
export const CARD = 'card rounded-2xl bg-surface shadow-sm ring-1 ring-line'
