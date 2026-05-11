'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret })
      })

      if (res.ok) {
        router.push('/control/dashboard')
      } else {
        setError('ተሳስተዋል። ደግመው ይሞክሩ። / Incorrect secret.')
      }
    } catch (err) {
      setError('Error connecting to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>M</div>
        <h1 className={styles.title}>System Admin</h1>
        <p className={styles.sub}>Enter secret to access control panel</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <input 
            type="password" 
            className="input" 
            placeholder="Secret Key" 
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoFocus
          />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading || !secret}>
            {loading ? 'Verifying...' : 'Enter Control Panel'}
          </button>
        </form>
      </div>
    </div>
  )
}
