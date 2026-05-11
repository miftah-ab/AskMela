import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'
import { ImportService } from '@/lib/import-service'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const businessId = formData.get('businessId') as string

    if (!file || !businessId) {
      return NextResponse.json({ error: 'Missing file or businessId' }, { status: 400 })
    }

    // 1. Create import record
    const { data: importRec, error: importErr } = await supabase
      .from('AskMelaImports')
      .insert({
        business_id: businessId,
        type: 'csv',
        file_name: file.name,
        status: 'processing'
      })
      .select()
      .single()

    if (importErr) throw importErr

    // 2. Process in background (but since we want to show progress, we might need a different approach)
    // For now, we'll process it and return when done, or use a job ID.
    // The user asked for a job ID and a status endpoint.
    
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Start processing (async)
    processInBackground(buffer, businessId, importRec.id)

    return NextResponse.json({ 
      success: true, 
      jobId: importRec.id,
      message: 'Import started'
    })

  } catch (err: any) {
    console.error('CSV Import Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

async function processInBackground(buffer: Buffer, businessId: string, importId: string) {
  try {
    const result = await ImportService.processCSV(buffer, businessId, importId)
    
    await supabase
      .from('AskMelaImports')
      .update({ 
        status: result.success ? 'completed' : 'failed',
        row_count: result.count,
        error: result.error
      })
      .eq('id', importId)
  } catch (err: any) {
    await supabase
      .from('AskMelaImports')
      .update({ status: 'failed', error: err.message })
      .eq('id', importId)
  }
}
