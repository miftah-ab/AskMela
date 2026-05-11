import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'
import { bot } from '@/bot/core'

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get('admin_session')
  if (sessionCookie?.value !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { message } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

    // 1. Fetch all active business owners
    const { data: businesses, error } = await supabase
      .from('AskMelaBusinesses')
      .select('owner_telegram_id')
      .eq('is_active', true)

    if (error) throw error

    // 2. Broadcast (Limited for safety in MVP)
    let sentCount = 0
    for (const b of businesses) {
      try {
        await bot.telegram.sendMessage(b.owner_telegram_id, message, { parse_mode: 'Markdown' })
        sentCount++
        // Rate limiting for Telegram (approx 30 msgs/sec)
        await new Promise(r => setTimeout(r, 50))
      } catch (err) {
        console.error(`Failed to send to owner ${b.owner_telegram_id}:`, err)
      }
    }

    return NextResponse.json({ success: true, sentCount })

  } catch (err) {
    console.error('Admin Announce API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
