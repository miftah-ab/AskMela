/**
 * Format a bilingual (Amharic/English) message.
 */
export function bilingual(amharic: string, english: string): string {
  return `${amharic}\n${english}`
}

/**
 * Truncate text to a given length with ellipsis.
 */
export function truncate(text: string, maxLen = 100): string {
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}
