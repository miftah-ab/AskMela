import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side Supabase client with service role (bot only)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})

// ─── Businesses ───────────────────────────────────────────────────────────────

export async function getBusinessByOwnerId(ownerTelegramId: number) {
  const { data, error } = await supabase
    .from('AskMelaBusinesses')
    .select('*')
    .eq('owner_telegram_id', ownerTelegramId)
    .single()
  if (error) return null
  return data
}

export async function getBusinessByUniqueLink(uniqueLink: string) {
  const { data, error } = await supabase
    .from('AskMelaBusinesses')
    .select('*')
    .eq('unique_link', uniqueLink)
    .single()
  if (error) return null
  return data
}

export async function createBusiness(params: {
  name: string
  description: string
  ownerTelegramId: number
  ownerUsername?: string
  ownerPhone: string
  uniqueLink: string
  language: string
}) {
  const { data, error } = await supabase
    .from('AskMelaBusinesses')
    .insert({
      name: params.name,
      description: params.description,
      owner_telegram_id: params.ownerTelegramId,
      owner_username: params.ownerUsername,
      owner_phone: params.ownerPhone,
      unique_link: params.uniqueLink,
      language: params.language,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateBusiness(
  businessId: string,
  updates: Partial<{
    name: string
    description: string
    language: string
    is_active: boolean
  }>
) {
  const { data, error } = await supabase
    .from('AskMelaBusinesses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', businessId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Documents (Knowledge Base) ───────────────────────────────────────────────

export async function insertDocument(params: {
  businessId: string
  content: string
  embedding: number[]
  sourceType: 'text' | 'voice' | 'photo'
  telegramFileId?: string
  metadata?: Record<string, unknown>
}) {
  const { data, error } = await supabase
    .from('AskMelaDocuments')
    .insert({
      business_id: params.businessId,
      content: params.content,
      embedding: params.embedding,
      source_type: params.sourceType,
      telegram_file_id: params.telegramFileId,
      metadata: params.metadata ?? {},
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function searchDocuments(
  queryEmbedding: number[],
  businessId: string,
  threshold = 0.7,
  count = 5
): Promise<Array<{ id: string; content: string; similarity: number }>> {
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    business_id_filter: businessId,
    match_threshold: threshold,
    match_count: count,
  })
  if (error) return []
  return data ?? []
}

export async function getDocumentsByBusiness(businessId: string) {
  const { data } = await supabase
    .from('AskMelaDocuments')
    .select('id, content, source_type, created_at')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function deleteDocument(documentId: string) {
  const { error } = await supabase.from('AskMelaDocuments').delete().eq('id', documentId)
  if (error) throw error
}

// ─── Conversations ────────────────────────────────────────────────────────────

export async function saveConversation(params: {
  businessId: string
  customerTelegramId: number
  customerUsername?: string
  question: string
  answer?: string
  wasAnswered: boolean
  sourceType: 'text' | 'voice'
  languageDetected: string
}) {
  const { data, error } = await supabase
    .from('AskMelaConversations')
    .insert({
      business_id: params.businessId,
      customer_telegram_id: params.customerTelegramId,
      customer_username: params.customerUsername,
      question: params.question,
      answer: params.answer,
      was_answered: params.wasAnswered,
      source_type: params.sourceType,
      language_detected: params.languageDetected,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getRecentConversations(businessId: string, limit = 20) {
  const { data } = await supabase
    .from('AskMelaConversations')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function createNotification(params: {
  businessId: string
  type: 'unanswered_question' | 'new_customer' | 'system'
  message: string
  conversationId?: string
}) {
  const { error } = await supabase.from('AskMelaNotifications').insert({
    business_id: params.businessId,
    type: params.type,
    message: params.message,
    conversation_id: params.conversationId,
  })
  if (error) console.error('Failed to save notification:', error)
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function upsertStats(
  businessId: string,
  updates: {
    total_questions?: number
    answered_questions?: number
    unanswered_questions?: number
    unique_customers?: number
  }
) {
  const today = new Date().toISOString().split('T')[0]
  // Get current stats
  const { data: existing } = await supabase
    .from('AskMelaStats')
    .select('*')
    .eq('business_id', businessId)
    .eq('date', today)
    .single()

  if (existing) {
    await supabase
      .from('AskMelaStats')
      .update({
        total_questions: (existing.total_questions ?? 0) + (updates.total_questions ?? 0),
        answered_questions: (existing.answered_questions ?? 0) + (updates.answered_questions ?? 0),
        unanswered_questions:
          (existing.unanswered_questions ?? 0) + (updates.unanswered_questions ?? 0),
        unique_customers: updates.unique_customers ?? existing.unique_customers,
      })
      .eq('id', existing.id)
  } else {
    await supabase.from('AskMelaStats').insert({
      business_id: businessId,
      date: today,
      ...updates,
    })
  }
}

export async function getTodayStats(businessId: string) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('AskMelaStats')
    .select('*')
    .eq('business_id', businessId)
    .eq('date', today)
    .single()
  return (
    data ?? {
      total_questions: 0,
      answered_questions: 0,
      unanswered_questions: 0,
      unique_customers: 0,
    }
  )
}
