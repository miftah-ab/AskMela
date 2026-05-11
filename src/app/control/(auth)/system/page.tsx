import React from 'react'
import styles from './page.module.css'
import { supabase } from '@/bot/services/supabase'

async function getSystemInfo() {
  // 1. Fetch table counts
  const { count: bizCount } = await supabase.from('AskMelaBusinesses').select('*', { count: 'exact', head: true })
  const { count: docCount } = await supabase.from('AskMelaDocuments').select('*', { count: 'exact', head: true })
  const { count: convCount } = await supabase.from('AskMelaConversations').select('*', { count: 'exact', head: true })
  
  // 2. Fetch error logs
  const { data: errors } = await supabase
    .from('AskMelaErrorLogs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return { bizCount, docCount, convCount, errors }
}

export default async function SystemAdminPage() {
  const data = await getSystemInfo()

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Groq Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Groq API Usage</h3>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>1,245</div>
              <div className={styles.statLabel}>LLM Calls (Today)</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>324</div>
              <div className={styles.statLabel}>Whisper (Today)</div>
            </div>
          </div>
          <div className={styles.costBox}>
            Est. Cost Today: <span style={{ color: '#00FF88' }}>$0.42</span>
          </div>
        </div>

        {/* Supabase Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Supabase Database</h3>
          <div className={styles.dbUsage}>
             <div className={styles.dbHeader}>
                <span>Storage Used</span>
                <span>42MB / 500MB</span>
             </div>
             <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '8.4%' }}></div>
             </div>
          </div>
          <div className={styles.tableStats}>
             <div className={styles.tableStat}><span>Businesses:</span> <span>{data.bizCount}</span></div>
             <div className={styles.tableStat}><span>Documents:</span> <span>{data.docCount}</span></div>
             <div className={styles.tableStat}><span>Conversations:</span> <span>{data.convCount}</span></div>
          </div>
        </div>

        {/* Bot Health Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Bot Health</h3>
          <div className={styles.healthInfo}>
            <div className={styles.healthLine}>
              <span>Status:</span>
              <span className={styles.onlineBadge}>ONLINE</span>
            </div>
            <div className={styles.healthLine}>
              <span>Webhook:</span>
              <span className={styles.linkText}>askmela.xyz/api/bot</span>
            </div>
            <div className={styles.healthLine}>
              <span>Last Delivery:</span>
              <span style={{ color: '#00FF88' }}>Success (2s ago)</span>
            </div>
          </div>
        </div>

        {/* Error Logs */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
           <div className={styles.cardHeader}>
             <h3 className={styles.cardTitle}>Recent Error Logs</h3>
             <button className={styles.clearBtn}>Clear All Logs</button>
           </div>
           <div className={styles.errorList}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.errors?.map(err => (
                    <tr key={err.id}>
                      <td className={styles.timeCell}>{new Date(err.created_at).toLocaleString()}</td>
                      <td><span className={styles.errorType}>{err.error_type}</span></td>
                      <td className={styles.errMsg}>{err.error_message}</td>
                      <td><button className={styles.viewBtn}>View Trace</button></td>
                    </tr>
                  ))}
                  {data.errors?.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#888880' }}>No errors recorded recently.</td></tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  )
}
