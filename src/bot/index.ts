import dotenv from 'dotenv'
import path from 'path'
import { Telegraf } from 'telegraf'
import { getBusinessByOwnerId } from './services/supabase'

// ─── Environment Validation ──────────────────────────────────────────────────
const nodeEnv = process.env.NODE_ENV || 'development'
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) })

const requiredEnv = [
  'BOT_TOKEN',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GROQ_API_KEY'
]

if (nodeEnv === 'production') {
  requiredEnv.push('WEBHOOK_URL', 'WEBHOOK_SECRET')
}

console.log(`🔧 Initializing AskMela Bot in ${nodeEnv} mode...`)

for (const env of requiredEnv) {
  if (!process.env[env]) {
    console.error(`❌ CRITICAL ERROR: Missing environment variable: ${env}`)
    process.exit(1)
  }
}

// ─── Imports ──────────────────────────────────────────────────────────────────
import { handleStart } from './handlers/start'
import { handleHelp } from './handlers/help'
import { handleStats } from './handlers/stats'
import { handleVoice } from './handlers/voice'
import { handlePhoto } from './handlers/photo'
import { handleMessage, setCustomerBusiness, handleCustomerQuestion } from './handlers/customer'
import { isAdmin, handleAdminStats, handleAdminAnnounce } from './handlers/admin'
import { rateLimitMiddleware } from './middleware/rateLimit'
import { handleOwnerUpdate, handleOwnerVoice, handleOwnerPhoto, handleClearKnowledge } from './handlers/update'

const bot = new Telegraf(process.env.BOT_TOKEN!)

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

// Admin Commands
bot.command('adminstats', isAdmin, handleAdminStats)
bot.command('adminannounce', isAdmin, handleAdminAnnounce)

// ─── Unified Handlers ─────────────────────────────────────────────────────────

// Voice handler (Owner vs Customer)
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

// Photo handler (Owner vs Customer)
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

// Text handler (Owner vs Customer)
bot.on('text', handleMessage)

// ─── Callback Queries ─────────────────────────────────────────────────────────
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

// ─── Launch ───────────────────────────────────────────────────────────────────
async function launch() {
  if (nodeEnv === 'production') {
    const webhookUrl = process.env.WEBHOOK_URL!
    const secretToken = process.env.WEBHOOK_SECRET!
    const port = parseInt(process.env.PORT || '3000')

    await bot.launch({
      webhook: {
        domain: webhookUrl,
        port: port,
        hookPath: '/webhook',
        secretToken: secretToken,
      },
    })
    console.log(`🚀 AskMela Bot is LIVE on Render (Port: ${port})`)
  } else {
    await bot.launch()
    console.log('✅ Bot is running in Polling mode.')
  }
}

launch().catch(console.error)

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export { bot }
