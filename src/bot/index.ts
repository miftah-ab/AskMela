import { bot } from './core'

const nodeEnv = process.env.NODE_ENV || 'development'

async function launch() {
  console.log(`🔧 Launching AskMela Bot Worker in ${nodeEnv} mode...`)
  
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
