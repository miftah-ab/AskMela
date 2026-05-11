import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('admin_session')
  if (sessionCookie?.value !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Fetch businesses
    const { data: businesses, error } = await supabase
      .from('AskMelaBusinesses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // 2. Fetch conversation counts (Aggregate in JS for now to keep it simple)
    const { data: convStats } = await supabase
      .from('AskMelaConversations')
      .select('business_id')

    const convMap: Record<string, number> = {}
    convStats?.forEach(c => {
      convMap[c.business_id] = (convMap[c.business_id] || 0) + 1
    })

    // 3. Fetch document counts
    const { data: docStats } = await supabase
      .from('AskMelaDocuments')
      .select('business_id')

    const docMap: Record<string, number> = {}
    docStats?.forEach(d => {
      docMap[d.business_id] = (docMap[d.business_id] || 0) + 1
    })

    const enriched = businesses.map(b => ({
      ...b,
      total_conversations: convMap[b.id] || 0,
      document_count: docMap[b.id] || 0
    }))

    return NextResponse.json({ businesses: enriched })

  } catch (err) {
    console.error('Admin Businesses API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
