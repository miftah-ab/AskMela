import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const businessId = searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'Missing businessId' }, { status: 400 })
    }

    // 1. Fetch imports history
    const { data: imports, error: impErr } = await supabase
      .from('AskMelaImports')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (impErr) throw impErr

    // 2. Fetch current sync status
    const { data: sync, error: syncErr } = await supabase
      .from('AskMelaSheetsSync')
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle()

    if (syncErr) throw syncErr

    return NextResponse.json({ imports, sync })
  } catch (err: any) {
    console.error('Import History Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
