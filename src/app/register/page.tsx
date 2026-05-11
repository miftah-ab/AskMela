'use client'

import { useState } from 'react'
import styles from './page.module.css'

function AskMelaLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
      <rect x="2" y="2" width="32" height="26" rx="8" fill="#2CA5E0" />
      <path d="M8 28 L4 36 L16 30" fill="#2CA5E0" />
      <path d="M22 8 L15 21 L20 21 L18 32 L25 19 L20 19 Z" fill="white" />
    </svg>
  )
}

type Step = 'form' | 'success'

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    language: 'both',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.description.trim() || !form.phone.trim()) {
      setError('ሁሉንም ሜዳዎች ይሙሉ / Please fill all fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          phone: form.phone,
          language: form.language,
          // Telegram Mini App: pass initData for auth
          initData: typeof window !== 'undefined' ? (window as any).Telegram?.WebApp?.initData : '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setLink(data.link)
      setStep('success')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: 'Chat with us on AskMela!', url: link })
    } else copy()
  }

  if (step === 'success') {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap} id="success-screen">
          <div className={styles.checkCircle}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" fill="var(--accent-green)" />
              <path d="M14 24 L21 31 L34 17" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset="0" style={{ animation: 'checkDraw 0.5s ease forwards' }} />
            </svg>
          </div>
          <h1 className={styles.successTitle} id="success-title">
            ንግድዎ ተመዝግቧል!<br />
            <span className={styles.successEn}>Your business is registered!</span>
          </h1>
          <div className={styles.linkBox} id="link-box">
            <div className={styles.linkLabel}>🔗 የደንበኞችዎ ሊንክ / Customer Link</div>
            <div className={styles.linkValue}>{link}</div>
          </div>
          <div className={styles.successBtns}>
            <button className="btn-primary" id="copy-link-btn" onClick={copy}>
              {copied ? '✅ Copied!' : '📋 ሊንኩን ይቅዱ / Copy Link'}
            </button>
            <button className="btn-secondary" id="share-link-btn" onClick={share} style={{ width: 'auto', flex: 1 }}>
              📤 Share
            </button>
          </div>
          <p className={styles.successNote}>
            ይህን ሊንክ ለደንበኞችዎ ያጋሩ — WhatsApp፣ Facebook፣ ወይም ካርቦናችሁ ላይ።<br />
            <em>Share this link with your customers anywhere.</em>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header} id="register-header">
        <AskMelaLogo />
        <h1 className={styles.headerTitle}>ንግድዎን ይመዝግቡ<br /><span className={styles.headerEn}>Register Your Business</span></h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} id="register-form">
        <div className={styles.field} id="field-name">
          <label className="input-label" htmlFor="name">የንግዱ ስም / Business Name</label>
          <input
            className="input"
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Selam Coffee Shop"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className={styles.field} id="field-description">
          <label className="input-label" htmlFor="description">አጭር መግለጫ / Short Description</label>
          <textarea
            className="input"
            id="description"
            name="description"
            placeholder="e.g. Ethiopian coffee and traditional food in Bole, Addis Ababa"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{ resize: 'none' }}
          />
        </div>

        <div className={styles.field} id="field-phone">
          <label className="input-label" htmlFor="phone">ስልክ ቁጥር / Phone Number</label>
          <input
            className="input"
            id="phone"
            name="phone"
            type="tel"
            placeholder="+251 91 000 0000"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field} id="field-language">
          <label className="input-label">ቋንቋ / Language</label>
          <div className={styles.radioGroup}>
            {(['amharic', 'english', 'both'] as const).map((lang) => (
              <label key={lang} className={`${styles.radioLabel} ${form.language === lang ? styles.radioActive : ''}`} htmlFor={`lang-${lang}`}>
                <input
                  type="radio"
                  id={`lang-${lang}`}
                  name="language"
                  value={lang}
                  checked={form.language === lang}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <span>{lang === 'amharic' ? '🇪🇹 አማርኛ' : lang === 'english' ? '🇬🇧 English' : '🔀 Both / ሁሉም'}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <div className={styles.errorBox} id="form-error" role="alert">{error}</div>}

        <button className="btn-primary" type="submit" id="submit-btn" disabled={loading}>
          {loading ? '⏳ ሚዛናለን...' : '🚀 ይመዝገቡ / Register'}
        </button>
      </form>
    </div>
  )
}
