import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import styles from './layout.module.css'
import Link from 'next/link'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getAdminSession()

  // 🛡️ SECURITY: Return 404 if not authorized
  if (!session) {
    notFound()
  }

  const nodeEnv = process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT'

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoMark}>M</div>
          <div>
            <div className={styles.logoText}>AskMela</div>
            <div className={styles.controlLabel}>CONTROL PANEL</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <Link href="/control/dashboard" className={styles.navItem}>
            <span className={styles.navIcon}>📊</span> Overview
          </Link>
          <Link href="/control/businesses" className={styles.navItem}>
            <span className={styles.navIcon}>🏢</span> Businesses
          </Link>
          <Link href="/control/conversations" className={styles.navItem}>
            <span className={styles.navIcon}>💬</span> Conversations
          </Link>
          <Link href="/control/system" className={styles.navItem}>
            <span className={styles.navIcon}>⚙️</span> System
          </Link>
          <Link href="/control/announcements" className={styles.navItem}>
            <span className={styles.navIcon}>📣</span> Announcements
          </Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminId}>Admin ID: {session.telegramId}</div>
          <button className={styles.logoutBtn}>🚪 Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>Overview</div>
          <div className={styles.headerActions}>
             <div className={nodeEnv === 'PRODUCTION' ? styles.badgeProd : styles.badgeDev}>
               {nodeEnv}
             </div>
             <div className={styles.lastUpdated}>Updated: {new Date().toLocaleTimeString()}</div>
             <button className={styles.refreshBtn}>🔄</button>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
