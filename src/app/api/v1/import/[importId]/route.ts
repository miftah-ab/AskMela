import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ importId: string }> }
) {
  try {
    const { importId } = await params
    
    // Delete documents associated with this import
    const { error: docErr } = await supabase
      .from('AskMelaDocuments')
      .delete()
      .eq('import_id', importId)

    if (docErr) throw docErr

    // Delete the import record itself
    const { error: impErr } = await supabase
      .from('AskMelaImports')
      .delete()
      .eq('id', importId)

    if (impErr) throw impErr

    return NextResponse.json({ success: true, message: 'Import and associated data deleted' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
