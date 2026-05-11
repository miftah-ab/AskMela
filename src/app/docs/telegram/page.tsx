import React from 'react'

export default function TelegramDocsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Telegram Bot</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748B', marginBottom: '2rem' }}>
        The Telegram Bot is the heart of AskMela. It serves as both the management interface for owners and the chat interface for customers.
      </p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Bot Modes</h2>
        <p style={{ marginBottom: '16px' }}>
          The bot automatically switches its interface based on who is messaging.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <h4 style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>Owner Mode</h4>
            <p style={{ margin: '8px 0 0', color: '#64748B', fontSize: '0.9rem' }}>
              Triggered when you message from your registered Telegram account. Use it to add knowledge, check stats, and manage settings.
            </p>
          </div>
          <div style={{ padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <h4 style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>Customer Mode</h4>
            <p style={{ margin: '8px 0 0', color: '#64748B', fontSize: '0.9rem' }}>
              Triggered when customers use your unique link. They see your business branding and get AI-powered answers.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Deep Linking</h2>
        <p style={{ marginBottom: '16px' }}>
          You can link customers directly to your business chat within the main AskMela Bot using your unique link:
        </p>
        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '1rem', color: '#3B82F6', border: '1px solid #E2E8F0' }}>
          t.me/AskMelaBot?start=YOUR_LINK
        </div>
        <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#64748B' }}>
          This allows you to have a professional presence without needing to host or manage your own bot infrastructure.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Commands</h2>
        <ul style={{ padding: 0, listStyle: 'none' }}>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
            <code style={{ color: '#BE185D', fontWeight: 700 }}>/start</code> — Opens your owner dashboard or starts a customer chat.
          </li>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
            <code style={{ color: '#BE185D', fontWeight: 700 }}>/stats</code> — (Owner only) Shows today&apos;s activity summary.
          </li>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
            <code style={{ color: '#BE185D', fontWeight: 700 }}>/help</code> — Shows available instructions and features.
          </li>
          <li style={{ padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
            <code style={{ color: '#BE185D', fontWeight: 700 }}>/clear</code> — (Owner only) Permanently deletes your business knowledge base.
          </li>
        </ul>
      </section>
    </div>
  )
}
