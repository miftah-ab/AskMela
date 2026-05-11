import React from 'react'

export default function VoiceDocsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Voice Messages</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748B', marginBottom: '2rem' }}>
        AskMela uses Groq Whisper to transcribe voice messages instantly, making it the fastest way to train your AI.
      </p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How it works</h2>
        <p style={{ marginBottom: '16px' }}>
          When you send a voice message to the AskMela Bot, we:
        </p>
        <ol style={{ paddingLeft: '20px', marginBottom: '16px', color: '#475569' }}>
          <li style={{ marginBottom: '12px' }}>Download the audio file from Telegram securely.</li>
          <li style={{ marginBottom: '12px' }}>Send it to Groq&apos;s high-speed Whisper-v3 model.</li>
          <li style={{ marginBottom: '12px' }}>Convert the speech to text (supporting Amharic and English).</li>
          <li style={{ marginBottom: '12px' }}>Add the text to your AI&apos;s Knowledge Base.</li>
        </ol>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Supported Languages</h2>
        <p style={{ marginBottom: '16px' }}>
          We currently support voice transcription for:
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ padding: '6px 12px', background: '#F1F5F9', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>🇪🇹 Amharic</span>
          <span style={{ padding: '6px 12px', background: '#F1F5F9', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>🇺🇸 English</span>
        </div>
      </section>
    </div>
  )
}
