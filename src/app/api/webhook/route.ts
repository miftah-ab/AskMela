import { NextRequest, NextResponse } from 'next/server'
import { bot } from '@/bot/index'

/**
 * POST /api/webhook
 * Receives Telegram updates and passes them to Telegraf.
 * Secret token is verified to prevent unauthorized requests.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-telegram-bot-api-secret-token')

  if (secret !== process.env.WEBHOOK_SECRET) {
    console.error('❌ Webhook secret mismatch. Incoming secret:', secret);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  console.log('📬 Bot update received:', body.update_id, body.message?.text || body.callback_query?.data || 'non-text');

  try {
    await bot.handleUpdate(body)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('💥 Webhook processing error:', err.message);
    // Return 200 to Telegram to stop it from retrying failed updates indefinitely
    return NextResponse.json({ ok: true, error: err.message })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'AskMela webhook is running' })
}
