import { NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params
  const { data, error } = await supabase
    .from('AskMelaBusinesses')
    .select('id, name, description, is_active')
    .or(`id.eq.${businessId},unique_link.eq.${businessId}`)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
