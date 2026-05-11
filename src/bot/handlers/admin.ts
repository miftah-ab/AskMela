import { Context } from 'telegraf'
import { supabase } from '../services/supabase'

const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID ? Number(process.env.ADMIN_TELEGRAM_ID) : null

/**
 * Middleware to check if user is admin
 */
export async function isAdmin(ctx: Context, next: () => Promise<void>) {
  if (ctx.from?.id === ADMIN_ID) {
    return next()
  }
  // Silently ignore or send error
  return
}

/**
 * /adminstats — Quick system overview
 */
export async function handleAdminStats(ctx: Context) {
  const { count: bizCount } = await supabase.from('AskMelaBusinesses').select('*', { count: 'exact', head: true })
  const { count: convCount } = await supabase.from('AskMelaConversations').select('*', { count: 'exact', head: true })
  
  await ctx.reply(
    `📊 *AskMela System Stats*\n\n` +
    `🏢 Total Businesses: *${bizCount || 0}*\n` +
    `💬 Total Conversations: *${convCount || 0}*\n` +
    `🟢 Bot Status: *Online*`,
    { parse_mode: 'Markdown' }
  )
}

/**
 * /adminannounce [message] — Send to all active owners
 */
export async function handleAdminAnnounce(ctx: Context) {
  const text = (ctx.message as any)?.text?.replace('/adminannounce', '').trim()
  if (!text) {
    return ctx.reply('⚠️ Please provide a message: `/adminannounce Hello owners!`')
  }

  const { data: businesses } = await supabase
    .from('AskMelaBusinesses')
    .select('owner_telegram_id')
    .eq('is_active', true)

  if (!businesses || businesses.length === 0) {
    return ctx.reply('No active businesses found.')
  }

  let successCount = 0
  for (const biz of businesses) {
    try {
      await ctx.telegram.sendMessage(Number(biz.owner_telegram_id), `📣 *ANNOUNCEMENT*\n\n${text}`, { parse_mode: 'Markdown' })
      successCount++
    } catch (err) {
      console.error(`Failed to send announcement to ${biz.owner_telegram_id}`)
    }
  }

  await ctx.reply(`✅ Announcement sent to ${successCount} owners.`)
}
