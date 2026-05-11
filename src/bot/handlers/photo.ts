import { Context } from 'telegraf'
import { getBusinessByOwnerId } from '../services/supabase'
import { extractTextFromPhoto } from '../services/groq'
import { addToKnowledgeBase } from '../services/rag'
import { truncate } from '../utils/format'

/**
 * Handle photo messages from business owners.
 * Uses Groq vision to extract text, then adds to knowledge base.
 * NEVER stores the photo — only the extracted text + file_id reference.
 */
export async function handlePhoto(ctx: Context) {
  const photos = (ctx.message as any)?.photo as Array<{
    file_id: string
    file_size: number
    width: number
    height: number
  }>
  if (!photos || photos.length === 0) return

  const userId = ctx.from?.id
  if (!userId) return

  const business = await getBusinessByOwnerId(userId)
  if (!business) {
    await ctx.reply(
      '⚠️ ፎቶ ለደንበኞች ይላኩ፣ ወደ ቦቱ አያስፈልግም / Photos for customers — please add info as text or voice instead.'
    )
    return
  }

  await ctx.sendChatAction('typing')

  try {
    // Get the highest-resolution photo
    const bestPhoto = photos[photos.length - 1]
    const fileLink = await ctx.telegram.getFileLink(bestPhoto.file_id)
    const fileUrl = fileLink.href

    // Extract text with Groq Vision
    const extractedText = await extractTextFromPhoto(fileUrl)

    if (!extractedText.trim()) {
      await ctx.reply(
        '😔 ፎቶውን ማንበብ አልቻልኩም / Could not extract information from photo. Please try a clearer image.'
      )
      return
    }

    // Store extracted text + file_id (never the file itself)
    await addToKnowledgeBase({
      businessId: business.id,
      content: extractedText,
      sourceType: 'photo',
      telegramFileId: bestPhoto.file_id,
    })

    await ctx.reply(
      `✅ *ፎቶው ተዘጋጅቷል / Photo processed*\n\n` +
        `📝 የተወጣው ጽሑፍ / Extracted:\n_"${truncate(extractedText, 300)}"_\n\n` +
        `_Added to your knowledge base._`,
      { parse_mode: 'Markdown' }
    )
  } catch (err) {
    console.error('Photo handler error:', err)
    await ctx.reply('❌ ስህተት ተፈጥሯል / Error processing photo. Please try again.')
  }
}
