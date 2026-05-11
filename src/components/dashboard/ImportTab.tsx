'use client'

import { useState, useEffect } from 'react'
import styles from './ImportTab.module.css'

interface ImportTabProps {
  businessId: string
  onRefreshDocs: () => void
}

export default function ImportTab({ businessId, onRefreshDocs }: ImportTabProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[] | null>(null)
  const [sheetUrl, setSheetUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [imports, setImports] = useState<any[]>([])
  const [syncStatus, setSyncStatus] = useState<any>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/v1/import/history?businessId=${businessId}`)
      if (res.ok) {
        const data = await res.json()
        setImports(data.imports)
        setSyncStatus(data.sync)
      }
    } catch (err) {
      console.error('Failed to fetch history')
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setUploadStatus(null)
      
      // Parse for preview
      const extension = selectedFile.name.split('.').pop()?.toLowerCase()
      if (extension === 'csv') {
        const Papa = (await import('papaparse')).default
        Papa.parse(selectedFile, {
          header: true,
          preview: 10,
          complete: (results) => setPreviewData(results.data),
        })
      } else if (extension === 'xlsx' || extension === 'xls') {
        const XLSX = await import('xlsx')
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
          setPreviewData(json.slice(0, 10))
        }
        reader.readAsArrayBuffer(selectedFile)
      } else {
        setPreviewData(null) // PDF/Word don't show tabular preview easily
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus('Uploading...')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessId', businessId)

    try {
      const res = await fetch('/api/v1/import/csv', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setUploadStatus('Processing...')
        pollStatus(data.jobId)
      } else {
        setUploadStatus('Failed: ' + data.error)
        setIsUploading(false)
      }
    } catch (err) {
      setUploadStatus('Error occurred during upload')
      setIsUploading(false)
    }
  }

  const handleSheetSync = async () => {
    if (!sheetUrl) return
    setIsUploading(true)
    setUploadStatus('Connecting to Google Sheets...')

    try {
      const res = await fetch('/api/v1/import/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl, businessId }),
      })
      const data = await res.json()

      if (data.success) {
        setUploadStatus('Syncing...')
        pollStatus(data.jobId)
      } else {
        setUploadStatus('Failed: ' + data.error)
        setIsUploading(false)
      }
    } catch (err) {
      setUploadStatus('Error occurred during sync')
      setIsUploading(false)
    }
  }

  const pollStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/import/status/${jobId}`)
        const data = await res.json()

        if (data.status === 'completed') {
          clearInterval(interval)
          setUploadStatus(`Success! Imported ${data.row_count} items.`)
          setIsUploading(false)
          fetchHistory()
          onRefreshDocs()
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setUploadStatus('Failed: ' + data.error)
          setIsUploading(false)
        }
      } catch (err) {
        clearInterval(interval)
        setIsUploading(false)
      }
    }, 2000)
  }

  const deleteImport = async (id: string) => {
    if (!confirm('Are you sure you want to delete this import? All associated data will be removed.')) return
    try {
      const res = await fetch(`/api/v1/import/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchHistory()
        onRefreshDocs()
      }
    } catch (err) {
      alert('Delete failed')
    }
  }

  return (
    <div className={styles.container}>
      {/* Upload Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>📤 Upload Business Data</h3>
        <p className={styles.sectionDesc}>Import your menu, price list, or FAQs from CSV, Excel, PDF, or Word files.</p>
        
        <div className={styles.dropZone}>
          <input type="file" id="file-upload" className={styles.fileInput} onChange={handleFileChange} accept=".csv,.xlsx,.xls,.pdf,.docx,.txt" />
          <label htmlFor="file-upload" className={styles.fileLabel}>
            <div className={styles.uploadIcon}>📄</div>
            <div className={styles.uploadText}>{file ? file.name : 'Drag your file here or click to browse'}</div>
            <div className={styles.formats}>CSV, Excel, PDF, Word, Text (Max 10MB)</div>
          </label>
        </div>

        {file && !isUploading && (
          <div className={styles.previewArea}>
            {previewData && (
              <div className={styles.previewTableWrapper}>
                <div className={styles.previewTitle}>Preview (First 10 rows):</div>
                <table className={styles.previewTable}>
                  <thead>
                    <tr>
                      {Object.keys(previewData[0] || {}).map(key => <th key={key}>{key}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row || {}).map((val: any, j) => <td key={j}>{String(val).substring(0, 50)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button className={styles.primaryBtn} onClick={handleUpload}>Confirm and Import</button>
          </div>
        )}

        {isUploading && (
          <div className={styles.progressArea}>
            <div className={styles.statusText}>{uploadStatus}</div>
            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '50%' }} /></div>
          </div>
        )}
      </section>

      {/* Google Sheets Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>📊 Google Sheets Sync</h3>
        <p className={styles.sectionDesc}>Paste your public Google Sheet URL to sync data automatically every day.</p>
        
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="https://docs.google.com/spreadsheets/d/..." 
            className={styles.textInput}
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
          />
          <button className={styles.secondaryBtn} onClick={handleSheetSync} disabled={isUploading}>
            {syncStatus ? 'Update Sync' : 'Connect Sheet'}
          </button>
        </div>

        {syncStatus && (
          <div className={styles.syncCard}>
            <div className={styles.syncInfo}>
              <div><strong>Status:</strong> <span className="badge-green">Live Sync</span></div>
              <div><strong>Last Synced:</strong> {new Date(syncStatus.last_synced_at).toLocaleString()}</div>
              <div><strong>Next Sync:</strong> Tomorrow at 6:00 AM</div>
              <div><strong>Total Rows:</strong> {syncStatus.rows_count}</div>
            </div>
            <button className={styles.disconnectBtn}>Disconnect</button>
          </div>
        )}
      </section>

      {/* History Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>📜 Import History</h3>
        <div className={styles.historyTable}>
          <div className={styles.tableHeader}>
            <div>Source</div>
            <div>Type</div>
            <div>Rows</div>
            <div>Date</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          {imports.length === 0 ? (
            <div className={styles.emptyTable}>No imports yet.</div>
          ) : (
            imports.map(imp => (
              <div key={imp.id} className={styles.tableRow}>
                <div className={styles.fileName}>{imp.file_name || 'Google Sheet'}</div>
                <div><span className={styles.typeBadge}>{imp.type.toUpperCase()}</span></div>
                <div>{imp.row_count}</div>
                <div>{new Date(imp.created_at).toLocaleDateString()}</div>
                <div><span className={imp.status === 'completed' ? 'badge-green' : 'badge-red'}>{imp.status}</span></div>
                <div><button className={styles.deleteBtn} onClick={() => deleteImport(imp.id)}>🗑️</button></div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
