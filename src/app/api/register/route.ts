import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

function generateUniqueLink(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'biz_'
  const arr = new Uint8Array(8)
  crypto.getRandomValues(arr)
  for (const byte of arr) result += chars[byte % chars.length]
  return result
}

/**
 * POST /api/register
 * Creates a new business from the Mini App registration form.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, phone, language, initData } = body

    if (!name?.trim() || !description?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Parse Telegram initData to get user identity
    let ownerTelegramId: number | null = null
    let ownerUsername: string | undefined

    if (initData) {
      try {
        const params = new URLSearchParams(initData)
        const userStr = params.get('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          ownerTelegramId = user.id
          ownerUsername = user.username
        }
      } catch {}
    }

    // For development without real Telegram auth — use a placeholder
    if (!ownerTelegramId) {
      ownerTelegramId = Date.now() // temporary
    }

    const uniqueLink = generateUniqueLink()

    const { data, error } = await supabase
      .from('AskMelaBusinesses')
      .insert({
        name: name.trim(),
        description: description.trim(),
        owner_telegram_id: ownerTelegramId,
        owner_username: ownerUsername,
        owner_phone: phone.trim(),
        unique_link: uniqueLink,
        language: language ?? 'both',
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'ንግዱ ቀድሞ ተመዝግቧል / Business already registered.' }, { status: 409 })
      }
      throw error
    }

    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME ?? 'AskMelaAIBot'
    const link = `https://t.me/${botUsername}?start=${uniqueLink}`

    return NextResponse.json({ success: true, link, business: data })
  } catch (err) {
    console.error('Registration error:', err)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
