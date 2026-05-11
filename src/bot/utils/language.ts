/**
 * Detect if text contains Amharic (Ethiopic Unicode block: U+1200–U+137F)
 */
export function isAmharic(text: string): boolean {
  return /[\u1200-\u137F]/.test(text)
}

/**
 * Detect language from text — returns 'amharic' or 'english'
 */
export function detectLanguage(text: string): 'amharic' | 'english' {
  // If it has Amharic characters, it's Amharic
  if (isAmharic(text)) return 'amharic'
  
  // Check for English (Latin) characters
  const hasLatin = /[a-zA-Z]/.test(text)
  
  // Default to Amharic as requested if no clear English found
  return hasLatin ? 'english' : 'amharic'
}
