import { NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'
import { generateApiKey, hashApiKey } from '@/lib/api-auth'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const telegramId = cookieStore.get('owner_telegram_id')?.value
  if (!telegramId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: business } = await supabase
    .from('AskMelaBusinesses')
    .select('id')
    .eq('owner_telegram_id', telegramId)
    .single()

  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('AskMelaApiKeys')
    .select('id, name, key_prefix, created_at, last_used_at')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Failed to fetch keys' }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const telegramId = cookieStore.get('owner_telegram_id')?.value
  if (!telegramId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })

  const { data: business } = await supabase
    .from('AskMelaBusinesses')
    .select('id')
    .eq('owner_telegram_id', telegramId)
    .single()

  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  const fullKey = generateApiKey()
  const hashedKey = hashApiKey(fullKey)

  const { error } = await supabase.from('AskMelaApiKeys').insert({
    business_id: business.id,
    name,
    key_prefix: 'ask_live_',
    key_hash: hashedKey
  })

  if (error) return NextResponse.json({ error: 'Failed to save key' }, { status: 500 })

  return NextResponse.json({ key: fullKey })
}
