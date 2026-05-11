import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'
import { randomBytes, createHash } from 'crypto'

/**
 * GET /api/v1/keys
 * List API keys for the current business.
 */
export async function GET(req: NextRequest) {
  // Authentication check (using existing session)
  const authRes = await fetch(new URL('/api/auth', req.url), { headers: req.headers })
  const { user } = await authRes.json()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { data: business } = await supabase
      .from('AskMelaBusinesses')
      .select('id')
      .eq('owner_telegram_id', user.id)
      .single()

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

    const { data: keys } = await supabase
      .from('AskMelaApiKeys')
      .select('id, name, key_prefix, created_at, last_used_at')
      .eq('business_id', business.id)

    return NextResponse.json({ keys })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch keys' }, { status: 500 })
  }
}

/**
 * POST /api/v1/keys
 * Create a new API key.
 */
export async function POST(req: NextRequest) {
  const authRes = await fetch(new URL('/api/auth', req.url), { headers: req.headers })
  const { user } = await authRes.json()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name } = await req.json()
    const { data: business } = await supabase
      .from('AskMelaBusinesses')
      .select('id')
      .eq('owner_telegram_id', user.id)
      .single()

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

    // Generate Key
    const key = `ask_live_${randomBytes(24).toString('hex')}`
    const keyHash = createHash('sha256').update(key).digest('hex')

    const { data: newKey, error } = await supabase
      .from('AskMelaApiKeys')
      .insert({
        business_id: business.id,
        name: name || 'Default Key',
        key_hash: keyHash,
        key_prefix: 'ask_live_...' + key.slice(-4)
      })
      .select()
      .single()

    if (error) throw error

    // Return the plain text key ONLY ONCE
    return NextResponse.json({ key, id: newKey.id })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create key' }, { status: 500 })
  }
}
