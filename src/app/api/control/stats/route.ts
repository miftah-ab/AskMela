import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'

export async function GET(req: NextRequest) {
  // 1. Security Check
  const sessionCookie = req.cookies.get('admin_session')
  if (sessionCookie?.value !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 2. Fetch Aggregated Stats
    const { count: totalBusinesses } = await supabase
      .from('AskMelaBusinesses')
      .select('*', { count: 'exact', head: true })

    const { count: totalConversations } = await supabase
      .from('AskMelaConversations')
      .select('*', { count: 'exact', head: true })

    const today = new Date().toISOString().split('T')[0]
    const { count: conversationsToday } = await supabase
      .from('AskMelaConversations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)

    // Recent Activity
    const { data: recentBusinesses } = await supabase
      .from('AskMelaBusinesses')
      .select('name, owner_username, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: unansweredQuestions } = await supabase
      .from('AskMelaConversations')
      .select('question, business_id, created_at')
      .eq('was_answered', false)
      .order('created_at', { ascending: false })
      .limit(5)

    // Mock weekly history for the chart (In production, you'd aggregate this from AskMelaStats)
    const weeklyHistory = [
      { name: 'Mon', questions: 45, answered: 38 },
      { name: 'Tue', questions: 52, answered: 42 },
      { name: 'Wed', questions: 48, answered: 44 },
      { name: 'Thu', questions: 61, answered: 50 },
      { name: 'Fri', questions: 55, answered: 48 },
      { name: 'Sat', questions: 67, answered: 52 },
      { name: 'Sun', questions: 42, answered: 36 },
    ]

    return NextResponse.json({
      totalBusinesses,
      totalConversations,
      conversationsToday,
      weeklyHistory,
      recentBusinesses: recentBusinesses?.map(b => ({
        name: b.name,
        sub: b.owner_username || 'No username',
        time: new Date(b.created_at).toLocaleTimeString()
      })),
      unansweredQuestions: unansweredQuestions?.map(q => ({
        name: q.question.substring(0, 40) + '...',
        sub: `Biz ID: ${q.business_id.substring(0, 8)}`,
        time: new Date(q.created_at).toLocaleTimeString()
      }))
    })

  } catch (err) {
    console.error('Admin API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
