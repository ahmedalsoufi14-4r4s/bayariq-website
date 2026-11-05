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

// Category icons, drawn for this site in the same outline style as the Heroicons above.
// The "icon" field in categories.json names one of them.

export function CarrotIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M11.2 8.8a2.8 2.8 0 0 1 4 4l-11.1 7.5c-.5.3-1-.2-.7-.7Z" />
      <path d="M7.4 14.7l1.3 1.3M9.3 11.8l1.6 1.6" />
      <path d="M15.2 8.8 18.5 5.5M15.2 8.8c.3-1.8 0-3.2-1-4.3M15.2 8.8c1.8-.3 3.2 0 4.3 1" />
    </Icon>
  )
}

export function MilkIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M9.5 2.75h5v2.5h-5z" />
      <path d="M9.5 5.25 7.2 8.6a2 2 0 0 0-.45 1.27v9.63a1.75 1.75 0 0 0 1.75 1.75h7a1.75 1.75 0 0 0 1.75-1.75V9.87a2 2 0 0 0-.45-1.27L14.5 5.25" />
      <path d="M12 13.5c-1.2 1.4-1.75 2.3-1.75 3a1.75 1.75 0 0 0 3.5 0c0-.7-.55-1.6-1.75-3Z" />
    </Icon>
  )
}

export function BreadIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M6.5 20.25h11a1 1 0 0 0 1-1v-8.1a3.75 3.75 0 0 0-1.5-6.9H7a3.75 3.75 0 0 0-1.5 6.9v8.1a1 1 0 0 0 1 1Z" />
      <path d="m9.5 12.5 1.5-1.5M13 15.5l1.5-1.5" />
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

const CATEGORY_ICONS = {
  carrot: CarrotIcon,
  milk: MilkIcon,
  bread: BreadIcon,
  jar: JarIcon,
  cup: CupIcon,
  spray: SprayIcon,
}

// The icon a category names in categories.json. An unknown name (for example a typo)
// shows the shopping bag instead of nothing.
export function CategoryIcon({ name, className }) {
  const MatchingIcon = CATEGORY_ICONS[name] ?? CartIcon
  return <MatchingIcon className={className} />
}
