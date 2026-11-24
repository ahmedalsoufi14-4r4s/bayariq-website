// Makes a product name safe inside a Markdown table: without the backslash, "12*24*20" would
// turn part of the name into italics, and "|" would start a new column.
export function markdownText(text) {
  return text.replace(/[*_|]/g, '\\$&')
}
