import { NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/api-auth'
import { addToKnowledgeBase } from '@/bot/services/rag'

export async function POST(req: Request) {
  const auth = await validateApiKey(req.headers.get('Authorization'))
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { businessId } = auth
  const { content } = await req.json()

  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 })
  }

  try {
    await addToKnowledgeBase({
      businessId,
      content,
      sourceType: 'text'
    })
    return NextResponse.json({ success: true, message: 'Document added to knowledge base' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add document' }, { status: 500 })
  }
}
