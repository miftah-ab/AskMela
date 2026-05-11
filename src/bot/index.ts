import dotenv from 'dotenv'
import path from 'path'
import { Telegraf } from 'telegraf'

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
    console.error(`Check your .env.${nodeEnv} file or hosting provider settings.`)
    process.exit(1)
  }
}

// ─── Imports ──────────────────────────────────────────────────────────────────
import { handleStart } from './handlers/start'
import { handleHelp } from './handlers/help'
import { handleStats } from './handlers/stats'
import { handleVoice } from './handlers/voice'
import { handlePhoto } from './handlers/photo'
import { handleMessage, setCustomerBusiness } from './handlers/customer'
import { isAdmin, handleAdminStats, handleAdminAnnounce } from './handlers/admin'
import { rateLimitMiddleware } from './middleware/rateLimit'

const bot = new Telegraf(process.env.BOT_TOKEN!)

// ─── Middleware ───────────────────────────────────────────────────────────────
bot.use(rateLimitMiddleware)

// ─── Commands & Handlers ───────────────────────────────────────────────────────
bot.start(async (ctx) => {
  const payload = ctx.startPayload
  if (payload?.startsWith('biz_')) {
    await setCustomerBusiness(ctx.from.id, payload)
  }
  await handleStart(ctx)
})

bot.command('help', handleHelp)
bot.command('stats', handleStats)
bot.command('adminstats', isAdmin, handleAdminStats)
bot.command('adminannounce', isAdmin, handleAdminAnnounce)

bot.on('voice', handleVoice)
bot.on('photo', handlePhoto)
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

// ─── Launch Logic ─────────────────────────────────────────────────────────────
async function launch() {
  if (nodeEnv === 'production') {
    const webhookUrl = process.env.WEBHOOK_URL!
    const secretToken = process.env.WEBHOOK_SECRET!
    const port = parseInt(process.env.PORT || '3000')

    console.log(`📡 Setting up webhook: ${webhookUrl}`)
    await bot.launch({
      webhook: {
        domain: webhookUrl,
        port: port,
        hookPath: '/webhook',
        secretToken: secretToken,
      },
    })
    console.log(`🚀 AskMela Bot is LIVE on Render (Port: ${port})`)
    console.log(`📡 Webhook Path: /webhook`)
  } else {
    console.log('🤖 Starting bot in Long Polling mode...')
    await bot.launch()
    console.log('✅ Bot is running locally.')
  }
}

launch().catch((err) => {
  console.error('❌ Failed to launch bot:', err)
  process.exit(1)
})

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down bot...`)
  bot.stop(signal)
  process.exit(0)
}

process.once('SIGINT', () => shutdown('SIGINT'))
process.once('SIGTERM', () => shutdown('SIGTERM'))

export { bot }
