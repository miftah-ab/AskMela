import { Context } from 'telegraf'
import { getBusinessByOwnerId } from '../services/supabase'
import { addToKnowledgeBase } from '../services/rag'
import { truncate } from '../utils/format'
import { transcribeAudio, extractTextFromPhoto } from '../services/groq'
import { supabase } from '../services/supabase'
import { ImportService } from '../../lib/import-service'
import fetch from 'node-fetch'

/**
 * Handle text messages from business owners — adds to knowledge base.
 */
export async function handleOwnerUpdate(ctx: Context) {
  const text = (ctx.message as any)?.text as string
  if (!text || text.startsWith('/')) return

  const userId = ctx.from?.id
  if (!userId) return

  const business = await getBusinessByOwnerId(userId)
  if (!business) return

  await ctx.sendChatAction('typing')

  try {
    await addToKnowledgeBase({
      businessId: business.id,
      content: text,
      sourceType: 'text',
    })

    await ctx.reply(
      `✅ *መረጃው ተጨምሯል / Information added*\n\n` +
        `_"${truncate(text, 50)}..."_\n\n` +
        `ባለቤቱ: ደንበኞችዎ አሁን ስለዚህ መጠየቅ ይችላሉ።\n` +
        `_Owner: Your customers can now ask about this._`,
      { parse_mode: 'Markdown' }
    )
  } catch (err) {
    console.error('Knowledge base update error:', err)
    await ctx.reply('❌ ስህተት ተፈጥሯል / An error occurred.')
  }
}

/**
 * Handle voice messages from owners — transcribes and adds to KB.
 */
export async function handleOwnerVoice(ctx: Context) {
  const userId = ctx.from?.id
  if (!userId) return

  const business = await getBusinessByOwnerId(userId)
  if (!business) return

  const voice = (ctx.message as any).voice
  if (!voice) return

  await ctx.reply('🎤 ድምጹን እየተረጎምኩ ነው... / Transcribing voice...')
  await ctx.sendChatAction('typing')

  try {
    const fileLink = await ctx.telegram.getFileLink(voice.file_id)
    const transcription = await transcribeAudio(fileLink.href)

    if (!transcription.trim()) {
      await ctx.reply('⚠️ ድምጹ ባዶ ነው ወይም ሊረዳ አልተቻለም / Voice is empty or unclear.')
      return
    }

    await addToKnowledgeBase({
      businessId: business.id,
      content: transcription,
      sourceType: 'voice',
      telegramFileId: voice.file_id,
    })

    await ctx.reply(
      `✅ *ከድምጽ የተማርኩት / Learned from voice:*\n\n` +
        `_"${truncate(transcription, 50)}..."_\n\n` +
        `ይህ መረጃ ወደ እውቀት ማከማቻው ተጨምሯል።`,
      { parse_mode: 'Markdown' }
    )
  } catch (err) {
    console.error('Voice update error:', err)
    await ctx.reply('❌ ድምጹን መተርጎም አልተቻለም / Failed to transcribe voice.')
  }
}

/**
 * Handle photos from owners — extracts text and adds to KB.
 */
export async function handleOwnerPhoto(ctx: Context) {
  const userId = ctx.from?.id
  if (!userId) return

  const business = await getBusinessByOwnerId(userId)
  if (!business) return

  const photo = (ctx.message as any).photo
  if (!photo || photo.length === 0) return
  const largestPhoto = photo[photo.length - 1]

  await ctx.reply('🖼️ ምስሉን እያነበብኩ ነው... / Analyzing photo...')
  await ctx.sendChatAction('typing')

  try {
    const fileLink = await ctx.telegram.getFileLink(largestPhoto.file_id)
    const extractedText = await extractTextFromPhoto(fileLink.href)

    if (!extractedText.trim()) {
      await ctx.reply('⚠️ ከምስሉ ምንም መረጃ ማግኘት አልተቻለም / No info found in photo.')
      return
    }

    await addToKnowledgeBase({
      businessId: business.id,
      content: extractedText,
      sourceType: 'photo',
      telegramFileId: largestPhoto.file_id,
    })

    await ctx.reply(
      `✅ *ከምስሉ የተማርኩት / Learned from photo:*\n\n` +
        `_"${truncate(extractedText, 50)}..."_\n\n` +
        `ይህ መረጃ ወደ እውቀት ማከማቻው ተጨምሯል።`,
      { parse_mode: 'Markdown' }
    )
  } catch (err) {
    console.error('Photo update error:', err)
    await ctx.reply('❌ ምስሉን ማንበብ አልተቻለም / Failed to analyze photo.')
  }
}

