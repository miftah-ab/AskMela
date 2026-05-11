import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

/**
 * DELETE /api/documents/[id]
 * Deletes a document from the knowledge base.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const session = cookieStore.get('askmela_user')

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = JSON.parse(session.value)
    const { id } = await params

    // Verify ownership before deleting
    const { data: doc, error: fetchError } = await supabase
      .from('AskMelaDocuments')
      .select('business_id, AskMelaBusinesses(owner_telegram_id)')
      .eq('id', id)
      .single()

    if (fetchError || !doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // @ts-ignore
    if (Number((doc.AskMelaBusinesses as any).owner_telegram_id) !== Number(user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: deleteError } = await supabase
      .from('AskMelaDocuments')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete document error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
