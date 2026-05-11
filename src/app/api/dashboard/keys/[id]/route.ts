import { NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'
import { cookies } from 'next/headers'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const cookieStore = await cookies()
  const telegramId = cookieStore.get('owner_telegram_id')?.value
  if (!telegramId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: business } = await supabase
    .from('AskMelaBusinesses')
    .select('id')
    .eq('owner_telegram_id', telegramId)
    .single()

  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  const { error } = await supabase
    .from('AskMelaApiKeys')
    .delete()
    .eq('id', id)
    .eq('business_id', business.id)

  if (error) return NextResponse.json({ error: 'Failed to revoke key' }, { status: 500 })

  return NextResponse.json({ success: true })
}
