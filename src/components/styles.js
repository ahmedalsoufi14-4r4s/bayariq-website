// Shared looks for buttons and cards, so every one of a kind looks and moves the same way.
// Buttons work on <button> and on links styled as buttons. Add the size where it is used,
// for example `${BUTTON_ACCENT} px-5 py-3`.
// Buttons lift a little on hover and shrink a little while pressed. motion-safe: limits that
// to people who have not asked their device for less motion. not-disabled: keeps
// disabled buttons still; they turn grey instead.

const BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-full transition duration-150 ease-out motion-safe:hover:not-disabled:-translate-y-0.5 motion-safe:active:not-disabled:scale-97 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:shadow-none'

// Red, the 10% accent: only for the most important actions (Add to cart, Send order, Browse products).
// shine (index.css) sweeps a soft light across it on hover.
export const BUTTON_ACCENT = `${BUTTON} shine bg-accent font-bold text-on-accent shadow-sm shadow-main/20 hover:not-disabled:bg-accent-hover hover:not-disabled:shadow-md`

// Green: other main actions, like WhatsApp on a branch card.
export const BUTTON_MAIN = `${BUTTON} bg-main text-on-main shadow-sm shadow-main/20 hover:not-disabled:bg-main-hover hover:not-disabled:shadow-md`

// Outlined, for quieter actions on light backgrounds.
export const BUTTON_OUTLINE = `${BUTTON} border border-main-ink bg-surface text-main-ink hover:not-disabled:bg-main-soft`

// Outlined, for quieter actions inside a green area (surface-main). On hover it fills with
// main-hover (a darker green, or in dark mode a slightly lighter one), never with see-through
// white, which would make the green lighter and the white text less than AA.
export const BUTTON_ON_MAIN = `${BUTTON} border border-on-main/50 hover:border-on-main hover:bg-main-hover`

// Round buttons with only an icon (theme, cart, close): 44px, so they are easy to tap, and a
// small press. Add the round hover highlight where it is used (hover:bg-on-main/10 on green,
// hover:bg-main-soft on white). group lets the icon inside move on hover (group-hover:).
export const ICON_BUTTON =
  'group flex size-11 shrink-0 items-center justify-center rounded-full transition duration-150 ease-out motion-safe:active:scale-90'

// A quiet text button on a light background (Remove, Empty cart, Skip the tour): underlined
// grey text that darkens on hover and shrinks a little while pressed. min-h-11 and min-w-11
// make it at least 44px for fingers, even for a short word like "إزالة".
export const TEXT_BUTTON =
  'inline-flex min-h-11 min-w-11 items-center rounded-full text-sm text-muted underline underline-offset-4 transition duration-150 ease-out hover:text-ink motion-safe:active:scale-95'

// A white card on the white page. card (index.css) makes it react to the pointer and to a
// tap: it lifts, tilts a little and glows. Give its icon a card-active: motion, for example
// motion-safe:card-active:animate-hop. Don't add overflow-hidden: it would cut off the glow.
export const CARD = 'card rounded-2xl bg-surface shadow-sm ring-1 ring-line'
