import React from 'react'
import Link from 'next/link'

export default function DocsPage() {
  return (
    <div>
      <h1 id="intro" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>መግቢያ (Introduction)</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748B', marginBottom: '2rem' }}>
        AskMela ለኢትዮጵያ ንግድዎ የAI ረዳት በቀላሉ የሚጨምሩበት መንገድ ነው። ለደንበኞችዎ በአማርኛ እና በእንግሊዝኛ ስለ ምርቶች፣ ዋጋዎች እና አገልግሎቶች ወዲያውኑ ምላሽ ይሰጣል።
      </p>

      <div style={{ 
        padding: '24px', 
        background: '#F8FAFC', 
        borderLeft: '4px solid #00FF88', 
        borderRadius: '8px',
        marginBottom: '2rem' 
      }}>
        <h4 style={{ margin: 0, color: '#0F172A', fontWeight: 700 }}>Ethiopia First</h4>
        <p style={{ margin: '8px 0 0', color: '#475569', fontSize: '0.95rem' }}>
          Unlike generic bots, AskMela is optimized for the Ethiopian context, supporting local languages and common business workflows like menu reading and voice message transcription.
        </p>
      </div>

      <h2 id="how-it-works" style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '3rem', marginBottom: '1rem' }}>How it works</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        AskMela uses RAG (Retrieval Augmented Generation) to grounding AI answers in your specific business data. Instead of making things up, the AI searches your &quot;Knowledge Base&quot; for every question.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '3rem' }}>
        <div style={{ padding: '20px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🧠</div>
          <h4 style={{ margin: 0, fontWeight: 700 }}>Teach</h4>
          <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#64748B' }}>Send text, voice, or photos to the bot.</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔗</div>
          <h4 style={{ margin: 0, fontWeight: 700 }}>Connect</h4>
          <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#64748B' }}>Link your Telegram or Website.</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💬</div>
          <h4 style={{ margin: 0, fontWeight: 700 }}>Answer</h4>
          <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#64748B' }}>Customers get instant local answers.</p>
        </div>
      </div>

      <h2 id="next-steps" style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '3rem', marginBottom: '1rem' }}>Next steps</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        If you want to try it out immediately, check our <a href="/docs/quickstart" style={{ color: '#00FF88', textDecoration: 'underline' }}>Quickstart Guide</a> or see our &quot;Website Widget&quot; integration.
        <Link href="/docs/quickstart" style={{ 
          padding: '16px', 
          background: '#0F172A', 
          color: 'white', 
          borderRadius: '8px', 
          textDecoration: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 600
        }}>
          <span>🚀 Get started in 2 minutes</span>
          <span>→</span>
        </Link>
        <Link href="/docs/api" style={{ 
          padding: '16px', 
          border: '1px solid #E2E8F0', 
          color: '#0F172A', 
          borderRadius: '8px', 
          textDecoration: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 600
        }}>
          <span>💻 Explore the REST API</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}
