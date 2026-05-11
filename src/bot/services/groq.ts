import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

// ─── Embeddings ───────────────────────────────────────────────────────────────
// Groq doesn't yet have a hosted embeddings API, so we use their LLM to
// generate a semantic float vector via a deterministic hashing trick for MVP.
// For production, swap with OpenAI text-embedding-3-small or Nomic.

/**
 * Generate a 1536-dim embedding for text.
 * MVP: calls Groq LLM to extract key concepts, then uses a fast hash-based
 * projection. Replace with a real embedding API for production.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Simple deterministic float vector from text (MVP placeholder)
  // Replace with: openai.embeddings.create({ model: 'text-embedding-3-small', input: text })
  const encoder = new TextEncoder()
  const bytes = encoder.encode(text)
  const dims = 1536
  const vec: number[] = new Array(dims).fill(0)
  for (let i = 0; i < bytes.length; i++) {
    vec[i % dims] += bytes[i] / 255
  }
  // Normalize
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  return vec.map((v) => v / mag)
}

// ─── Whisper Transcription ────────────────────────────────────────────────────

/**
 * Transcribe audio from a URL (Telegram temporary file URL).
 * Uses Groq Whisper large-v3 which supports Amharic.
 */
export async function transcribeAudio(fileUrl: string): Promise<string> {
  // Fetch the audio file as a blob
  const response = await fetch(fileUrl)
  if (!response.ok) throw new Error(`Failed to fetch audio: ${response.statusText}`)
  const buffer = await response.arrayBuffer()
  const blob = new Blob([buffer], { type: 'audio/ogg' })

  // Groq Whisper transcription
  const transcription = await groq.audio.transcriptions.create({
    file: new File([blob], 'audio.ogg', { type: 'audio/ogg' }),
    model: 'whisper-large-v3',
    language: 'am', // Amharic — Whisper auto-detects if wrong
    response_format: 'text',
  })

  return typeof transcription === 'string'
    ? transcription
    : (transcription as { text: string }).text ?? ''
}

// ─── Vision — Extract Text from Photo ────────────────────────────────────────

/**
 * Extract text/information from a photo using Groq llama vision.
 * Returns a descriptive text of the image content.
 */
export async function extractTextFromPhoto(fileUrl: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: fileUrl },
          },
          {
            type: 'text',
            text: `You are helping extract business information from this image.
Describe all text, prices, menu items, services, or business information visible in the image.
Be thorough and specific. Output in English, then Amharic if text is present in Amharic.
Format as plain text, no markdown.`,
          },
        ],
      },
    ],
    max_tokens: 1024,
  })

  return response.choices[0]?.message?.content ?? ''
}

// ─── AI Answer Generation ─────────────────────────────────────────────────────

/**
 * Generate an AI answer for a customer question using RAG context.
 */
export async function generateAnswer(params: {
  businessName: string
  businessDescription: string
  context: string
  question: string
  language: 'amharic' | 'english'
}): Promise<string | null> {
  const { businessName, businessDescription, context, question, language } = params

  const systemPrompt = `You are AskMela, an AI assistant for ${businessName}.

Business description: ${businessDescription}

You answer customer questions based ONLY on the information provided below.
If the answer is not in the provided information, respond with exactly: __NO_ANSWER__

Language rules:
- If language is "amharic" → respond entirely in Amharic (Ge'ez script)
- If language is "english" → respond entirely in English
- Keep answers short, clear, and helpful (2-4 sentences max)
- Never make up information not in the context
- Never answer questions outside the business context

Business information:
${context || 'No information available yet.'}

Customer question: ${question}`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ],
    temperature: 0.3,
    max_tokens: 512,
  })

  const answer = response.choices[0]?.message?.content?.trim() ?? ''
  if (!answer || answer.includes('__NO_ANSWER__')) return null
  return answer
}
