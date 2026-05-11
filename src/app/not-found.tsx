import React from 'react'
import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.description}>
          Sorry, we couldn’t find the page you’re looking for. It might have been moved, deleted, or never existed.
        </p>
        
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            Back to homepage
          </Link>
          <a href="https://t.me/AskMelaBot" className={styles.secondaryBtn}>
            Contact support
          </a>
        </div>

        <div className={styles.linksGrid}>
          <Link href="/docs" className={styles.linkCard}>
            <div className={styles.linkIcon}>📚</div>
            <div className={styles.linkInfo}>
              <div className={styles.linkTitle}>Documentation</div>
              <div className={styles.linkDesc}>Learn how to use AskMela.</div>
            </div>
          </Link>
          <Link href="/dashboard" className={styles.linkCard}>
            <div className={styles.linkIcon}>📊</div>
            <div className={styles.linkInfo}>
              <div className={styles.linkTitle}>Dashboard</div>
              <div className={styles.linkDesc}>Manage your business.</div>
            </div>
          </Link>
        </div>
      </div>

      <div className={styles.background}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
    </div>
  )
}