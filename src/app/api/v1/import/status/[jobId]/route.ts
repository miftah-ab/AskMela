import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    
    const { data, error } = await supabase
      .from('AskMelaImports')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
