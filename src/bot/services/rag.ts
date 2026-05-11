import { generateEmbedding, generateAnswer } from './groq'
import { searchDocuments, insertDocument } from './supabase'

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
  const matches = await searchDocuments(queryEmbedding, businessId, 0.7, 5)

  // 3. Build context string
  const context = matches.map((m) => m.content).join('\n\n---\n\n')

  // 4. Generate answer with LLM
  const answer = await generateAnswer({
    businessName,
    businessDescription,
    context,
    question,
    language,
  })

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
