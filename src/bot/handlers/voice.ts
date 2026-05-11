import { Context } from 'telegraf'
import { message } from 'telegraf/filters'
import { getBusinessByOwnerId } from '../services/supabase'
import { transcribeAudio } from '../services/groq'
import { addToKnowledgeBase } from '../services/rag'
import { truncate } from '../utils/format'

/**
 * Handle voice messages.
 * For owners: transcribe + add to knowledge base.
 * For customers: transcribe + route to customer handler.
 */
export async function handleVoice(ctx: Context) {
  const voice = (ctx.message as any)?.voice
  if (!voice) return

  const userId = ctx.from?.id
  if (!userId) return

  await ctx.sendChatAction('typing')

  try {
    // Get temporary file URL from Telegram
    const fileLink = await ctx.telegram.getFileLink(voice.file_id)
    const fileUrl = fileLink.href

    // Transcribe with Groq Whisper
    const transcribed = await transcribeAudio(fileUrl)

    if (!transcribed.trim()) {
      await ctx.reply('😔 ድምፁ ሊሰማ አልቻለም / Could not understand the audio. Please try again.')
      return
    }

    const isOwner = !!(await getBusinessByOwnerId(userId))

    if (isOwner) {
      // Owner: add transcription to knowledge base
      const business = await getBusinessByOwnerId(userId)
      await addToKnowledgeBase({
        businessId: business!.id,
        content: transcribed,
        sourceType: 'voice',
        telegramFileId: voice.file_id, // Store file_id reference only
      })

      await ctx.reply(
        `✅ *ድምፁ ተዘጋጅቷል / Voice processed*\n\n` +
          `📝 ጽሑፍ / Transcription:\n_"${truncate(transcribed, 200)}"_\n\n` +
          `_Added to your knowledge base._`,
        { parse_mode: 'Markdown' }
      )
    } else {
      // Customer: route transcription as a question
      const { handleCustomerQuestion } = await import('./customer')
      await handleCustomerQuestion(ctx, transcribed, 'voice')
    }
  } catch (err) {
    console.error('Voice handler error:', err)
    await ctx.reply('❌ ስህተት ተፈጥሯል / Error processing voice. Please try again.')
  }
}
