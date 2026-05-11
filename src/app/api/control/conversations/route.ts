import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('admin_session')
  if (sessionCookie?.value !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: conversations, error } = await supabase
      .from('AskMelaConversations')
      .select('*, business:AskMelaBusinesses(name)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ conversations })

  } catch (err) {
    console.error('Admin Conversations API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
