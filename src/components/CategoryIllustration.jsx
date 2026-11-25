// The larger category pictures for products without a photo (ProductImage.jsx), drawn for this
// site. They all share one style: a 64 × 64 drawing that stands on a soft shadow, with a rounded
// outline in the text color of its parent, white parts (PAPER) and parts in two see-through
// greens (SOFT and DEEP). The colors are the tokens from index.css, so dark mode changes them.
const PAPER = 'fill-surface'
const SOFT = 'fill-main-ink/20 stroke-none'
const DEEP = 'fill-main-ink/45 stroke-none'

// Each drawing is a list of shapes, from the back to the front.
const DRAWINGS = {
  milk: (
    <>
      <path
        className={PAPER}
        d="M12 25 18 15h15l6 10v29a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2Z"
      />
      <path
        className={SOFT}
        d="M12 38c5-4 9 4 13.5 0s9-4 13.5 0v16a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2Z"
      />
      <path className={DEEP} d="M18 9h15v6H18Z" />
      <path d="M18 9h15v6H18ZM12 25h27" />
      <path
        className={PAPER}
        d="M25.5 28.5c-2.6 3-3.8 4.7-3.8 6.4a3.8 3.8 0 0 0 7.6 0c0-1.7-1.2-3.4-3.8-6.4Z"
      />
      <path className={PAPER} d="M34 47 52 38.5a4 4 0 0 1 4 4V56H34Z" />
      <path className={SOFT} d="M34 47h22v9H34Z" />
      <path d="M34 47h22" />
      <circle className={DEEP} cx="40" cy="52" r="1.8" />
      <circle className={DEEP} cx="48.5" cy="51" r="2.2" />
    </>
  ),
  snowflake: (
    <>
      <path className={PAPER} d="M14 10h36l-2.5 5.5v35L50 56H14l2.5-5.5v-35Z" />
      <path className={SOFT} d="M16.5 15.5h31v8h-31ZM16.5 46h31v4.5h-31Z" />
      <path d="M16.5 15.5h31M16.5 50.5h31" />
      <path d="M32 25.5v18M24.2 30l15.6 9M39.8 30l-15.6 9" />
      <path d="m29.5 27.5 2.5 2.2 2.5-2.2M29.5 41.5l2.5-2.2 2.5 2.2" />
    </>
  ),
  cup: (
    <>
      <path
        className={PAPER}
        d="M43 8h7v7c0 4 5 6 5 12v26a3 3 0 0 1-3 3H41a3 3 0 0 1-3-3V27c0-6 5-8 5-12Z"
      />
      <path className={SOFT} d="M38 31h17v15H38Z" />
      <path className={DEEP} d="M43 8h7v4h-7Z" />
      <path d="M43 12h7M38 31h17M38 46h17" />
      <path
        className={PAPER}
        d="M9 27h24l-2.6 27a2 2 0 0 1-2 2H13.6a2 2 0 0 1-2-2Z"
      />
      <path
        className={DEEP}
        d="M10 36.5c4-2.5 7 2.5 11 0s7-2.5 11 0l-1.6 17.5a2 2 0 0 1-2 2H13.6a2 2 0 0 1-2-2Z"
      />
      <path d="M9 27h24l-2.6 27a2 2 0 0 1-2 2H13.6a2 2 0 0 1-2-2Z" />
      <path d="m22 36 4-21h6" />
    </>
  ),
  candy: (
    <>
      <circle className={PAPER} cx="25" cy="38" r="18" />
      <path
        className={SOFT}
        d="M25 20a18 18 0 1 0 18 18c-3 1-6-.5-6.5-4-4 .5-6.5-2-6-5.5-3.5 0-6-3-5.5-8.5Z"
      />
      <circle className={DEEP} cx="19" cy="32" r="2.6" />
      <circle className={DEEP} cx="27" cy="40" r="2.6" />
      <circle className={DEEP} cx="17.5" cy="44" r="2.2" />
      <circle className={DEEP} cx="31" cy="49" r="2" />
      <circle cx="25" cy="38" r="18" />
      <path className={DEEP} d="m42 20-9-3.5 3 9ZM55 26l7 6-9 1Z" />
      <path className={PAPER} d="M42 13 53 11l6 9-4.5 9-11 1-5.5-9Z" />
      <path className={SOFT} d="M46 12.3 50 30l-5.5.2-5.5-9 3-8.5Z" />
      <path d="m39.5 19-6.5-2.5 3 9 4.5-2M56.5 25l5.5 7-9 1 .5-4.5M47 12l2.5 17.5M53 11l-2 18.5" />
    </>
  ),
  jar: (
    <>
      <path
        className={PAPER}
        d="M34 20h20a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H34Z"
      />
      <path className={DEEP} d="M36 12h18v8H36Z" />
      <path d="M36 12h18v8H36Z" />
      <path className={SOFT} d="M42 30h15v14H42Z" />
      <path d="M42 30h15M42 44h15" />
      <path className={PAPER} d="M8 27v25c0 2.2 7 4 15 4s15-1.8 15-4V27Z" />
      <path
        className={SOFT}
        d="M8 34c0 2.2 7 4 15 4s15-1.8 15-4v12c0 2.2-7 4-15 4S8 48.2 8 46Z"
      />
      <path d="M8 34c0 2.2 7 4 15 4s15-1.8 15-4M8 46c0 2.2 7 4 15 4s15-1.8 15-4" />
      <path d="M8 27v25c0 2.2 7 4 15 4s15-1.8 15-4V27" />
      <ellipse className={PAPER} cx="23" cy="27" rx="15" ry="4" />
      <path d="M20 27h6" />
    </>
  ),
  drop: (
    <>
      <path
        className={PAPER}
        d="M18 8h8v8c0 4 8 6 8 13v24a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V29c0-7 8-9 8-13Z"
      />
      <path
        className={SOFT}
        d="M10 31c4-2.5 8 2.5 12 0s8-2.5 12 0v22a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3Z"
      />
      <path className={DEEP} d="M18 8h8v5h-8Z" />
      <path d="M18 13h8" />
      <path className={PAPER} d="M14 37h16v11H14Z" />
      <path d="M18 42.5h8" />
      <path
        className={PAPER}
        d="M47 33c-4.8 5.7-7.2 9.3-7.2 12.8a7.2 7.2 0 0 0 14.4 0c0-3.5-2.4-7.1-7.2-12.8Z"
      />
      <path
        className={DEEP}
        d="M40 47.5c4.5 2.5 9.5-2 14-1a7.2 7.2 0 0 1-14 1Z"
      />
      <path d="M44 24c4-5 9-7 14-6-1 5-5 8-10 8M44 24l-3 4" />
    </>
  ),
  mug: (
    <>
      <path className={PAPER} d="M42 32h5.5a7 7 0 0 1 0 14H41" />
      <path
        className={PAPER}
        d="M10 27h33v16c0 8-5 13-12 13h-9c-7 0-12-5-12-13Z"
      />
      <path
        className={SOFT}
        d="M10 38c5.5-3 11 3 16.5 0s11-3 16.5 0v5c0 8-5 13-12 13h-9c-7 0-12-5-12-13Z"
      />
      <path className={DEEP} d="M10 27h33v4H10Z" />
      <path d="M10 27h33v16c0 8-5 13-12 13h-9c-7 0-12-5-12-13Z" />
      <path d="M19 8c-2.5 3.5 2.5 6 0 10M27 8c-2.5 3.5 2.5 6 0 10M35 8c-2.5 3.5 2.5 6 0 10" />
    </>
  ),
  mortar: (
    <>
      <path className={DEEP} d="m30 33 16-25 5 3-15 24Z" />
      <path d="m30 33 16-25 5 3-15 24" />
      <path
        className={PAPER}
        d="M10 33h44c0 9-5 15-12 17.5V54a2 2 0 0 1-2 2H24a2 2 0 0 1-2-2v-3.5C15 48 10 42 10 33Z"
      />
      <path
        className={SOFT}
        d="M11 38h42c-1.5 6-5.5 10.5-11 12.5V54a2 2 0 0 1-2 2H24a2 2 0 0 1-2-2v-3.5C16.5 48.5 12.5 44 11 38Z"
      />
      <path d="M22 50.5h20M8 33h48" />
      <path className={PAPER} d="M20 25c-6-1-9-5-9-11 6 0 10 4 9 11Z" />
      <path d="m13 16 9 13" />
    </>
  ),
  spray: (
    <>
      <path
        className={PAPER}
        d="M16 30c0-4 4-5 4-9h12c0 4 8 7 8 14v18a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3Z"
      />
      <path className={SOFT} d="M16 36h24v13H16Z" />
      <path d="M16 36h24M16 49h24" />
      <path className={DEEP} d="M17 10h18a4 4 0 0 1 4 4v3H30v4H20v-4h-3Z" />
      <path d="M17 10h18a4 4 0 0 1 4 4v3H30v4H20v-4h-3ZM34 17c0 3 1 5 3 7" />
      <path
        d="M44 11h.01M49 8h.01M49 14h.01M54 11h.01M54 17h.01M54 5h.01"
        strokeWidth="2.8"
      />
      <circle className={PAPER} cx="50" cy="47" r="5" />
      <circle className={PAPER} cx="47" cy="35" r="3" />
      <circle className={SOFT} cx="50" cy="47" r="5" />
    </>
  ),
  lotion: (
    <>
      <path className={PAPER} d="M38 56V30c0-3 2-5 4-9h8c2 4 4 6 4 9v26Z" />
      <path className={SOFT} d="M38 38h16v18H38Z" />
      <path className={DEEP} d="M42 14h8v7h-8Z" />
      <path d="M42 14h8v7h-8ZM38 38h16" />
      <path
        className={PAPER}
        d="M10 28a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v25a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3Z"
      />
      <path className={SOFT} d="M10 34h22v13H10Z" />
      <path className={DEEP} d="M17 18h8v6h-8Z" />
      <path d="M17 18h8v6h-8ZM21 18v-7M14 11h10c2.5 0 4 1.5 4 4M10 34h22M10 47h22M17 40.5h8" />
    </>
  ),
  'baby-bottle': (
    <>
      <path
        className={PAPER}
        d="M16 26h20v25a5 5 0 0 1-5 5H21a5 5 0 0 1-5-5Z"
      />
      <path
        className={SOFT}
        d="M16 38c3.5-2 6.5 2 10 0s6.5-2 10 0v13a5 5 0 0 1-5 5H21a5 5 0 0 1-5-5Z"
      />
      <path className={DEEP} d="M14 20h24v6H14Z" />
      <path d="M14 20h24v6H14Z" />
      <path
        className={PAPER}
        d="M20 20c0-5 4-6 4-9a2 2 0 0 1 4 0c0 3 4 4 4 9Z"
      />
      <path d="M30 32h6M32 38h4M30 44h6" />
      <circle className={PAPER} cx="49" cy="49" r="6.5" />
      <path className={DEEP} d="M42 38h14c0 4-3 6-7 6s-7-2-7-6Z" />
      <path d="M42 38h14c0 4-3 6-7 6s-7-2-7-6ZM46 38c0-5 6-5 6 0" />
    </>
  ),
  roll: (
    <>
      <path
        className={PAPER}
        d="M26 12h18c6 0 10 6 10 13v24l-5 3-4.5-3-4.5 3-4.5-3-4.5 3V25Z"
      />
      <path className={SOFT} d="M36 25h18v10H36Z" />
      <ellipse className={PAPER} cx="26" cy="25" rx="10" ry="13" />
      <ellipse className={DEEP} cx="26" cy="25" rx="3.5" ry="4.8" />
      <ellipse cx="26" cy="25" rx="3.5" ry="4.8" />
      <path d="M36 35h18" strokeDasharray="1.5 3.5" />
      <path
        className={PAPER}
        d="M8 44h24a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"
      />
      <path className={SOFT} d="M6 49h28v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z" />
      <path className={PAPER} d="M14 44c0-4 4-3 5-7 2 2 1 4 4 4-1 1 0 2 1 3Z" />
    </>
  ),
  pot: (
    <>
      <path
        className={PAPER}
        d="M13 30h38v17a9 9 0 0 1-9 9H22a9 9 0 0 1-9-9Z"
      />
      <path
        className={SOFT}
        d="M13 40c6-3 13 3 19 0s13-3 19 0v7a9 9 0 0 1-9 9H22a9 9 0 0 1-9-9Z"
      />
      <path d="M13 30h38v17a9 9 0 0 1-9 9H22a9 9 0 0 1-9-9Z" />
      <path d="M13 37H8.5a2.5 2.5 0 0 1 0-5H13M51 37h4.5a2.5 2.5 0 0 0 0-5H51" />
      <path className={DEEP} d="M16 30c1-7 7-11 16-11s15 4 16 11Z" />
      <path d="M16 30c1-7 7-11 16-11s15 4 16 11M11 30h42" />
      <path className={PAPER} d="M29 19v-3a3 3 0 0 1 6 0v3Z" />
    </>
  ),
  bulb: (
    <>
      <path
        className={PAPER}
        d="M32 10a16 16 0 0 0-9 29.2c2 1.4 3 3.3 3 5.8h12c0-2.5 1-4.4 3-5.8A16 16 0 0 0 32 10Z"
      />
      <path
        className={SOFT}
        d="M32 10a16 16 0 0 1 9 29.2c-2 1.4-3 3.3-3 5.8h-6Z"
      />
      <path d="M32 10a16 16 0 0 0-9 29.2c2 1.4 3 3.3 3 5.8h12c0-2.5 1-4.4 3-5.8A16 16 0 0 0 32 10ZM32 45V31M27 27l5 4 5-4" />
      <path className={DEEP} d="M26 45h12v7a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z" />
      <path d="M26 45h12v7a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4ZM26 50h12" />
      <path d="M8 26h4M52 26h4M14 10l3 3M50 10l-3 3" />
    </>
  ),
  phone: (
    <>
      <rect className={PAPER} x="12" y="9" width="24" height="47" rx="4" />
      <path className={SOFT} d="M16 16h16v31H16Z" />
      <path d="M16 16h16v31H16ZM21 12.5h6M22 51.5h4" />
      <path d="M42 36v-5a8 8 0 0 1 16 0v5" />
      <rect className={PAPER} x="39" y="35" width="7" height="13" rx="3.5" />
      <rect className={PAPER} x="54" y="35" width="7" height="13" rx="3.5" />
      <path className={DEEP} d="M41 37h3v9h-3ZM56 37h3v9h-3Z" />
      <path className={DEEP} d="m22 25 8 6.5-8 6.5Z" />
    </>
  ),
  puzzle: (
    <>
      <path className={PAPER} d="M9 34h20v22H9Z" />
      <path className={SOFT} d="M9 34h20v22H9Z" />
      <path className={PAPER} d="M29 34h20v22H29ZM19 14h20v20H19Z" />
      <path
        className={DEEP}
        d="m29 18.5 1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6Z"
      />
      <path d="M9 34h20v22H9ZM29 34h20v22H29ZM19 14h20v20H19Z" />
      <circle className={DEEP} cx="39" cy="45" r="4.5" />
      <path className={DEEP} d="m19 40 5 9H14Z" />
      <path className={PAPER} d="m49 34 5-21 5 1.2-5 21-3.6 3Z" />
      <path className={DEEP} d="m54 13 5 1.2 1-4.2-5-1.2Z" />
      <path d="m49 34 5-21 5 1.2-5 21-3.6 3ZM54 13l1-4.2 5 1.2-1 4.2" />
    </>
  ),
  shirt: (
    <>
      <path
        className={PAPER}
        d="M22 12 7 20l5 12 6-3v27h28V29l6 3 5-12-15-8a10 10 0 0 1-20 0Z"
      />
      <path className={SOFT} d="M18 38h28v18H18Z" />
      <path className={DEEP} d="M18 38h28v5H18Z" />
      <path d="M22 12 7 20l5 12 6-3v27h28V29l6 3 5-12-15-8a10 10 0 0 1-20 0ZM18 38h28M18 43h28" />
    </>
  ),
  gift: (
    <>
      <path
        className={PAPER}
        d="M12 32h40v22a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2Z"
      />
      <path className={SOFT} d="M12 32h40v6H12Z" />
      <path className={PAPER} d="M8 23h48v9H8Z" />
      <path className={DEEP} d="M28 23h8v33h-8Z" />
      <path d="M12 32h40v22a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2ZM8 23h48v9H8ZM28 23v33M36 23v33" />
      <path
        className={PAPER}
        d="M32 23c-9 0-14-4-13-9s9-5 13 9ZM32 23c9 0 14-4 13-9s-9-5-13 9Z"
      />
      <path className={SOFT} d="M32 23c-9 0-14-4-13-9s9-5 13 9Z" />
    </>
  ),
}

// name is the category's "icon" in categories.json. An unknown name (for example a typo) shows
// the jar instead of nothing.
function CategoryIllustration({ name, className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <ellipse
        cx="32"
        cy="57"
        rx="27"
        ry="3"
        className="fill-black/10 stroke-none dark:fill-black/30"
      />
      {DRAWINGS[name] ?? DRAWINGS.jar}
    </svg>
  )
}

export default CategoryIllustration
