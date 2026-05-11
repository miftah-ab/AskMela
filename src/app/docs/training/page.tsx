import React from 'react'

export default function TrainingDocsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Training your AI</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748B', marginBottom: '2rem' }}>
        Learn how to optimize your Knowledge Base for the most accurate and helpful AI responses.
      </p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Best Practices</h2>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>Be Specific</h4>
            <p style={{ margin: '8px 0 0', color: '#64748B', fontSize: '0.95rem' }}>
              Instead of &quot;We have low prices,&quot; say &quot;Our classic macchiato is 45 ETB and the larger size is 65 ETB.&quot;
            </p>
          </div>
          <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>One Fact per Sentence</h4>
            <p style={{ margin: '8px 0 0', color: '#64748B', fontSize: '0.95rem' }}>
              Our AI performs best when information is broken down into simple, declarative sentences.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Managing Documents</h2>
        <p style={{ marginBottom: '16px' }}>
          You can view and delete individual documents in your <strong>Owner Dashboard</strong> under the &quot;Knowledge Base&quot; tab. If you update a price, delete the old document and send the new price to the bot.
        </p>
      </section>
    </div>
  )
}
