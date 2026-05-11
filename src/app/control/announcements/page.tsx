'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import styles from './page.module.css'

export default function AdminAnnouncements() {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sentCount, setSentCount] = useState(128) // Example active business count

  const handleSend = async () => {
    if (!message.trim()) return
    const confirmed = confirm(`Are you sure you want to send this message to all ${sentCount} active business owners?`)
    if (!confirmed) return

    setSending(true)
    try {
      // API call placeholder
      await new Promise(r => setTimeout(r, 1500))
      alert('Announcement sent successfully!')
      setMessage('')
    } catch (err) {
      alert('Failed to send announcement.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.adminPage}>
      <AdminSidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Announcements</h1>
            <p className="text-caption">Send updates to all active business owners</p>
          </div>
        </header>

        <div className={styles.grid}>
          <div className="card">
            <h2 className="text-section-title" style={{ marginBottom: 20 }}>New Announcement</h2>
            <div className={styles.field}>
              <label className="input-label">Message (Amharic + English recommended)</label>
              <textarea 
                className="input" 
                rows={8} 
                placeholder="Write your announcement here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>
            <div className={styles.actions}>
              <button 
                className="btn-primary" 
                onClick={handleSend} 
                disabled={sending || !message.trim()}
              >
                {sending ? '🚀 Sending...' : `Send to ${sentCount} Active Owners`}
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-section-title" style={{ marginBottom: 20 }}>Telegram Preview</h2>
            <div className={styles.preview}>
              <div className={styles.previewHeader}>
                <div className={styles.previewAvatar}>A</div>
                <div className={styles.previewName}>AskMela Bot</div>
              </div>
              <div className={styles.previewBubble}>
                {message || <span style={{ color: 'var(--text-tertiary)' }}>Your message will appear here...</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 40 }}>
          <h2 className="text-section-title" style={{ marginBottom: 20 }}>Announcement History</h2>
          <div className={styles.history}>
            <div className={styles.historyItem}>
              <div className={styles.historyText}>System maintenance scheduled for tonight at 2 AM.</div>
              <div className={styles.historyMeta}>
                <span>Sent to 124 owners</span>
                <span>•</span>
                <span>May 5, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
