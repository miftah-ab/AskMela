import { Context } from 'telegraf'
import { getBusinessByOwnerId } from '../services/supabase'
import { buildBotLink } from '../utils/links'

/**
 * /start handler — detects if this is an owner first-visit or a customer using a biz_ deep link.
 */
export async function handleStart(ctx: Context) {
  const payload = (ctx as any).startPayload as string | undefined

  // ─── Customer clicking a business link ────────────────────────────────────
  if (payload?.startsWith('biz_')) {
    await handleCustomerStart(ctx, payload)
    return
  }

  // ─── Business owner ───────────────────────────────────────────────────────
  const userId = ctx.from?.id
  if (!userId) return

  const existing = await getBusinessByOwnerId(userId)

  if (existing) {
    // 2.1 Fetch today's stats for the greeting
    const { getTodayStats } = await import('../services/supabase')
    const stats = await getTodayStats(existing.id)

    // Already registered — show dashboard summary
    const link = buildBotLink(existing.unique_link)
    await ctx.reply(
      `🏪 *AskMela Owner Mode — ${existing.name}*\n\n` +
        `📊 *Today's Stats:* ${stats.total_questions} questions, ${stats.answered_questions} answered.\n\n` +
        `✅ *Bot is live:* Customers can chat here:\n\`${link}\`\n\n` +
        `💡 *How to teach:* Just send me any text, voice message, or photo, and I will learn it instantly!\n\n` +
        `*Commands:* /stats, /help, /clear`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📊 Full Stats', callback_data: 'stats' },
              { text: '📤 Share Link', url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=Chat%20with%20our%20AI%20assistant!` },
            ],
            [
              { text: '📚 Manage Knowledge', url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
              { text: '❓ Help', callback_data: 'help' },
            ],
          ],
        },
      }
    )
  } else {
    // New user — prompt registration
    let appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    // Telegram Web Apps require HTTPS. If on localhost, this will fail unless using a tunnel.
    if (appUrl.startsWith('http://localhost')) {
      console.warn('⚠️ Telegram Web Apps require HTTPS. Localhost detected. Registration might fail.')
    }
    await ctx.reply(
      `🏪 *AskMela እንኳን ደህና መጡ! / Welcome to AskMela!*\n\n` +
        `ለንግድዎ AI ረዳት ያግኙ።\n` +
        `_Get an AI assistant for your business._\n\n` +
        `ለመጀመር ንግድዎን ይመዝግቡ / Register your business to get started:`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 ንግዴን ይመዝግቡ / Register My Business',
                web_app: { url: `${appUrl}/register` },
              },
            ],
          ],
        },
      }
    )
  }
}

/**
 * Handle customer arriving via business deep link.
 */
async function handleCustomerStart(ctx: Context, uniqueLink: string) {
  const { getBusinessByUniqueLink } = await import('../services/supabase')
  const business = await getBusinessByUniqueLink(uniqueLink)

  if (!business || !business.is_active) {
    await ctx.reply(
      '😔 ይህ ንግድ አሁን አይገኝም / This business is currently unavailable.\n\nPlease try again later.'
    )
    return
  }

  // Note: Business context is now stored in Supabase (AskMelaBotContext) via setCustomerBusiness

  await ctx.reply(
    `👋 *ሰላም! / Hello!*\n\n` +
      `🏪 *${business.name}* ን ወደ AskMela AI ረዳት እንኳን ደህና መጡ።\n` +
      `_Welcome to ${business.name}'s AI assistant._\n\n` +
      `ማንኛውንም ጥያቄ ይጠይቁ — በጽሑፍ ወይም በድምፅ።\n` +
      `_Ask anything — by text or voice._`,
    { parse_mode: 'Markdown' }
  )
}
