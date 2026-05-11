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
    .from('AskMelaStats')
    .select('*')
    .eq('business_id', businessId)
    .order('date', { ascending: false })
    .limit(30)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }

  return NextResponse.json(data)
}
