'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started')

  const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'telegram-bot', title: 'Telegram Bot' },
    { id: 'website-widget', title: 'Website Widget' },
    { id: 'rest-api', title: 'REST API' },
    { id: 'webhooks', title: 'Webhooks' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'white', color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', borderRight: '1px solid #E2E8F0', padding: '40px 24px', position: 'sticky', top: 0, height: '100vh' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 700, textDecoration: 'none', color: '#0F172A', display: 'block', marginBottom: '40px' }}>
          AskMela <span style={{ color: '#94A3B8', fontWeight: 400 }}>Docs</span>
        </Link>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sections.map(s => (
            <button 
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{ 
                textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: activeSection === s.id ? '#F0FFF8' : 'transparent',
                color: activeSection === s.id ? '#065F46' : '#64748B',
                fontWeight: activeSection === s.id ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              {s.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '80px 120px', maxWidth: '1000px' }}>
        {activeSection === 'getting-started' && (
          <div>
            <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '24px' }}>Getting Started</h1>
            <p style={{ fontSize: '18px', color: '#475569', lineHeight: 1.6, marginBottom: '32px' }}>
              Ask Mela is an AI-powered assistant designed specifically for Ethiopian businesses. It allows you to automate customer service in Amharic and English across multiple channels.
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Prerequisites</h2>
            <p style={{ color: '#475569', marginBottom: '24px' }}>To start using Ask Mela, you'll need a Telegram account to register your business and manage your knowledge base.</p>
          </div>
        )}

        {activeSection === 'website-widget' && (
          <div>
            <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '24px' }}>Website Widget</h1>
            <p style={{ fontSize: '18px', color: '#475569', lineHeight: 1.6, marginBottom: '32px' }}>
              Add a live chat bubble to your website with just one line of code.
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Installation</h2>
            <div style={{ background: '#0F172A', color: '#94A3B8', padding: '24px', borderRadius: '12px', fontFamily: 'monospace', marginBottom: '24px', overflowX: 'auto' }}>
              <code style={{ color: '#7DD3FC' }}>&lt;script</code><br/>
              &nbsp;&nbsp;<code style={{ color: '#F9A8D4' }}>src=</code><code style={{ color: '#00FF88' }}>"https://askmela.addus.xyz/widget.js"</code><br/>
              &nbsp;&nbsp;<code style={{ color: '#F9A8D4' }}>data-business=</code><code style={{ color: '#00FF88' }}>"YOUR_BUSINESS_ID"</code><br/>
              &nbsp;&nbsp;<code style={{ color: '#F9A8D4' }}>data-color=</code><code style={{ color: '#00FF88' }}>"#00FF88"</code><br/>
              <code style={{ color: '#7DD3FC' }}>&gt;&lt;/script&gt;</code>
            </div>
          </div>
        )}

        {activeSection === 'rest-api' && (
          <div>
            <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '24px' }}>REST API</h1>
            <p style={{ fontSize: '18px', color: '#475569', lineHeight: 1.6, marginBottom: '32px' }}>
              The Ask Mela API allows you to programmatically interact with your AI assistant.
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Ask a Question</h2>
            <div style={{ background: '#0F172A', color: '#94A3B8', padding: '24px', borderRadius: '12px', fontFamily: 'monospace', marginBottom: '24px', overflowX: 'auto' }}>
              <span style={{ color: '#FDE68A' }}>curl</span> -X POST https://askmela.addus.xyz/api/v1/ask \<br/>
              &nbsp;&nbsp;-H <span style={{ color: '#00FF88' }}>"Authorization: Bearer YOUR_API_KEY"</span> \<br/>
              &nbsp;&nbsp;-H <span style={{ color: '#00FF88' }}>"Content-Type: application/json"</span> \<br/>
              &nbsp;&nbsp;-d <span style={{ color: '#00FF88' }}>{'\'{"question": "ዋጋው ስንት ነው?"}\''}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
