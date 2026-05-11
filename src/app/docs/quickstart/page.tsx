import React from 'react'

export default function QuickstartPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Quickstart Guide</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748B', marginBottom: '2rem' }}>
        Learn how to set up your AI assistant and answer your first customer question in under 2 minutes.
      </p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>1. Register on Telegram</h2>
        <p style={{ marginBottom: '16px' }}>
          Open the <a href="https://t.me/AskMelaBot" style={{ color: '#00FF88', fontWeight: 600 }}>AskMela Bot</a> and send <code>/start</code>. Follow the instructions to register your business name and details.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>2. Feed the Brain</h2>
        <p style={{ marginBottom: '16px' }}>
          Your assistant is born with a blank mind. You need to teach it! Send any of the following to the bot:
        </p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}><strong>Text:</strong> &quot;We are open from 8am to 10pm every day.&quot;</li>
          <li style={{ marginBottom: '8px' }}><strong>Voice:</strong> Record yourself explaining your services.</li>
          <li style={{ marginBottom: '8px' }}><strong>Photos:</strong> Send a photo of your menu or price list.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>3. Test your Assistant</h2>
        <p style={{ marginBottom: '16px' }}>
          Go to your business&apos;s unique link (provided by the bot or in your dashboard) and ask a question.
        </p>
        <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <p style={{ fontWeight: 600, margin: 0 }}>Try asking:</p>
          <p style={{ fontStyle: 'italic', color: '#64748B', marginTop: '8px' }}>&quot;What time do you close on Sundays?&quot;</p>
        </div>
      </section>

      <div style={{ 
        marginTop: '4rem', 
        padding: '32px', 
        background: '#0F172A', 
        color: 'white', 
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Ready to go deep?</h3>
        <p style={{ color: '#94A3B8', marginTop: '12px', marginBottom: '24px' }}>Learn how to embed the chat widget on your own website.</p>
        <a href="/docs/widget" style={{ 
          display: 'inline-block',
          padding: '12px 24px',
          background: '#00FF88',
          color: '#0F172A',
          borderRadius: '8px',
          fontWeight: 700,
          textDecoration: 'none'
        }}>Learn about Widgets →</a>
      </div>
    </div>
  )
}
