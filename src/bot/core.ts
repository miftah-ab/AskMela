import dotenv from 'dotenv'
import path from 'path'
import { Telegraf } from 'telegraf'
import { getBusinessByOwnerId } from './services/supabase'

// ─── Environment Validation ──────────────────────────────────────────────────
const nodeEnv = process.env.NODE_ENV || 'development'
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) })

const bot = new Telegraf(process.env.BOT_TOKEN!)

// ─── Imports ──────────────────────────────────────────────────────────────────
import { handleStart } from './handlers/start'
import { handleHelp } from './handlers/help'
import { handleStats } from './handlers/stats'
import { handleVoice } from './handlers/voice'
import { handlePhoto } from './handlers/photo'
import { handleMessage, setCustomerBusiness } from './handlers/customer'
import { isAdmin, handleAdminStats, handleAdminAnnounce } from './handlers/admin'
import { rateLimitMiddleware } from './middleware/rateLimit'
import { handleOwnerVoice, handleOwnerPhoto, handleClearKnowledge, handleOwnerDocument } from './handlers/update'

// ─── Middleware ───────────────────────────────────────────────────────────────
bot.use(rateLimitMiddleware)

// ─── Commands ─────────────────────────────────────────────────────────────────
bot.start(async (ctx) => {
  const payload = ctx.startPayload
  if (payload?.startsWith('biz_')) {
    await setCustomerBusiness(ctx.from.id, payload)
  }
  await handleStart(ctx)
})

bot.command('help', handleHelp)
bot.command('stats', handleStats)
bot.command('clear', handleClearKnowledge)
bot.command('import', async (ctx) => {
  await ctx.reply(
    `📥 *መረጃ በብዛት መጫኛ / Bulk Data Import*\n\n` +
    `መረጃዎችን በፍጥነት ለመጫን እነዚህን ፋይሎች ወደ እዚህ ቦት መላክ ይችላሉ:\n` +
    `• CSV (.csv)\n` +
    `• Excel (.xlsx, .xls)\n` +
    `• PDF (.pdf)\n` +
    `• Word (.docx)\n` +
    `• Text (.txt)\n\n` +
    `እንዲሁም በዳሽቦርዱ ላይ የGoogle Sheets ማገናኘት ይችላሉ።\n` +
    `_You can also connect Google Sheets on the dashboard._`,
    { parse_mode: 'Markdown' }
  )
})

bot.command('adminstats', isAdmin, handleAdminStats)
bot.command('adminannounce', isAdmin, handleAdminAnnounce)

// ─── Unified Handlers ─────────────────────────────────────────────────────────
bot.on('voice', async (ctx) => {
  const userId = ctx.from?.id
  if (!userId) return
  const isOwner = !!(await getBusinessByOwnerId(userId))
  if (isOwner) {
    await handleOwnerVoice(ctx)
  } else {
    await handleVoice(ctx)
  }
})

bot.on('photo', async (ctx) => {
  const userId = ctx.from?.id
  if (!userId) return
  const isOwner = !!(await getBusinessByOwnerId(userId))
  if (isOwner) {
    await handleOwnerPhoto(ctx)
  } else {
    await handlePhoto(ctx)
  }
})

bot.on('document', async (ctx) => {
  const userId = ctx.from?.id
  if (!userId) return
  const isOwner = !!(await getBusinessByOwnerId(userId))
  if (isOwner) {
    await handleOwnerDocument(ctx)
  }
})

bot.on('text', handleMessage)

bot.action('stats', async (ctx) => {
  await ctx.answerCbQuery()
  await handleStats(ctx)
})

bot.action('help', async (ctx) => {
  await ctx.answerCbQuery()
  await handleHelp(ctx)
})

bot.catch((err: any, ctx) => {
  console.error(`💥 Bot error for ${ctx.updateType}:`, err.message || err)
})

export { bot }
