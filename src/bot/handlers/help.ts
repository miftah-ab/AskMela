import { Context } from 'telegraf'

/**
 * /help command handler.
 */
export async function handleHelp(ctx: Context) {
  await ctx.reply(
    `❓ *AskMela — እርዳታ / Help*\n\n` +
      `*ለባለቤቶች / For Business Owners:*\n\n` +
      `📝 *ጽሑፍ ይላኩ / Send text* — ማንኛውም ጽሑፍ ወደ ዕውቀት ቤቱ ይጨምሩ\n` +
      `_Send any text to add to your knowledge base_\n\n` +
      `🎤 *ድምፅ ይላኩ / Send voice* — ድምፅ ወደ ጽሑፍ ይቀየራል\n` +
      `_Voice messages are transcribed automatically_\n\n` +
      `📸 *ፎቶ ይላኩ / Send photo* — ሜኑ፣ ዋጋ፣ ምርት ፎቶ\n` +
      `_Menu, price list, or product photos are read automatically_\n\n` +
      `📊 /stats — የዛሬ ስታቲስቲክስ / Today's statistics\n` +
      `🚀 /start — ዳሽቦርድ / Dashboard\n\n` +
      `*ለደንበኞች / For Customers:*\n\n` +
      `ማንኛውንም ጥያቄ በጽሑፍ ወይም በድምፅ ይጠይቁ።\n` +
      `_Ask any question by text or voice._\n\n` +
      `_Powered by AskMela — askmela.xyz_`,
    { parse_mode: 'Markdown' }
  )
}
