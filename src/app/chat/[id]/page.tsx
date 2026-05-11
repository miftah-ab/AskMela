'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import styles from './page.module.css'

function AskMelaLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="2" y="2" width="32" height="26" rx="8" fill="#2CA5E0" />
      <path d="M8 28 L4 36 L16 30" fill="#2CA5E0" />
      <path d="M22 8 L15 21 L20 21 L18 32 L25 19 L20 19 Z" fill="white" />
    </svg>
  )
}

export default function CustomerChatPage() {
  const { id } = useParams()
  const [business, setBusiness] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Mock business data fetch
    setBusiness({ name: 'Selam Coffee Shop', description: 'Ethiopian coffee and traditional food' })
    setMessages([
      { role: 'assistant', content: '👋 ሰላም! ማንኛውንም ጥያቄ ይጠይቁኝ።\nHello! Ask me anything about our business.' }
    ])
  }, [id])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // API call placeholder for RAG search
      await new Promise(r => setTimeout(r, 1000))
      setMessages(prev => [...prev, { role: 'assistant', content: 'ይህ አገልግሎት በቅርቡ በድረ-ገጽ ላይ ይገኛል። ለጊዜው በቴሌግራም ይጠቀሙ።\nThis web chat is coming soon. Please use Telegram for now.' }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to assistant.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.chatPage}>
      <header className={styles.header}>
        <div className={styles.bizInfo}>
          <AskMelaLogo size={32} />
          <div>
            <h1 className={styles.bizName}>{business?.name || 'Loading...'}</h1>
            <p className={styles.bizSub}>AI Business Assistant</p>
          </div>
        </div>
        <a href={`https://t.me/AskMelaAIBot?start=${id}`} className="btn-ghost" style={{ fontSize: 12 }}>
          Open in Telegram
        </a>
      </header>

      <main className={styles.chatArea}>
        {messages.map((m, i) => (
          <div key={i} className={`${styles.message} ${m.role === 'user' ? styles.userMsg : styles.botMsg}`}>
            <div className={styles.bubble}>{m.content}</div>
          </div>
        ))}
        {loading && <div className={styles.loading}>Bot is thinking...</div>}
      </main>

      <footer className={styles.footer}>
        <form className={styles.form} onSubmit={handleSend}>
          <input 
            className="input" 
            placeholder="ጥያቄዎን እዚህ ይጻፉ... / Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ width: 'auto', minWidth: 44, padding: 0 }}>
            🏹
          </button>
        </form>
        <div className={styles.powered}>Powered by <strong>AskMela</strong></div>
      </footer>
    </div>
  )
}
