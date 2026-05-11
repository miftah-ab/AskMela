import { supabase } from '../src/bot/services/supabase'
import { ImportService } from '../src/lib/import-service'
import { generateEmbedding } from '../src/bot/services/groq'

async function syncAllSheets() {
  console.log('🔄 Starting daily Google Sheets sync...')

  // 1. Fetch all active syncs
  const { data: syncs, error } = await supabase
    .from('AskMelaSheetsSync')
    .select('*')
    .eq('is_active', true)

  if (error) {
    console.error('Failed to fetch syncs:', error)
    return
  }

  console.log(`Found ${syncs.length} active syncs.`)

  for (const sync of syncs) {
    try {
      console.log(`Syncing business ${sync.business_id} from ${sync.sheet_url}...`)
      
      // 1. Create a new import record for this sync
      const { data: importRec } = await supabase
        .from('AskMelaImports')
        .insert({
          business_id: sync.business_id,
          type: 'google_sheets',
          source_url: sync.sheet_url,
          status: 'processing'
        })
        .select()
        .single()

      if (!importRec) continue

      // 2. Fetch fresh data from sheet
      // We'll use the same logic as ImportService but manually compare for sync logic
      const freshData = await fetchSheetData(sync.sheet_url)
      
      // 3. Get existing documents from this source
      const { data: existingDocs } = await supabase
        .from('AskMelaDocuments')
        .select('id, source_row, content, metadata')
        .eq('business_id', sync.business_id)
        .eq('source_url', sync.sheet_url)

      const existingMap = new Map(existingDocs?.map(d => [d.source_row, d]))

      let added = 0
      let updated = 0
      let removed = 0

      // 4. Update and Add
      for (let i = 0; i < freshData.length; i++) {
        const row = freshData[i]
        const rowNum = i + 1
        const content = convertRowToText(row)
        const existing = existingMap.get(rowNum)

        if (!existing) {
          // Add new
          const embedding = await generateEmbedding(content)
          await supabase.from('AskMelaDocuments').insert({
            business_id: sync.business_id,
            content,
            embedding,
            source_type: 'text',
            import_id: importRec.id,
            source_url: sync.sheet_url,
            source_row: rowNum,
            metadata: row
          })
          added++
        } else if (existing.content !== content) {
          // Update changed
          const embedding = await generateEmbedding(content)
          await supabase.from('AskMelaDocuments').update({
            content,
            embedding,
            metadata: row
          }).eq('id', existing.id)
          updated++
        }
        // Remove from map to track what's left (to be deleted)
        existingMap.delete(rowNum)
      }

      // 5. Remove deleted rows
      for (const [rowNum, doc] of existingMap.entries()) {
        await supabase.from('AskMelaDocuments').delete().eq('id', doc.id)
        removed++
      }

      // 6. Finalize records
      await supabase
        .from('AskMelaImports')
        .update({ 
          status: 'completed',
          row_count: freshData.length,
          error: `Sync result: Added ${added}, Updated ${updated}, Removed ${removed}`
        })
        .eq('id', importRec.id)

      await supabase
        .from('AskMelaSheetsSync')
        .update({ 
          last_synced_at: new Date().toISOString(),
          next_sync_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          rows_count: freshData.length
        })
        .eq('id', sync.id)

      console.log(`✅ Business ${sync.business_id} synced: +${added}, ~${updated}, -${removed}`)

    } catch (err) {
      console.error(`Failed to sync business ${sync.business_id}:`, err)
    }
  }
}

async function fetchSheetData(sheetUrl: string): Promise<Record<string, string>[]> {
  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (!match) throw new Error('Invalid Google Sheet URL')
  const sheetId = match[1]
  const jsonUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
  const response = await fetch(jsonUrl)
  const text = await response.text()
  const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
  const json = JSON.parse(jsonStr)
  const cols = json.table.cols.map((c: any) => c.label || 'column')
  return json.table.rows.map((r: any) => {
    const rowData: Record<string, string> = {}
    r.c.forEach((cell: any, i: number) => {
      if (cell && cell.v !== null) rowData[cols[i] || `col_${i}`] = String(cell.v)
    })
    return rowData
  })
}

function convertRowToText(row: Record<string, any>): string {
  return Object.entries(row)
    .filter(([_, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('. ') + '.'
}

syncAllSheets().then(() => process.exit(0)).catch(err => {
  console.error(err)
  process.exit(1)
})
