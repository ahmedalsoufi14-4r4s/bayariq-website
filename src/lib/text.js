// Fills the {name} gaps in a text from ar.json or en.json.
// Example: fillIn('فرع {district}', { district: 'الحمدانية' }) gives 'فرع الحمدانية'.
// A gap with no value stays as it is, so a missing value is easy to spot.
export function fillIn(text, values) {
  return text.replace(/\{(\w+)\}/g, (gap, name) => values[name] ?? gap)
}
