'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

function AskMelaLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
      <rect x="2" y="2" width="32" height="26" rx="8" fill="#2CA5E0" />
      <path d="M8 28 L4 36 L16 30" fill="#2CA5E0" />
      <path d="M22 8 L15 21 L20 21 L18 32 L25 19 L20 19 Z" fill="white" />
    </svg>
  )
}

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/control/dashboard')
      } else {
        // Redirect to 404 as requested in the prompt for security
        router.push('/404')
      }
    } catch (err) {
      router.push('/404')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.logoArea}>
          <AskMelaLogo />
          <h1 className={styles.title}>AskMela Control Panel</h1>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className="input-label" htmlFor="password">System Password</label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
