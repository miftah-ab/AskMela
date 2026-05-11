import { NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-auth'
import { supabase } from '@/bot/services/supabase'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await validateApiKey(req.headers.get('Authorization'))
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { businessId } = auth
  const { id } = await params

  const { error } = await supabase
    .from('AskMelaDocuments')
    .delete()
    .eq('id', id)
    .eq('business_id', businessId)

  if (error) {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Document deleted' })
}
