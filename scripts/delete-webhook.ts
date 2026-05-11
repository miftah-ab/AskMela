import 'dotenv/config'

/**
 * Delete Telegram webhook (switch to polling mode).
 * Run: npm run webhook:delete
 */
async function deleteWebhook() {
  const token = process.env.BOT_TOKEN!
  const url = `https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=true`

  const response = await fetch(url)
  const data = await response.json() as { ok: boolean; description?: string }

  if (data.ok) {
    console.log('✅ Webhook deleted. Bot will use long polling.')
  } else {
    console.error('❌ Failed to delete webhook:', data.description)
  }
}

deleteWebhook()
