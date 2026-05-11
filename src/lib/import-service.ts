// @ts-ignore
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
const pdf = require('pdf-parse')
const mammoth = require('mammoth')
import { supabase } from '../bot/services/supabase'
import { generateEmbedding } from '../bot/services/groq'

export interface ImportResult {
  success: boolean
  count: number
  error?: string
}

export interface ProgressCallback {
  (current: number, total: number): void
}

/**
 * Service to handle data imports from various sources.
 */
export class ImportService {
  /**
   * Process a CSV file and store rows as documents.
   */
  static async processCSV(
    fileBuffer: Buffer,
    businessId: string,
    importId: string,
    onProgress?: ProgressCallback
  ): Promise<ImportResult> {
    const csvString = fileBuffer.toString('utf-8')
    const { data, errors } = Papa.parse(csvString, { header: true, skipEmptyLines: true })

    if (errors.length > 0 && data.length === 0) {
      return { success: false, count: 0, error: errors[0].message }
    }

    const rows = data as Record<string, string>[]
    return this.embedAndStoreRows(rows, businessId, importId, onProgress)
  }

  /**
   * Process an Excel file and store rows as documents.
   */
  static async processExcel(
    fileBuffer: Buffer,
    businessId: string,
    importId: string,
    sheetName?: string,
    onProgress?: ProgressCallback
  ): Promise<ImportResult> {
    const workbook = XLSX.read(fileBuffer)
    const targetSheet = sheetName || workbook.SheetNames[0]
    const worksheet = workbook.Sheets[targetSheet]
    const rows = XLSX.utils.sheet_to_json(worksheet) as Record<string, string>[]

    return this.embedAndStoreRows(rows, businessId, importId, onProgress)
  }

  /**
   * Process a PDF file and store chunks as documents.
   */
  static async processPDF(
    fileBuffer: Buffer,
    businessId: string,
    importId: string,
    onProgress?: ProgressCallback
  ): Promise<ImportResult> {
    try {
      const data = await pdf(fileBuffer)
      const text = data.text
      const chunks = this.chunkText(text)
      return this.embedAndStoreChunks(chunks, businessId, importId, onProgress)
    } catch (error: any) {
      return { success: false, count: 0, error: error.message }
    }
  }

  /**
   * Process a Word document and store paragraphs as documents.
   */
  static async processWord(
    fileBuffer: Buffer,
    businessId: string,
    importId: string,
    onProgress?: ProgressCallback
  ): Promise<ImportResult> {
    try {
      const result = await mammoth.extractRawText({ buffer: fileBuffer })
      const text = result.value
      const chunks = this.chunkText(text)
      return this.embedAndStoreChunks(chunks, businessId, importId, onProgress)
    } catch (error: any) {
      return { success: false, count: 0, error: error.message }
    }
  }

  /**
   * Process a plain text file.
   */
  static async processText(
    fileBuffer: Buffer,
    businessId: string,
    importId: string,
    onProgress?: ProgressCallback
  ): Promise<ImportResult> {
    const text = fileBuffer.toString('utf-8')
    const chunks = this.chunkText(text)
    return this.embedAndStoreChunks(chunks, businessId, importId, onProgress)
  }

  /**
   * Process a Google Sheet via its public JSON export.
   */
  static async processGoogleSheets(
    sheetUrl: string,
    businessId: string,
    importId: string,
    onProgress?: ProgressCallback
  ): Promise<ImportResult> {
    try {
      // Extract sheet ID from URL
      const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)
      if (!match) throw new Error('Invalid Google Sheet URL')
      const sheetId = match[1]

      const jsonUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`
      const response = await fetch(jsonUrl)
      const text = await response.text()
      
      // The response starts with some garbage: google.visualization.Query.setResponse({...});
      const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)
      const json = JSON.parse(jsonStr)

      const cols = json.table.cols.map((c: any) => c.label || 'column')
      const rows = json.table.rows.map((r: any) => {
        const rowData: Record<string, string> = {}
        r.c.forEach((cell: any, i: number) => {
          if (cell && cell.v !== null) {
            rowData[cols[i] || `col_${i}`] = String(cell.v)
          }
        })
        return rowData
      })

      return this.embedAndStoreRows(rows, businessId, importId, onProgress, sheetUrl)
    } catch (error: any) {
      return { success: false, count: 0, error: error.message }
    }
  }

  /**
   * Helper to convert rows to natural language and store them.
   */
  private static async embedAndStoreRows(
    rows: Record<string, any>[],
    businessId: string,
    importId: string,
    onProgress?: ProgressCallback,
    sourceUrl?: string
  ): Promise<ImportResult> {
    let successCount = 0
    const total = rows.length

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      // Convert row to natural language
      const content = Object.entries(row)
        .filter(([_, v]) => v !== null && v !== undefined && v !== '')
        .map(([k, v]) => `${k}: ${v}`)
        .join('. ') + '.'

      try {
        const embedding = await generateEmbedding(content)
        await supabase.from('AskMelaDocuments').insert({
          business_id: businessId,
          content,
          embedding,
          source_type: 'text',
          import_id: importId,
          source_url: sourceUrl,
          source_row: i + 1,
          metadata: row
        })
        successCount++
        if (onProgress) onProgress(i + 1, total)
      } catch (err) {
        console.error(`Failed to import row ${i + 1}:`, err)
      }
    }

    return { success: successCount > 0, count: successCount }
  }

  /**
   * Helper to embed and store text chunks.
   */
  private static async embedAndStoreChunks(
    chunks: string[],
    businessId: string,
    importId: string,
    onProgress?: ProgressCallback
  ): Promise<ImportResult> {
    let successCount = 0
    const total = chunks.length

    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i]
      try {
        const embedding = await generateEmbedding(content)
        await supabase.from('AskMelaDocuments').insert({
          business_id: businessId,
          content,
          embedding,
          source_type: 'text',
          import_id: importId,
          source_row: i + 1
        })
        successCount++
        if (onProgress) onProgress(i + 1, total)
      } catch (err) {
        console.error(`Failed to import chunk ${i + 1}:`, err)
      }
    }

    return { success: successCount > 0, count: successCount }
  }

  /**
   * Split text into chunks for embedding.
   * Max 500 chars, min 100 chars, 50 chars overlap.
   */
  private static chunkText(text: string): string[] {
    const maxChars = 500
    const minChars = 100
    const overlap = 50
    const chunks: string[] = []
    
    // Split by paragraphs first
    const paragraphs = text.split(/\n\s*\n/)
    
    for (let p of paragraphs) {
      p = p.trim()
      if (!p) continue

      if (p.length <= maxChars) {
        if (p.length >= minChars) {
          chunks.push(p)
        }
        continue
      }

      // If paragraph is too long, split it further
      let start = 0
      while (start < p.length) {
        let end = start + maxChars
        if (end > p.length) end = p.length
        
        const chunk = p.substring(start, end).trim()
        if (chunk.length >= minChars) {
          chunks.push(chunk)
        }
        
        start += (maxChars - overlap)
      }
    }

    return chunks
  }
}
