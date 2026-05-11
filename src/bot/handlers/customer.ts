import { Context } from 'telegraf'
import { ragSearch } from '../services/rag'
import {
  getBusinessByUniqueLink,
  saveConversation,
  upsertStats,
  createNotification,
  setBotUserContext,
  getBotUserContext,
} from '../services/supabase'
import { notifyOwnerUnanswered } from '../services/notifications'
import { detectLanguage } from '../utils/language'

/**
 * Set business context for a customer (called from start handler).
 */
export async function setCustomerBusiness(telegramId: number, uniqueLink: string) {
  try {
    await setBotUserContext(telegramId, uniqueLink)
  } catch (err) {
    console.error('Failed to persist customer context:', err)
  }
}

/**
 * Handle a customer question — the core RAG flow.
 */
export async function handleCustomerQuestion(
  ctx: Context,
  questionText: string,
  sourceType: 'text' | 'voice' = 'text'
) {
  const userId = ctx.from?.id
  if (!userId || !questionText.trim()) return

  // Look up which business this customer is talking to
  let uniqueLink: string | null = null
  try {
    uniqueLink = await getBotUserContext(userId)
  } catch (err) {
    await ctx.reply('❌ የዳታቤዝ ስህተት አጋጥሟል / Database error occurred. Please try /start again.')
    return
  }

  if (!uniqueLink) {
    await ctx.reply(
      '👋 ሰላም! ለመጀመር የንግዱን ሊንክ ጠቅ ያድርጉ / Hello! Please click a business link to start.'
    )
    return
  }

  const business = await getBusinessByUniqueLink(uniqueLink)
  if (!business || !business.is_active) {
    await ctx.reply('😔 ይህ ንግድ አሁን አይገኝም / This business is currently unavailable.')
    return
  }

  await ctx.sendChatAction('typing')

  const language = detectLanguage(questionText)

  try {
    // RAG search + AI answer
    const answer = await ragSearch({
      question: questionText,
      businessId: business.id,
      businessName: business.name,
      businessDescription: business.description,
      language,
    })

    if (answer) {
      // ✅ Answer found
      await ctx.reply(answer)

      await saveConversation({
        businessId: business.id,
        customerTelegramId: userId,
        customerUsername: ctx.from?.username,
        question: questionText,
        answer,
        wasAnswered: true,
        sourceType,
        languageDetected: language,
      })

      await upsertStats(business.id, {
        total_questions: 1,
        answered_questions: 1,
      })
    } else {
      // ❌ No answer found
      const noAnswerMsg =
        language === 'amharic'
          ? `😔 ይቅርታ፣ ለዚህ ጥያቄ መልስ አላገኘሁም።\n\nባለቤቱን ያነጋግሩ / Contact the owner directly.`
          : `😔 Sorry, I don't have an answer for this question.\n\nPlease contact the business owner directly.`

      await ctx.reply(noAnswerMsg)

      const conv = await saveConversation({
        businessId: business.id,
        customerTelegramId: userId,
        customerUsername: ctx.from?.username,
        question: questionText,
        wasAnswered: false,
        sourceType,
        languageDetected: language,
      })

      // Notify business owner
      await notifyOwnerUnanswered({
        ownerTelegramId: Number(business.owner_telegram_id),
        customerUsername: ctx.from?.username,
        customerTelegramId: userId,
        question: questionText,
      })

      await createNotification({
        businessId: business.id,
        type: 'unanswered_question',
        message: `Unanswered: "${questionText}"`,
        conversationId: conv.id,
      })

      await upsertStats(business.id, {
        total_questions: 1,
        unanswered_questions: 1,
      })
    }
  } catch (err) {
    console.error('Customer question error:', err)
    await ctx.reply('❌ ስህተት / Error occurred. Please try again.')
  }
}

/**
 * Main text message handler — routes to owner update or customer question.
 */
export async function handleMessage(ctx: Context) {
  const text = (ctx.message as any)?.text as string
  if (!text || text.startsWith('/')) return

  const userId = ctx.from?.id
  if (!userId) return

  const { getBusinessByOwnerId } = await import('../services/supabase')
  const isOwner = !!(await getBusinessByOwnerId(userId))

  if (isOwner) {
    const { handleOwnerUpdate } = await import('./update')
    await handleOwnerUpdate(ctx)
  } else {
    await handleCustomerQuestion(ctx, text, 'text')
  }
}
