import { Context } from 'telegraf'

/**
 * /help command handler.
 */
export async function handleHelp(ctx: Context) {
  await ctx.reply(
    `❓ *AskMela — እርዳታ / Help*\n\n` +
      `*Owner Commands:*\n` +
      `📝 *Send text* — Add to knowledge base\n` +
      `🎤 *Send voice* — Transcribe and add to knowledge base\n` +
      `📸 *Send photo* — Extract text and add to knowledge base\n` +
      `📥 *Send file* — Import CSV/Excel/PDF/Word data\n\n` +
      `📊 /stats — View today's statistics\n` +
      `🗑️ /clear — Delete ALL knowledge base data\n` +
      `🚀 /start — View your bot dashboard\n` +
      `❓ /help — Show this help message\n\n` +
      `*For Customers:*\n` +
      `Ask any question by text or voice.\n\n` +
      `_Powered by AskMela — askmela.xyz_`,
    { parse_mode: 'Markdown' }
  )
}
