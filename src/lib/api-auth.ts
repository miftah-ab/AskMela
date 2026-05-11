import { createHash, randomBytes } from 'crypto'
import { supabase } from '../bot/services/supabase'

export function generateApiKey() {
  const bytes = randomBytes(32)
  const key = `ask_live_${bytes.toString('hex')}`
  return key
}

export function hashApiKey(key: string) {
  return createHash('sha256').update(key).digest('hex')
}

export async function validateApiKey(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid Authorization header', status: 401 }
  }

  const key = authHeader.replace('Bearer ', '')
  const hashedKey = hashApiKey(key)

  const { data: keyRecord, error } = await supabase
    .from('AskMelaApiKeys')
    .select('business_id, id')
    .eq('key_hash', hashedKey)
    .single()

  if (error || !keyRecord) {
    return { error: 'Unauthorized: Invalid API Key', status: 401 }
  }

  // Update last used
  await supabase
    .from('AskMelaApiKeys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', keyRecord.id)

  return { businessId: keyRecord.business_id }
}
