import { NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-auth'
import { supabase } from '@/bot/services/supabase'
import { ragSearch } from '@/bot/services/rag'
import { detectLanguage } from '@/bot/utils/language'

export async function POST(req: Request) {
  const auth = await validateApiKey(req.headers.get('Authorization'))
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { businessId } = auth
  const { question } = await req.json()

  if (!question) {
    return NextResponse.json({ error: 'Missing question' }, { status: 400 })
  }

  const { data: business } = await supabase
    .from('AskMelaBusinesses')
    .select('*')
    .eq('id', businessId)
    .single()

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  const language = detectLanguage(question)
  const answer = await ragSearch({
    question,
    businessId,
    businessName: business.name,
    businessDescription: business.description,
    language
  })

  return NextResponse.json({ 
    answer: answer || "I don't have an answer for that based on the knowledge base.",
    business_id: businessId 
  })
}
