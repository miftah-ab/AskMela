'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

type Business = { id: string; name: string; description: string; unique_link: string; is_active: boolean; language: string }
type Stats = { total_questions: number; answered_questions: number; unanswered_questions: number; unique_customers: number }
type Conversation = { id: string; question: string; answer: string | null; was_answered: boolean; created_at: string; customer_username?: string; source_type: string }
type Doc = { id: string; content: string; source_type: string; created_at: string }

function AskMelaLogo({ size = 32 }: { size?: number }) {
  return (
    <div style={{ 
      width: size, height: size, borderRadius: '8px', 
      background: '#00FF88', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', fontSize: size * 0.5, fontWeight: 800, color: '#0F172A' 
    }}>
      M
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  const [business, setBusiness] = useState<Business | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [docs, setDocs] = useState<Doc[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'conversations' | 'knowledge' | 'integrations'>('overview')
  const [copied, setCopied] = useState(false)

  // 1. Check Auth
  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          fetchData()
        } else {
          setAuthLoading(false)
          setLoading(false)
        }
      })
      .catch(() => {
        setAuthLoading(false)
        setLoading(false)
      })
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()
      if (res.ok) {
        setBusiness(data.business)
        setStats(data.stats)
        setConversations(data.conversations)
        setDocs(data.docs)
      } else if (res.status === 404) {
        // Logged in but no business registered
        router.push('/register')
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/')
  }

  const deleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to remove this information?')) return
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDocs(prev => prev.filter(d => d.id !== id))
      }
    } catch (err) {
      alert('Failed to delete')
    }
  }

  const copy = () => {
    if (!business) return
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME ?? 'AskMelaAIBot'
    navigator.clipboard.writeText(`https://t.me/${botUsername}?start=${business.unique_link}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (authLoading) return <div className={styles.loadingFull}>⏳ Loading...</div>

  if (!user) {
    return (
      <div className={styles.loginOverlay}>
        <div className="card" style={{ maxWidth: 400, textAlign: 'center' }}>
          <AskMelaLogo size={48} />
          <h1 className="text-page-title" style={{ marginTop: 16 }}>Owner Dashboard</h1>
          <p className="text-caption" style={{ marginBottom: 24 }}>Login with Telegram to manage your business.</p>
          {/* Telegram Login Widget placeholder */}
          <div id="telegram-login-container">
            <p className="text-small">Use the bot to login or register first.</p>
            <a href={`https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME ?? 'AskMelaAIBot'}`} className="btn-primary" style={{ marginTop: 12 }}>
              Open Bot
            </a>
          </div>
        </div>
      </div>
    )
  }

  const botLink = business ? `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME ?? 'AskMelaAIBot'}?start=${business.unique_link}` : ''
  const answerRate = stats && stats.total_questions > 0 ? Math.round((stats.answered_questions / stats.total_questions) * 100) : 0

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar} id="dashboard-sidebar">
        <div className={styles.sidebarLogo}><AskMelaLogo size={32} /><span>AskMela</span></div>
        <nav className={styles.sidebarNav}>
          {(['overview','conversations','knowledge', 'integrations'] as const).map(tab => (
            <button key={tab} id={`tab-${tab}`} className={`${styles.navItem} ${activeTab === tab ? styles.navItemActive : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'overview' ? '📊' : tab === 'conversations' ? '💬' : tab === 'knowledge' ? '📚' : '🔌'}
              <span>{tab === 'overview' ? 'Overview' : tab === 'conversations' ? 'Conversations' : tab === 'knowledge' ? 'Knowledge Base' : 'Integrations'}</span>
            </button>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <button onClick={handleLogout} className={styles.logoutBtn}>🚪 Logout</button>
          {business && (
            <div className={styles.businessInfo} id="sidebar-business">
              <div className={styles.bizName}>{business.name}</div>
              <div className={`badge-${business.is_active ? 'green' : 'red'}`}>
                {business.is_active && <span className="live-dot" />}
                {business.is_active ? 'Live' : 'Inactive'}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.topBar} id="dashboard-topbar">
          <div>
            <h1 className="text-page-title">{activeTab === 'overview' ? 'Dashboard' : activeTab === 'conversations' ? 'Conversations' : activeTab === 'knowledge' ? 'Knowledge Base' : 'Integrations'}</h1>
            <p className="text-caption">ዛሬ / Today — {new Date().toLocaleDateString('en-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {business && (
            <div className={styles.topBarLink} id="share-link-area">
              <span className={styles.linkChip}>{botLink}</span>
              <button className="btn-ghost" id="copy-link-btn" onClick={copy}>{copied ? '✅' : '📋 Copy'}</button>
            </div>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingContent}>Fetching latest data...</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <div className={styles.content} id="overview-content">
                <div className={styles.statsGrid}>
                  <div className="stat-card" id="stat-total"><div className="stat-number">{stats.total_questions}</div><div className="stat-label">💬 Total Questions</div></div>
                  <div className="stat-card" id="stat-answered"><div className="stat-number" style={{ color: 'var(--accent-green)' }}>{stats.answered_questions}</div><div className="stat-label">✅ Answered</div></div>
                  <div className="stat-card" id="stat-unanswered"><div className="stat-number" style={{ color: 'var(--accent-red)' }}>{stats.unanswered_questions}</div><div className="stat-label">❌ Unanswered</div></div>
                  <div className="stat-card" id="stat-customers"><div className="stat-number">{stats.unique_customers}</div><div className="stat-label">👥 Customers</div></div>
                </div>

                <div className="card" id="answer-rate-card" style={{ marginTop: 24 }}>
                  <div className="text-section-title" style={{ marginBottom: 12 }}>📈 Answer Rate</div>
                  <div className={styles.rateBar}>
                    <div className={styles.rateBarFill} style={{ width: `${answerRate}%` }} />
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 600, color: 'var(--accent-green)' }}>{answerRate}%</div>
                </div>

                {/* Unanswered highlight */}
                {conversations.filter(c => !c.was_answered).length > 0 && (
                  <div className={styles.unansweredSection} id="unanswered-section">
                    <h2 className="text-section-title">⚠️ Needs Your Attention</h2>
                    {conversations.filter(c => !c.was_answered).slice(0, 5).map(conv => (
                      <div key={conv.id} className={styles.unansweredCard} id={`unanswered-${conv.id}`}>
                        <div className={styles.convQuestion}>❓ {conv.question}</div>
                        {conv.customer_username && <div className="text-caption">by @{conv.customer_username}</div>}
                        <button className="btn-primary" id={`add-answer-${conv.id}`} style={{ marginTop: 12, maxWidth: 200, fontSize: 14 }}>➕ Add Answer</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Conversations Tab */}
            {activeTab === 'conversations' && (
              <div className={styles.content} id="conversations-content">
                <div className={styles.convList}>
                  {conversations.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>No conversations yet.</div>
                  ) : (
                    conversations.map(conv => (
                      <div key={conv.id} className={`card ${styles.convCard} ${!conv.was_answered ? styles.convUnanswered : ''}`} id={`conv-${conv.id}`}>
                        <div className={styles.convTop}>
                          <span className={conv.was_answered ? 'badge-green' : 'badge-red'}>{conv.was_answered ? '✅ Answered' : '❌ Unanswered'}</span>
                          <span className="badge-blue">{conv.source_type === 'voice' ? '🎤 Voice' : '💬 Text'}</span>
                          <span className="text-small">{new Date(conv.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className={styles.convQuestion}>Q: {conv.question}</div>
                        {conv.answer && <div className={styles.convAnswer}>A: {conv.answer}</div>}
                        {conv.customer_username && <div className="text-caption">by @{conv.customer_username}</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Knowledge Base Tab */}
            {activeTab === 'knowledge' && (
              <div className={styles.content} id="knowledge-content">
                <div className={styles.kbHeader}>
                  <h2 className="text-section-title">📚 Knowledge Base ({docs.length} items)</h2>
                  <p className="text-caption">Send text, voice, or photos to the bot to add more.</p>
                </div>
                <div className={styles.docList}>
                  {docs.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>Your knowledge base is empty.</div>
                  ) : (
                    docs.map(doc => (
                      <div key={doc.id} className={`card ${styles.docCard}`} id={`doc-${doc.id}`}>
                        <div className={styles.docTop}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <span className="badge-blue">{doc.source_type === 'voice' ? '🎤 Voice' : doc.source_type === 'photo' ? '📸 Photo' : '📝 Text'}</span>
                            <span className="text-small">{new Date(doc.created_at).toLocaleDateString()}</span>
                          </div>
                          <button onClick={() => deleteDoc(doc.id)} className={styles.deleteBtn}>🗑️</button>
                        </div>
                        <div className={styles.docContent}>{doc.content}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {activeTab === 'integrations' && (
              <div className={styles.content} id="integrations-content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Telegram */}
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <h3 className="text-section-title">Telegram Bot</h3>
                      <span className="badge-green">Active</span>
                    </div>
                    <p className="text-caption" style={{ marginBottom: '16px' }}>Share your link with customers to start chatting.</p>
                    <div className={styles.topBarLink} style={{ margin: 0, padding: '8px' }}>
                      <span className={styles.linkChip} style={{ fontSize: '12px' }}>{botLink}</span>
                    </div>
                  </div>

                  {/* Widget */}
                  <div className="card">
                    <h3 className="text-section-title" style={{ marginBottom: '16px' }}>Website Widget</h3>
                    <p className="text-caption" style={{ marginBottom: '16px' }}>Paste this code before the {'</body>'} tag on your website.</p>
                    <div style={{ background: '#F1F5F9', padding: '12px', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace', marginBottom: '16px' }}>
                      {`<script src="https://askmela.xyz/widget.js" data-business="${business?.id}"></script>`}
                    </div>
                  </div>

                  {/* REST API */}
                  <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="text-section-title" style={{ marginBottom: '16px' }}>REST API</h3>
                    <p className="text-caption" style={{ marginBottom: '16px' }}>Manage your API keys for custom integrations.</p>
                    <button className="btn-primary" style={{ fontSize: '14px', width: 'auto' }}>Generate API Key</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
