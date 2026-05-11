import React from 'react'
import styles from './page.module.css'
import { supabase } from '@/bot/services/supabase'
import { notFound } from 'next/navigation'

async function getBusinessDetail(id: string) {
  const { data: business } = await supabase
    .from('AskMelaBusinesses')
    .select('*')
    .eq('id', id)
    .single()

  if (!business) return null

  const { data: stats } = await supabase
    .from('AskMelaStats')
    .select('*')
    .eq('business_id', id)
    .order('date', { ascending: false })

  const { data: docs } = await supabase
    .from('AskMelaDocuments')
    .select('*')
    .eq('business_id', id)
    .order('created_at', { ascending: false })

  const { data: conversations } = await supabase
    .from('AskMelaConversations')
    .select('*')
    .eq('business_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  return { business, stats, docs, conversations }
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getBusinessDetail(id)
  if (!data) notFound()

  const { business, stats, docs, conversations } = data
  const totalQuestions = stats?.reduce((acc, s) => acc + (s.total_questions || 0), 0) || 0
  const answeredCount = stats?.reduce((acc, s) => acc + (s.answered_questions || 0), 0) || 0
  const answerRate = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.infoCard}>
          <div className={styles.infoHead}>
             <h1 className={styles.bizName}>{business.name}</h1>
             <span className={business.is_active ? styles.statusActive : styles.statusInactive}>
               {business.is_active ? 'Active' : 'Inactive'}
             </span>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Phone</label>
              <div>{business.owner_phone}</div>
            </div>
            <div className={styles.infoItem}>
              <label>Telegram ID</label>
              <div>{business.owner_telegram_id}</div>
            </div>
            <div className={styles.infoItem}>
              <label>Unique Link</label>
              <div className={styles.linkText}>{business.unique_link}</div>
            </div>
          </div>
          <div className={styles.infoActions}>
            <button className={styles.dangerBtn}>Delete Business</button>
            <button className={styles.secondaryBtn}>Deactivate</button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{totalQuestions}</div>
            <div className={styles.statLabel}>Total Questions</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{answerRate}%</div>
            <div className={styles.statLabel}>Answer Rate</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{docs?.length || 0}</div>
            <div className={styles.statLabel}>KB Documents</div>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Knowledge Base</h2>
        <div className={styles.kbTableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Content</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs?.map(doc => (
                <tr key={doc.id}>
                  <td><span className={styles.typeBadge}>{doc.source_type}</span></td>
                  <td className={styles.contentCell}>{doc.content.substring(0, 100)}...</td>
                  <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                  <td><button className={styles.smallDangerBtn}>Revoke</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Conversations</h2>
        <div className={styles.convList}>
          {conversations?.map(conv => (
            <div key={conv.id} className={styles.convCard}>
               <div className={styles.convHead}>
                 <span className={conv.was_answered ? styles.ansYes : styles.ansNo}>
                   {conv.was_answered ? 'Answered' : 'Unanswered'}
                 </span>
                 <span className={styles.convTime}>{new Date(conv.created_at).toLocaleString()}</span>
               </div>
               <div className={styles.convQ}>Q: {conv.question}</div>
               {conv.answer && <div className={styles.convA}>A: {conv.answer}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
