import React from 'react'
import styles from './layout.module.css'
import Link from 'next/link'

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoMark}>M</div>
            <span>AskMela Docs</span>
          </Link>
          <div className={styles.headerLinks}>
            <Link href="/dashboard" className={styles.headerLink}>Dashboard</Link>
            <a href="https://t.me/AskMelaBot" className={styles.headerLink}>Support Bot</a>
          </div>
        </div>
      </header>

      <div className={styles.wrapper}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <div className={styles.navGroup}>
              <div className={styles.navGroupTitle}>Getting Started</div>
              <Link href="/docs" className={styles.navLink}>Introduction</Link>
              <Link href="/docs/quickstart" className={styles.navLink}>Quickstart</Link>
            </div>

            <div className={styles.navGroup}>
              <div className={styles.navGroupTitle}>Integrations</div>
              <Link href="/docs/telegram" className={styles.navLink}>Telegram Bot</Link>
              <Link href="/docs/widget" className={styles.navLink}>Website Widget</Link>
            </div>

            <div className={styles.navGroup}>
              <div className={styles.navGroupTitle}>API Reference</div>
              <Link href="/docs/api" className={styles.navLink}>Authentication</Link>
              <Link href="/docs/api/ask" className={styles.navLink}>Ask Question</Link>
              <Link href="/docs/api/knowledge" className={styles.navLink}>Manage Knowledge</Link>
              <Link href="/docs/api/stats" className={styles.navLink}>Usage Stats</Link>
            </div>

            <div className={styles.navGroup}>
              <div className={styles.navGroupTitle}>Guides</div>
              <Link href="/docs/training" className={styles.navLink}>Training your AI</Link>
              <Link href="/docs/voice" className={styles.navLink}>Voice Messages</Link>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className={styles.content}>
          <div className={styles.prose}>
            {children}
          </div>
        </main>

        {/* Right Table of Contents (Hidden on mobile) */}
        <aside className={styles.toc}>
          <div className={styles.tocTitle}>On this page</div>
          <div className={styles.tocLinks}>
            <a href="#intro" className={styles.tocLink}>Introduction</a>
            <a href="#how-it-works" className={styles.tocLink}>How it works</a>
            <a href="#next-steps" className={styles.tocLink}>Next steps</a>
          </div>
        </aside>
      </div>
    </div>
  )
}
