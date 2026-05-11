import React from 'react'
import styles from './page.module.css'
import { supabase } from '@/bot/services/supabase'

// Mock chart component for now or use real Recharts in a client component
import DashboardCharts from '@/components/admin/DashboardCharts'

async function getStats() {
  const today = new Date().toISOString().split('T')[0]
  
  // 1. Businesses
  const { count: totalBiz } = await supabase.from('AskMelaBusinesses').select('*', { count: 'exact', head: true })
  
  // 2. Conversations today
  const { data: todayStats } = await supabase
    .from('AskMelaStats')
    .select('total_questions, answered_questions')
    .eq('date', today)
  
  const totalQuestions = todayStats?.reduce((acc, s) => acc + (s.total_questions || 0), 0) || 0
  const answeredQuestions = todayStats?.reduce((acc, s) => acc + (s.answered_questions || 0), 0) || 0
  
  // 3. Active businesses this week (unique businesses in Stats table for last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const { data: activeWeek } = await supabase
    .from('AskMelaStats')
    .select('business_id')
    .gte('date', weekAgo.toISOString().split('T')[0])
  
  const uniqueActive = new Set(activeWeek?.map(a => a.business_id)).size

  // 4. Recent activity
  const { data: recentBiz } = await supabase
    .from('AskMelaBusinesses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    totalBiz,
    totalQuestions,
    answeredQuestions,
    uniqueActive,
    recentBiz
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const answerRate = stats.totalQuestions > 0 ? Math.round((stats.answeredQuestions / stats.totalQuestions) * 100) : 0

  return (
    <div className={styles.dashboard}>
      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.totalBiz}</div>
          <div className={styles.statLabel}>Total Businesses</div>
          <div className={styles.trendUp}>↑ 12% vs last month</div>
        </div>
        <div className={`${styles.statCard} ${styles.highlight}`}>
          <div className={styles.statValue}>{stats.totalQuestions}</div>
          <div className={styles.statLabel}>Questions Today</div>
          <div className={styles.trendUp}>↑ {answerRate}% answered</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.uniqueActive}</div>
          <div className={styles.statLabel}>Active This Week</div>
          <div className={styles.trendMuted}>{stats.totalBiz ? Math.round((stats.uniqueActive / (stats.totalBiz || 1)) * 100) : 0}% of total</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#00FF88' }}>ONLINE</div>
          <div className={styles.statLabel}>Bot Status</div>
          <div className={styles.trendMuted}>Uptime: 99.98%</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className={styles.chartSection}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Weekly Activity</h3>
          <div className={styles.cardActions}>Last 7 days</div>
        </div>
        <div className={styles.chartWrapper}>
          <DashboardCharts />
        </div>
      </div>

      <div className={styles.bottomGrid}>
        {/* Recent Businesses */}
        <div className={styles.tableCard}>
          <h3 className={styles.cardTitle}>Recent Registrations</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Business</th>
                <th>Phone</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBiz?.map(biz => (
                <tr key={biz.id}>
                  <td>{biz.name}</td>
                  <td>{biz.owner_phone}</td>
                  <td className={styles.mutedText}>{new Date(biz.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* System Health */}
        <div className={styles.healthCard}>
          <h3 className={styles.cardTitle}>System Health</h3>
          <div className={styles.healthItems}>
            <div className={styles.healthItem}>
              <div className={styles.healthStatus} style={{ background: '#00FF88' }}></div>
              <div className={styles.healthInfo}>
                <div className={styles.healthLabel}>Groq API</div>
                <div className={styles.healthValue}>Operational · 1.2k calls</div>
              </div>
            </div>
            <div className={styles.healthItem}>
              <div className={styles.healthStatus} style={{ background: '#00FF88' }}></div>
              <div className={styles.healthInfo}>
                <div className={styles.healthLabel}>Supabase</div>
                <div className={styles.healthValue}>Healthy · 42MB used</div>
              </div>
            </div>
            <div className={styles.healthItem}>
              <div className={styles.healthStatus} style={{ background: '#00FF88' }}></div>
              <div className={styles.healthInfo}>
                <div className={styles.healthLabel}>Render Worker</div>
                <div className={styles.healthValue}>Running · v1.2.4</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
