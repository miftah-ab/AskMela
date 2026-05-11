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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  try {
    await bot.handleUpdate(body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'AskMela webhook is running' })
}
