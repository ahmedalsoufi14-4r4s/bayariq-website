// Outline icons from Heroicons (MIT license, heroicons.com), and category icons drawn in the same style.
// They use currentColor, so they take the text color of their parent.
// aria-hidden hides them from screen readers because the text next to them says the same thing.

function Icon({ className, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

export function PhoneIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </Icon>
  )
}

export function ChatIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
    </Icon>
  )
}

// Three lines, the usual sign for a menu.
export function MenuIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </Icon>
  )
}

// A paper plane pointing right. In Arabic, flip it to point left (rtl:-scale-x-100).
export function SendIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </Icon>
  )
}

export function TagIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path d="M6 6h.008v.008H6V6Z" />
    </Icon>
  )
}

export function MapPinIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </Icon>
  )
}

export function SearchIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </Icon>
  )
}

export function CartIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </Icon>
  )
}

export function PlusIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 4.5v15m7.5-7.5h-15" />
    </Icon>
  )
}

export function MinusIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M5 12h14" />
    </Icon>
  )
}

export function CloseIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M6 18 18 6M6 6l12 12" />
    </Icon>
  )
}

export function MoonIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </Icon>
  )
}

export function SunIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </Icon>
  )
}

export function ClockIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Icon>
  )
}

// An exclamation mark in a circle, for the error message and warnings.
export function AlertIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </Icon>
  )
}

export function TruckIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </Icon>
  )
}

export function PhotoIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </Icon>
  )
}

export function ShareIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
    </Icon>
  )
}

// Category icons: drawn for this site in the same outline style as the Heroicons above, except
// the bulb, the mobile phone, the puzzle and the gift, which are Heroicons.
// The "icon" field in categories.json names one of them.

export function MilkIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M9.5 2.75h5v2.5h-5z" />
      <path d="M9.5 5.25 7.2 8.6a2 2 0 0 0-.45 1.27v9.63a1.75 1.75 0 0 0 1.75 1.75h7a1.75 1.75 0 0 0 1.75-1.75V9.87a2 2 0 0 0-.45-1.27L14.5 5.25" />
      <path d="M12 13.5c-1.2 1.4-1.75 2.3-1.75 3a1.75 1.75 0 0 0 3.5 0c0-.7-.55-1.6-1.75-3Z" />
    </Icon>
  )
}

export function JarIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M7.5 3.75h9a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-9a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 .75-.75Z" />
      <path d="M7.5 6.75h9A2.25 2.25 0 0 1 18.75 9v9.75A2.25 2.25 0 0 1 16.5 21h-9a2.25 2.25 0 0 1-2.25-2.25V9A2.25 2.25 0 0 1 7.5 6.75Z" />
      <path d="M8.25 11.25h7.5v4.5h-7.5z" />
    </Icon>
  )
}

export function CupIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M5.75 8.25h12.5l-1.4 11.35a1.75 1.75 0 0 1-1.74 1.53H8.89a1.75 1.75 0 0 1-1.74-1.53L5.75 8.25Z" />
      <path d="M4.75 8.25h14.5M6.3 12.75h11.4" />
      <path d="M12.75 8.25 14 3.75h2.5" />
    </Icon>
  )
}

export function SprayIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M8.25 11.25h6l1.5 2.25v6.75a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V13.5l1.5-2.25Z" />
      <path d="M8.25 6h6.75v3H8.25zM15 7.5h1.5M9.75 9v2.25M13.5 9v2.25" />
      <path d="M18.75 6h.008M18.75 9h.008M20.25 7.5h.008" />
    </Icon>
  )
}

export function SnowflakeIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
      <path d="M9.75 4.75 12 7l2.25-2.25M9.75 19.25 12 17l2.25 2.25" />
    </Icon>
  )
}

export function CandyIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
      <path d="M8.4 10.3 3.5 8v8l4.9-2.3M15.6 10.3 20.5 8v8l-4.9-2.3" />
      <path d="M10.5 12.75c.9.6 2.1-.6 3 0" />
    </Icon>
  )
}

export function DropIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 3.25c-3.2 3.9-5.25 6.9-5.25 9.75a5.25 5.25 0 0 0 10.5 0c0-2.85-2.05-5.85-5.25-9.75Z" />
      <path d="M9.5 13.25A2.5 2.5 0 0 0 12 15.75" />
    </Icon>
  )
}

