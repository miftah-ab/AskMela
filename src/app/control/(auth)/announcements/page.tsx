import React from 'react'
import styles from './page.module.css'
import { supabase } from '@/bot/services/supabase'

async function getAnnouncementHistory() {
  const { data } = await supabase
    .from('AskMelaAnnouncements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
  
  return data || []
}

async function getTargetCount() {
  const { count } = await supabase
    .from('AskMelaBusinesses')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
  
  return count || 0
}

export default async function AnnouncementsAdminPage() {
  const history = await getAnnouncementHistory()
  const targetCount = await getTargetCount()

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Compose Section */}
        <div className={styles.composeCard}>
          <h3 className={styles.cardTitle}>New Global Announcement</h3>
          <p className={styles.subtitle}>This message will be sent to <strong>{targetCount}</strong> active business owners via Telegram.</p>
          
          <textarea 
            className={styles.textarea} 
            placeholder="Write your message here (Markdown supported)..."
            rows={8}
          ></textarea>
          
          <div className={styles.previewArea}>
            <div className={styles.previewLabel}>Telegram Preview</div>
            <div className={styles.previewBubble}>
               Your message will look like this in Telegram. Use bold and italic for emphasis.
            </div>
          </div>

          <button className={styles.broadcastBtn}>🚀 Send Broadcast to {targetCount} Owners</button>
        </div>

        {/* History Section */}
        <div className={styles.historyCard}>
          <h3 className={styles.cardTitle}>Broadcast History</h3>
          <div className={styles.historyList}>
             {history.map(item => (
               <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyHead}>
                     <span className={styles.sentCount}>Sent to {item.sent_to_count}</span>
                     <span className={styles.historyTime}>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.historyMsg}>{item.message}</div>
               </div>
             ))}
             {history.length === 0 && (
               <div className={styles.emptyState}>No announcements sent yet.</div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
