import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

/**
 * GET /api/dashboard
 * Fetches all data for the owner's dashboard.
 */
export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get('askmela_user')

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = JSON.parse(session.value)
    const telegramId = user.id

    // 1. Get business
    const { data: business, error: bizError } = await supabase
      .from('AskMelaBusinesses')
      .select('*')
      .eq('owner_telegram_id', telegramId)
      .single()

    if (bizError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // 2. Get stats (today)
    const today = new Date().toISOString().split('T')[0]
    const { data: stats } = await supabase
      .from('AskMelaStats')
      .select('*')
      .eq('business_id', business.id)
      .eq('date', today)
      .single()

    // 3. Get recent conversations
    const { data: conversations } = await supabase
      .from('AskMelaConversations')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(50)

    // 4. Get knowledge base docs
    const { data: docs } = await supabase
      .from('AskMelaDocuments')
      .select('id, content, source_type, created_at')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      business,
      stats: stats ?? { total_questions: 0, answered_questions: 0, unanswered_questions: 0, unique_customers: 0 },
      conversations: conversations ?? [],
      docs: docs ?? []
    })
  } catch (err) {
    console.error('Dashboard data error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