export function MugIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M5.25 8.75h10.5v8a3 3 0 0 1-3 3h-4.5a3 3 0 0 1-3-3v-8Z" />
      <path d="M15.75 10.5h1.5a2.25 2.25 0 0 1 0 4.5h-1.5" />
      <path d="M8.75 3.75c-.6.9.6 1.6 0 2.5M12.25 3.75c-.6.9.6 1.6 0 2.5" />
    </Icon>
  )
}

export function MortarIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4 11h16M5.25 11c0 3.2 1.6 5.6 4 6.6v1.9c0 .41.34.75.75.75h4a.75.75 0 0 0 .75-.75v-1.9c2.4-1 4-3.4 4-6.6" />
      <path d="m12.75 11 4.5-7.25" />
    </Icon>
  )
}

export function LotionIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M8.25 9.75h7.5a1.5 1.5 0 0 1 1.5 1.5v8a2 2 0 0 1-2 2h-6.5a2 2 0 0 1-2-2v-8a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M10.5 9.75V7.5h3v2.25M12 7.5V4.25M9 4.25h4.25a1.75 1.75 0 0 1 1.75 1.75" />
      <path d="M9.75 14.25h4.5" />
    </Icon>
  )
}

export function BabyBottleIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M9 8.75h6v9.75a2.5 2.5 0 0 1-2.5 2.5h-1a2.5 2.5 0 0 1-2.5-2.5V8.75Z" />
      <path d="M8.25 6.5h7.5v2.25h-7.5z" />
      <path d="M10.5 6.5c0-1.4.5-1.7.5-2.5a1 1 0 0 1 2 0c0 .8.5 1.1.5 2.5" />
      <path d="M12.75 12H15M12.75 15H15" />
    </Icon>
  )
}

export function RollIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M7.25 4.25h9.5c1.4 0 2.5 1.8 2.5 4v11.5l-2-1.25-2 1.25-2-1.25-2 1.25V8.25" />
      <path d="M4.75 8.25c0-2.2 1.1-4 2.5-4s2.5 1.8 2.5 4-1.1 4-2.5 4-2.5-1.8-2.5-4Z" />
      <path d="M7.25 12.25h4" />
    </Icon>
  )
}

export function PotIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M5.25 10.25h13.5v7a3 3 0 0 1-3 3h-7.5a3 3 0 0 1-3-3v-7Z" />
      <path d="M5.25 13h-1.5M18.75 13h1.5M4.5 10.25h15" />
      <path d="M7 10.25c.3-2.3 2.3-4 5-4s4.7 1.7 5 4M12 6.25v-1.5" />
    </Icon>
  )
}

export function BulbIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </Icon>
  )
}

export function MobileIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </Icon>
  )
}

export function PuzzleIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
    </Icon>
  )
}

export function ShirtIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M8.25 3.75 3.75 6.5l1.75 4 2-.9v10.15c0 .28.22.5.5.5h8a.5.5 0 0 0 .5-.5V9.6l2 .9 1.75-4-4.5-2.75a3.75 3.75 0 0 1-7.5 0Z" />
    </Icon>
  )
}

export function GiftIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </Icon>
  )
}

const CATEGORY_ICONS = {
  milk: MilkIcon,
  snowflake: SnowflakeIcon,
  cup: CupIcon,
  candy: CandyIcon,
  jar: JarIcon,
  drop: DropIcon,
  mug: MugIcon,
  mortar: MortarIcon,
  spray: SprayIcon,
  lotion: LotionIcon,
  'baby-bottle': BabyBottleIcon,
  roll: RollIcon,
  pot: PotIcon,
  bulb: BulbIcon,
  phone: MobileIcon,
  puzzle: PuzzleIcon,
  shirt: ShirtIcon,
  gift: GiftIcon,
}

// The icon a category names in categories.json. An unknown name (for example a typo)
// shows the shopping bag instead of nothing.
export function CategoryIcon({ name, className }) {
  const MatchingIcon = CATEGORY_ICONS[name] ?? CartIcon
  return <MatchingIcon className={className} />
}
