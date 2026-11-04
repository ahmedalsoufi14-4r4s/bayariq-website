// Every value Ahmed still has to provide starts with this tag (see NEEDS_FROM_AHMED.md).
// The page must hide these values or show "قريبًا" / "Coming soon" instead.
export function isPlaceholder(value) {
  return typeof value === 'string' && value.startsWith('NEEDS-AHMED')
}
