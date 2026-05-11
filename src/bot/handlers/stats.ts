import { Context } from 'telegraf'
import { getBusinessByOwnerId, getTodayStats } from '../services/supabase'

/**
 * /stats command handler — shows today's statistics to business owner.
 */
export async function handleStats(ctx: Context) {
  const userId = ctx.from?.id
  if (!userId) return

  const business = await getBusinessByOwnerId(userId)
  if (!business) {
    await ctx.reply(
      '⚠️ ንግዱ አልተመዘገበም / Business not registered. Use /start to register.'
    )
    return
  }

  const stats = await getTodayStats(business.id)

  const answerRate =
    stats.total_questions > 0
      ? Math.round((stats.answered_questions / stats.total_questions) * 100)
      : 0

  await ctx.reply(
    `📊 *የዛሬ ስታቲስቲክስ / Today's Stats*\n` +
      `_${business.name}_\n\n` +
      `💬 ጠቅላላ ጥያቄዎች / Total Questions: *${stats.total_questions}*\n` +
      `✅ የተመለሱ / Answered: *${stats.answered_questions}*\n` +
      `❌ ያልተመለሱ / Unanswered: *${stats.unanswered_questions}*\n` +
      `👥 ደንበኞች / Customers: *${stats.unique_customers}*\n` +
      `📈 የምላሽ መጠን / Answer Rate: *${answerRate}%*`,
    { parse_mode: 'Markdown' }
  )
}
