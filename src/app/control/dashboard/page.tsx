'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import styles from './page.module.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalConversations: 0,
    answeredRate: 0,
    botStatus: 'Online',
    lastWebhook: '2 mins ago'
  })

  // Mock data for initial UI
  useEffect(() => {
    setStats({
      totalBusinesses: 142,
      activeBusinesses: 128,
      totalConversations: 854,
      answeredRate: 92,
      botStatus: 'Online',
      lastWebhook: 'Just now'
    })
  }, [])

  return (
    <div className={styles.adminPage}>
      <AdminSidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Overview</h1>
            <p className="text-caption">System status and key metrics</p>
          </div>
          <div className={styles.headerActions}>
            <span className="text-small">Last updated: 30s ago</span>
            <button className="btn-ghost">🔄 Refresh</button>
          </div>
        </header>

        <section className={styles.statsGrid}>
          <div className="stat-card">
            <div className={styles.statTop}>
              <span className="stat-number">{stats.totalBusinesses}</span>
              <span className={styles.badgeSuccess}>+5 today</span>
            </div>
            <div className="stat-label">Total Businesses</div>
          </div>
          <div className="stat-card">
            <div className={styles.statTop}>
              <span className="stat-number">{stats.totalConversations}</span>
              <span className={styles.badgeInfo}>{stats.answeredRate}% answered</span>
            </div>
            <div className="stat-label">Conversations Today</div>
          </div>
          <div className="stat-card">
            <div className={styles.statTop}>
              <span className="stat-number">{stats.activeBusinesses}</span>
              <span className="text-small">out of {stats.totalBusinesses}</span>
            </div>
            <div className="stat-label">Active Businesses</div>
          </div>
          <div className="stat-card">
            <div className={styles.statTop}>
              <div className="badge-green">
                <span className="live-dot" />
                {stats.botStatus}
              </div>
            </div>
            <div className="stat-label">Bot Status (Webhook: {stats.lastWebhook})</div>
          </div>
        </section>

        <div className={styles.bottomGrid}>
          <div className="card">
            <h2 className="text-section-title" style={{ marginBottom: 20 }}>Recent Activity</h2>
            <div className={styles.activityList}>
              {[1,2,3,4,5].map(i => (
                <div key={i} className={styles.activityItem}>
                  <div className={styles.activityDot} />
                  <div className={styles.activityText}>
                    <strong>Selam Coffee Shop</strong> registered via @username
                  </div>
                  <div className="text-small">2 hours ago</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-section-title" style={{ marginBottom: 20 }}>System Health</h2>
            <div className={styles.healthList}>
              <div className={styles.healthItem}>
                <div className={styles.healthLabel}>Groq API</div>
                <div className="badge-green">Healthy</div>
              </div>
              <div className={styles.healthItem}>
                <div className={styles.healthLabel}>Supabase Storage</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '15%' }} />
                </div>
                <div className="text-small">75MB / 500MB</div>
              </div>
              <div className={styles.healthItem}>
                <div className={styles.healthLabel}>Webhook Delivery</div>
                <div className="badge-green">100% Success</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
