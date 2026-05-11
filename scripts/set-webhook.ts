import 'dotenv/config'

/**
 * Set Telegram webhook for the bot.
 * Run: npm run webhook:set
 */
async function setWebhook() {
  const token = process.env.BOT_TOKEN!
  const webhookUrl = process.env.WEBHOOK_URL!
  const secret = process.env.WEBHOOK_SECRET!

  const url = `https://api.telegram.org/bot${token}/setWebhook`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: `${webhookUrl}/api/webhook`,
      secret_token: secret,
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: true,
    }),
  })

  const data = await response.json() as { ok: boolean; description?: string }

  if (data.ok) {
    console.log(`✅ Webhook set successfully!`)
    console.log(`📡 URL: ${webhookUrl}/api/webhook`)
  } else {
    console.error(`❌ Failed to set webhook:`, data.description)
    process.exit(1)
  }
}

setWebhook()
