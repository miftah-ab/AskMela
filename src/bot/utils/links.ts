import { nanoid } from 'nanoid'

/**
 * Generate a unique business link suffix.
 * Format: biz_[8-char alphanum]
 */
export function generateUniqueLink(): string {
  // nanoid not installed — use crypto for MVP
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'biz_'
  const arr = new Uint8Array(8)
  // Node.js crypto
  const { randomFillSync } = require('crypto') as typeof import('crypto')
  randomFillSync(arr)
  for (const byte of arr) {
    result += chars[byte % chars.length]
  }
  return result
}

/**
 * Build the full Telegram deep link for a business.
 */
export function buildBotLink(uniqueLink: string): string {
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME ?? 'AskMelaAIBot'
  return `https://t.me/${botUsername}?start=${uniqueLink}`
}
