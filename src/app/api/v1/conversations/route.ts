import { NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-auth'
import { supabase } from '@/bot/services/supabase'

export async function GET(req: Request) {
  const auth = await validateApiKey(req.headers.get('Authorization'))
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { businessId } = auth
  
  const { data, error } = await supabase
    .from('AskMelaConversations')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }

  return NextResponse.json(data)
}
