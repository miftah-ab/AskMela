import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN!)

/**
 * Send a notification to a business owner when a customer question goes unanswered.
 */
export async function notifyOwnerUnanswered(params: {
  ownerTelegramId: number
  customerUsername?: string
  customerTelegramId: number
  question: string
}) {
  const { ownerTelegramId, customerUsername, customerTelegramId, question } = params

  const customerRef = customerUsername
    ? `@${customerUsername}`
    : `ID: ${customerTelegramId}`

  const message =
    `⚠️ *ያልተመለሰ ጥያቄ / Unanswered Question*\n\n` +
    `👤 ደንበኛ / Customer: ${customerRef}\n` +
    `❓ ጥያቄ / Question: _"${question}"_\n\n` +
    `ይህን መረጃ ይጨምሩ እንዳይደገም።\n` +
    `_Add this information so it doesn't happen again._`

  try {
    await bot.telegram.sendMessage(ownerTelegramId, message, {
      parse_mode: 'Markdown',
    })
  } catch (err) {
    console.error('Failed to notify owner:', err)
  }
}

/**
 * Send a new customer notification to the business owner.
 */
export async function notifyOwnerNewCustomer(params: {
  ownerTelegramId: number
  customerUsername?: string
  businessName: string
}) {
  const { ownerTelegramId, customerUsername, businessName } = params
  const customerRef = customerUsername ? `@${customerUsername}` : 'አዲስ ደንበኛ'

  try {
    await bot.telegram.sendMessage(
      ownerTelegramId,
      `👥 ${customerRef} ${businessName}-ን ጎብኝቷል / visited ${businessName}`,
      { parse_mode: 'Markdown' }
    )
  } catch {
    // Non-critical — don't throw
  }
}
