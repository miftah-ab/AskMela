import { Context } from 'telegraf'
import { getBusinessByOwnerId } from '../services/supabase'
import { addToKnowledgeBase } from '../services/rag'
import { truncate } from '../utils/format'

/**
 * Handle text messages from business owners — adds to knowledge base.
 * Text messages from customers are routed in customer.ts.
 */
export async function handleOwnerUpdate(ctx: Context) {
  const text = (ctx.message as any)?.text as string
  if (!text) return

  const userId = ctx.from?.id
  if (!userId) return

  const business = await getBusinessByOwnerId(userId)
  if (!business) {
    await ctx.reply(
      '⚠️ ንግዱ አልተመዘገበም / Business not registered.\n\nUse /start to register your business first.'
    )
    return
  }

  // Skip commands
  if (text.startsWith('/')) return

  await ctx.sendChatAction('typing')

  try {
    await addToKnowledgeBase({
      businessId: business.id,
      content: text,
      sourceType: 'text',
    })

    await ctx.reply(
      `✅ *መረጃው ተጨምሯል / Information added*\n\n` +
        `_"${truncate(text, 80)}"_\n\n` +
        `ደንበኞችዎ አሁን ስለዚህ ሊጠይቁ ይችላሉ።\n` +
        `_Your customers can now ask about this._`,
      { parse_mode: 'Markdown' }
    )
  } catch (err) {
    console.error('Knowledge base update error:', err)
    await ctx.reply('❌ ስህተት ተፈጥሯል / An error occurred. Please try again.')
  }
}
