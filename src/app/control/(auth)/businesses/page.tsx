import React from 'react'
import styles from './page.module.css'
import { supabase } from '@/bot/services/supabase'
import Link from 'next/link'

async function getBusinesses() {
  const { data, error } = await supabase
    .from('AskMelaBusinesses')
    .select(`
      *,
      stats:AskMelaStats(total_questions, answered_questions),
      docs:AskMelaDocuments(count)
    `)
    .order('created_at', { ascending: false })
  
  return data || []
}

export default async function BusinessesAdminPage() {
  const businesses = await getBusinesses()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Search businesses by name, phone, or ID..." className={styles.searchInput} />
        </div>
        <div className={styles.actions}>
          <button className={styles.exportBtn}>📥 Export CSV</button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Owner Phone</th>
              <th>Registered</th>
              <th>Conversations</th>
              <th>KB Items</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((biz: any) => {
              const totalQuestions = biz.stats?.reduce((acc: number, s: any) => acc + (s.total_questions || 0), 0) || 0
              return (
                <tr key={biz.id}>
                  <td>
                    <Link href={`/control/businesses/${biz.id}`} className={styles.bizLink}>
                      {biz.name}
                    </Link>
                    <div className={styles.bizId}>{biz.id}</div>
                  </td>
                  <td>{biz.owner_phone}</td>
                  <td>{new Date(biz.created_at).toLocaleDateString()}</td>
                  <td>{totalQuestions}</td>
                  <td>{biz.docs?.[0]?.count || 0}</td>
                  <td>
                    <span className={biz.is_active ? styles.statusActive : styles.statusInactive}>
                      {biz.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className={styles.actionBtn}>•••</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
