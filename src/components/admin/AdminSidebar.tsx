'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './AdminSidebar.module.css'

function AskMelaLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="2" y="2" width="32" height="26" rx="8" fill="#2CA5E0" />
      <path d="M8 28 L4 36 L16 30" fill="#2CA5E0" />
      <path d="M22 8 L15 21 L20 21 L18 32 L25 19 L20 19 Z" fill="white" />
    </svg>
  )
}

const NAV_ITEMS = [
  { label: 'Overview', href: '/control/dashboard', icon: '📊' },
  { label: 'Businesses', href: '/control/businesses', icon: '🏪' },
  { label: 'Conversations', href: '/control/conversations', icon: '💬' },
  { label: 'System Health', href: '/control/system', icon: '🛡️' },
  { label: 'Announcements', href: '/control/announcements', icon: '📣' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/control')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <AskMelaLogo size={32} />
          <span>Control Panel</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.bottom}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}
