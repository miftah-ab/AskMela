import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'
import { ImportService } from '@/lib/import-service'

export async function POST(req: NextRequest) {
  try {
    const { sheetUrl, businessId } = await req.json()

    if (!sheetUrl || !businessId) {
      return NextResponse.json({ error: 'Missing sheetUrl or businessId' }, { status: 400 })
    }

    // 1. Create or update sync record
    const { data: syncRec, error: syncErr } = await supabase
      .from('AskMelaSheetsSync')
      .upsert({
        business_id: businessId,
        sheet_url: sheetUrl,
        is_active: true
      })
      .select()
      .single()

    if (syncErr) throw syncErr

    // 2. Create import record for this specific sync run
    const { data: importRec, error: importErr } = await supabase
      .from('AskMelaImports')
      .insert({
        business_id: businessId,
        type: 'google_sheets',
        source_url: sheetUrl,
        status: 'processing'
      })
      .select()
      .single()

    if (importErr) throw importErr

    // Update business table as well (Part 5 requirement)
    await supabase
      .from('AskMelaBusinesses')
      .update({ sheets_sync_url: sheetUrl })
      .eq('id', businessId)

    // Start processing
    processInBackground(sheetUrl, businessId, importRec.id, syncRec.id)

    return NextResponse.json({ 
      success: true, 
      jobId: importRec.id,
      message: 'Sync started'
    })

  } catch (err: any) {
    console.error('Sheet Sync Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

async function processInBackground(sheetUrl: string, businessId: string, importId: string, syncId: string) {
  try {
    const result = await ImportService.processGoogleSheets(sheetUrl, businessId, importId)
    
    // Update import record
    await supabase
      .from('AskMelaImports')
      .update({ 
        status: result.success ? 'completed' : 'failed',
        row_count: result.count,
        error: result.error
      })
      .eq('id', importId)

    // Update sync record
    if (result.success) {
      await supabase
        .from('AskMelaSheetsSync')
        .update({ 
          last_synced_at: new Date().toISOString(),
          next_sync_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h later
          rows_count: result.count
        })
        .eq('id', syncId)
    }
  } catch (err: any) {
    await supabase
      .from('AskMelaImports')
      .update({ status: 'failed', error: err.message })
      .eq('id', importId)
  }
}