/**
 * Clear knowledge base for a business.
 */
export async function handleClearKnowledge(ctx: Context) {
  const userId = ctx.from?.id
  if (!userId) return

  const business = await getBusinessByOwnerId(userId)
  if (!business) return

  try {
    const { error } = await supabase
      .from('AskMelaDocuments')
      .delete()
      .eq('business_id', business.id)

    if (error) throw error

    await ctx.reply('🗑️ የእውቀት ማከማቻው ሙሉ በሙሉ ተሰርዟል። / Knowledge base cleared successfully.')
  } catch (err) {
    console.error('Clear KB error:', err)
    await ctx.reply('❌ ማጽዳት አልተቻለም / Failed to clear knowledge base.')
  }
}

/**
 * Handle document files from owners (CSV, Excel, PDF, etc).
 */
export async function handleOwnerDocument(ctx: Context) {
  const userId = ctx.from?.id
  if (!userId) return

  const business = await getBusinessByOwnerId(userId)
  if (!business) return

  const doc = (ctx.message as any).document
  if (!doc) return

  const fileName = doc.file_name || 'document'
  const extension = fileName.split('.').pop()?.toLowerCase()

  const supported = ['csv', 'xlsx', 'xls', 'pdf', 'docx', 'txt']
  if (!extension || !supported.includes(extension)) {
    await ctx.reply(`⚠️ ይህ ፋይል አይደገፍም / File type not supported: .${extension}\nየሚደገፉ: CSV, Excel, PDF, Word, Text`)
    return
  }

  await ctx.reply(`📥 ${fileName} እየተነበበ ነው... / Processing ${fileName}...`)
  await ctx.sendChatAction('typing')

  try {
    const fileLink = await ctx.telegram.getFileLink(doc.file_id)
    const response = await fetch(fileLink.href)
    const buffer = Buffer.from(await response.arrayBuffer())

    // Create import record
    const { data: importRec } = await supabase
      .from('AskMelaImports')
      .insert({
        business_id: business.id,
        type: extension,
        file_name: fileName,
        status: 'processing'
      })
      .select()
      .single()

    let result
    if (extension === 'csv') {
      result = await ImportService.processCSV(buffer, business.id, importRec.id)
    } else if (extension === 'xlsx' || extension === 'xls') {
      result = await ImportService.processExcel(buffer, business.id, importRec.id)
    } else if (extension === 'pdf') {
      result = await ImportService.processPDF(buffer, business.id, importRec.id)
    } else if (extension === 'docx') {
      result = await ImportService.processWord(buffer, business.id, importRec.id)
    } else {
      result = await ImportService.processText(buffer, business.id, importRec.id)
    }

    await supabase
      .from('AskMelaImports')
      .update({ 
        status: result.success ? 'completed' : 'failed',
        row_count: result.count,
        error: result.error
      })
      .eq('id', importRec.id)

    if (result.success) {
      await ctx.reply(
        `✅ *በተሳካ ሁኔታ ተጭኗል / Successfully imported!*\n\n` +
          `ፋይል: ${fileName}\n` +
          `የተገኙ መረጃዎች: ${result.count}\n\n` +
          `ደንበኞችዎ አሁን እነዚህን መረጃዎች ማግኘት ይችላሉ።`,
        { parse_mode: 'Markdown' }
      )
    } else {
      await ctx.reply(`❌ ስህተት ተፈጥሯል: ${result.error || 'Unknown error'}`)
    }
  } catch (err) {
    console.error('Document import error:', err)
    await ctx.reply('❌ ፋይሉን መጫን አልተቻለም / Failed to import document.')
  }
}
