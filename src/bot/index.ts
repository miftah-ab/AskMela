import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })
import { Telegraf, session } from 'telegraf'
import { handleStart } from './handlers/start'
import { handleHelp } from './handlers/help'
import { handleStats } from './handlers/stats'
import { handleVoice } from './handlers/voice'
import { handlePhoto } from './handlers/photo'
import { handleMessage, setCustomerBusiness, customerSessions } from './handlers/customer'
import { isAdmin, handleAdminStats, handleAdminAnnounce } from './handlers/admin'
import { rateLimitMiddleware } from './middleware/rateLimit'

// ─── Bot Initialization ───────────────────────────────────────────────────────

const bot = new Telegraf(process.env.BOT_TOKEN!)

// ─── Middleware ───────────────────────────────────────────────────────────────

bot.use(session())
bot.use(rateLimitMiddleware)

// ─── Commands ─────────────────────────────────────────────────────────────────

bot.start(async (ctx) => {
  // Capture deep link payload for customer routing
  const payload = ctx.startPayload
  if (payload?.startsWith('biz_')) {
    setCustomerBusiness(ctx.from.id, payload)
  }
  await handleStart(ctx)
})

bot.command('help', handleHelp)
bot.command('stats', handleStats)

// Admin Commands
bot.command('adminstats', isAdmin, handleAdminStats)
bot.command('adminannounce', isAdmin, handleAdminAnnounce)

// ─── Message Handlers ─────────────────────────────────────────────────────────

bot.on('voice', handleVoice)
bot.on('photo', handlePhoto)
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

// ─── Error Handling ───────────────────────────────────────────────────────────

bot.catch((err, ctx) => {
  console.error(`Bot error for ${ctx.updateType}:`, err)
})

// ─── Launch ───────────────────────────────────────────────────────────────────

async function launch() {
  if (process.env.NODE_ENV === 'production') {
    // Webhook mode for production
    const webhookUrl = process.env.WEBHOOK_URL!
    const secretToken = process.env.WEBHOOK_SECRET!
    const port = parseInt(process.env.PORT || '3001')

    await bot.launch({
      webhook: {
        domain: webhookUrl,
        port,
        secretToken,
      },
    })

    console.log(`🚀 AskMela bot running in webhook mode on port ${port}`)
    console.log(`📡 Webhook: ${webhookUrl}/telegraf/${bot.secretPathComponent()}`)
  } else {
    // Long polling for development
    await bot.launch()
    console.log(`🤖 AskMela bot running in polling mode (development)`)
    console.log(`📱 Bot: @${process.env.NEXT_PUBLIC_BOT_USERNAME}`)
  }
}

launch().catch(console.error)

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export { bot }
