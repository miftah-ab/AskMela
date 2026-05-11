'use client'

import React, { useState, useEffect } from 'react'
import styles from './IntegrationsTab.module.css'
import { QRCodeSVG } from 'qrcode.react'

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  created_at: string
  last_used_at: string | null
}

interface IntegrationsTabProps {
  businessId: string
  uniqueLink: string
  initialWidgetColor?: string
  initialWidgetPosition?: string
}

export default function IntegrationsTab({ 
  businessId, 
  uniqueLink, 
  initialWidgetColor = '#00FF88', 
  initialWidgetPosition = 'bottom-right' 
}: IntegrationsTabProps) {
  const [widgetColor, setWidgetColor] = useState(initialWidgetColor)
  const [widgetPosition, setWidgetPosition] = useState(initialWidgetPosition)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'AskMelaBot'
  const botLink = `https://t.me/${botUsername}?start=${uniqueLink}`
  const widgetScript = `<script src="https://askmela.xyz/widget.js" data-business="${businessId}" data-color="${widgetColor}" data-position="${widgetPosition}"></script>`

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const res = await fetch('/api/dashboard/keys')
      const data = await res.json()
      if (res.ok) setApiKeys(data)
    } catch (err) {
      console.error('Failed to fetch keys')
    }
  }

  const handleGenerateKey = async () => {
    if (!newKeyName.trim() || isGenerating) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/dashboard/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName })
      })
      const data = await res.json()
      if (res.ok) {
        setGeneratedKey(data.key)
        setNewKeyName('')
        fetchApiKeys()
      }
    } catch (err) {
      alert('Failed to generate key')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Apps using it will stop working.')) return
    try {
      const res = await fetch(`/api/dashboard/keys/${id}`, { method: 'DELETE' })
      if (res.ok) fetchApiKeys()
    } catch (err) {
      alert('Failed to revoke')
    }
  }

  const copyWidgetCode = () => {
    navigator.clipboard.writeText(widgetScript)
    alert('Copied to clipboard!')
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Telegram Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Telegram Bot</h3>
            <span className={styles.badgeGreen}>Active</span>
          </div>
          <div className={styles.qrArea}>
            <QRCodeSVG value={botLink} size={150} fgColor="#0F172A" />
          </div>
          <div className={styles.linkDisplay}>
            <div className={styles.linkText}>{botLink}</div>
            <button className={styles.copyBtn} onClick={() => {
              navigator.clipboard.writeText(botLink)
              alert('Link copied!')
            }}>📋 Copy</button>
          </div>
          <p className={styles.instruction}>Share this link on Facebook, Instagram, or your business cards.</p>
        </div>

        {/* Website Widget Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Website Widget</h3>
          <p className={styles.instruction}>Embed AskMela on your own website.</p>
          
          <div className={styles.customizer}>
            <div className={styles.field}>
              <label>Widget Color</label>
              <input type="color" value={widgetColor} onChange={(e) => setWidgetColor(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Position</label>
              <select value={widgetPosition} onChange={(e) => setWidgetPosition(e.target.value)}>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>
          </div>

          <div className={styles.codeBlock}>
            <code>{widgetScript}</code>
            <button className={styles.copyBtn} onClick={copyWidgetCode}>📋 Copy Script</button>
          </div>
          <p className={styles.instructionSmall}>Paste this before the <code>&lt;/body&gt;</code> tag.</p>
          <button className={styles.previewBtn}>Live Preview Demo</button>
        </div>

        {/* REST API Card */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h3 className={styles.cardTitle}>REST API</h3>
          <p className={styles.instruction}>Integrate AskMela into your custom applications.</p>
          
          <div className={styles.keyGenerator}>
            <input 
              type="text" 
              placeholder="Key Name (e.g., Mobile App)" 
              value={newKeyName} 
              onChange={(e) => setNewKeyName(e.target.value)} 
              className={styles.input}
            />
            <button className={styles.primaryBtn} onClick={handleGenerateKey} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate New API Key'}
            </button>
          </div>

          {generatedKey && (
            <div className={styles.generatedKeyBox}>
              <div className={styles.keyWarning}>⚠️ Copy this key now! It won&apos;t be shown again.</div>
              <div className={styles.keyValue}>
                <code>{generatedKey}</code>
                <button onClick={() => {
                  navigator.clipboard.writeText(generatedKey)
                  setCopiedKey(true)
                  setTimeout(() => setCopiedKey(false), 2000)
                }}>{copiedKey ? '✅ Copied' : '📋 Copy'}</button>
              </div>
            </div>
          )}

          <div className={styles.keyList}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Prefix</th>
                  <th>Created</th>
                  <th>Last Used</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map(key => (
                  <tr key={key.id}>
                    <td>{key.name}</td>
                    <td><code>{key.key_prefix}</code></td>
                    <td>{new Date(key.created_at).toLocaleDateString()}</td>
                    <td>{key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}</td>
                    <td>
                      <button className={styles.revokeBtn} onClick={() => handleRevokeKey(key.id)}>Revoke</button>
                    </td>
                  </tr>
                ))}
                {apiKeys.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#94A3B8' }}>No API keys generated yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.docLink}>
            📖 <a href="/docs/api" target="_blank">View API Documentation</a>
          </div>
        </div>
      </div>
    </div>
  )
}
