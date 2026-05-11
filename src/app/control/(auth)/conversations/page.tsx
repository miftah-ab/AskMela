import React from 'react'
import styles from './page.module.css'
import { supabase } from '@/bot/services/supabase'

async function getGlobalConversations() {
  const { data, error } = await supabase
    .from('AskMelaConversations')
    .select(`
      *,
      business:AskMelaBusinesses(name)
    `)
    .order('created_at', { ascending: false })
    .limit(100)
  
  return data || []
}

export default async function GlobalConversationsPage() {
  const conversations = await getGlobalConversations()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <select className={styles.select}>
            <option>All Businesses</option>
          </select>
          <select className={styles.select}>
            <option>All Status</option>
            <option>Answered</option>
            <option>Unanswered</option>
          </select>
        </div>
        <button className={styles.exportBtn}>📥 Export CSV</button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Business</th>
              <th>Customer</th>
              <th>Question</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conv: any) => (
              <tr key={conv.id}>
                <td>
                  <span className={styles.bizPill}>{(conv.business as any)?.name}</span>
                </td>
                <td>@{conv.customer_username || 'unknown'}</td>
                <td className={styles.qCell}>{conv.question}</td>
                <td>
                  <span className={conv.was_answered ? styles.statusYes : styles.statusNo}>
                    {conv.was_answered ? 'YES' : 'NO'}
                  </span>
                </td>
                <td className={styles.timeCell}>{new Date(conv.created_at).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
