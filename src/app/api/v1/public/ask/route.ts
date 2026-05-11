import { NextResponse } from 'next/server'
import { supabase } from '@/bot/services/supabase'
import { ragSearch } from '@/bot/services/rag'
import { detectLanguage } from '@/bot/utils/language'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { businessId, question } = await req.json()

    if (!businessId || !question) {
      return NextResponse.json({ error: 'Missing businessId or question' }, { status: 400 })
    }

    const { data: business } = await supabase
      .from('AskMelaBusinesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (!business || !business.is_active) {
      return NextResponse.json({ error: 'Business not found or inactive' }, { status: 404 })
    }

    const language = detectLanguage(question)
    
    const answer = await ragSearch({
      question,
      businessId: business.id,
      businessName: business.name,
      businessDescription: business.description,
      language
    })

    return NextResponse.json({ answer: answer || "I'm sorry, I don't have information about that yet." })
  } catch (err) {
    console.error('Public ask error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
