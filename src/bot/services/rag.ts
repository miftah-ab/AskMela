import { generateEmbedding, generateAnswer } from './groq'
import { searchDocuments, insertDocument, supabase } from './supabase'

// ─── RAG Search ───────────────────────────────────────────────────────────────

/**
 * Search the knowledge base for relevant documents and generate an answer.
 * Returns null if no relevant context found.
 */
export async function ragSearch(params: {
  question: string
  businessId: string
  businessName: string
  businessDescription: string
  language: 'amharic' | 'english'
}): Promise<string | null> {
  const { question, businessId, businessName, businessDescription, language } = params

  // 1. Embed the question
  const queryEmbedding = await generateEmbedding(question)

  // 2. Search vector store
  let matches = await searchDocuments(queryEmbedding, businessId, 0.4, 10) // Lowered threshold slightly
  
  // 3. Keyword Search Fallback (Crucial since embeddings are currently hashing placeholders)
  if (matches.length < 3) {
    const { data: keywordMatches } = await supabase
      .from('AskMelaDocuments')
      .select('id, content')
      .eq('business_id', businessId)
      .ilike('content', `%${question.split(' ')[0]}%`) // Search first word
      .limit(5)

    if (keywordMatches && keywordMatches.length > 0) {
      console.log(`🔍 Keyword Search found ${keywordMatches.length} extra chunks.`)
      // Merge unique results
      const existingIds = new Set(matches.map(m => m.id))
      keywordMatches.forEach((m: any) => {
        if (!existingIds.has(m.id)) {
          matches.push({ ...m, similarity: 0.9 }) // High similarity for exact keyword match
        }
      })
    }
  }

  console.log(`🔍 RAG Search for "${question}" (${businessId}):`)
  console.log(`   - Total chunks found: ${matches.length}`)

  // 3. Build context string
  const context = matches.map((m) => m.content).join('\n\n---\n\n')
  
  if (context) {
    console.log(`📝 Context passed to AI (${context.length} chars)`)
  }

  // 4. Generate answer with LLM
  const answer = await generateAnswer({
    businessName,
    businessDescription,
    context,
    question,
    language,
  })

  if (answer) {
    console.log('✅ AI Answer generated successfully.')
  } else {
    console.log('❌ AI could not find an answer in the provided context.')
  }

  return answer
}

// ─── Add to Knowledge Base ────────────────────────────────────────────────────

/**
 * Embed and store a piece of text in the knowledge base.
 */
export async function addToKnowledgeBase(params: {
  businessId: string
  content: string
  sourceType: 'text' | 'voice' | 'photo'
  telegramFileId?: string
}) {
  const embedding = await generateEmbedding(params.content)
  return insertDocument({
    businessId: params.businessId,
    content: params.content,
    embedding,
    sourceType: params.sourceType,
    telegramFileId: params.telegramFileId,
  })
}
