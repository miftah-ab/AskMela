import React from 'react'

export default function ApiDocsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>REST API Reference</h1>
      <p style={{ fontSize: '1.1rem', color: '#64748B', marginBottom: '2rem' }}>
        The AskMela API is organized around REST. Our API has predictable resource-oriented URLs, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
      </p>

      <section style={{ marginBottom: '4rem' }}>
        <h2 id="authentication" style={{ fontSize: '1.5rem', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '24px' }}>Authentication</h2>
        <p style={{ marginBottom: '16px' }}>
          Your API keys carry many privileges, so be sure to keep them secure! Authentication to the API is performed via Bearer tokens in the <code>Authorization</code> header.
        </p>
        <div style={{ background: '#0F172A', padding: '20px', borderRadius: '8px', color: '#00FF88', fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '24px' }}>
          Authorization: Bearer ask_live_your_key_here
        </div>
        <div style={{ padding: '16px', background: '#FFF7ED', borderLeft: '4px solid #F97316', borderRadius: '8px' }}>
          <span style={{ fontWeight: 700, color: '#9A3412' }}>Note:</span> All API requests must be made over HTTPS. Calls made over plain HTTP will fail.
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2 id="ask" style={{ fontSize: '1.5rem', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '24px' }}>Ask Question</h2>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ background: '#00FF88', color: '#0F172A', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800 }}>POST</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>/api/v1/ask</span>
        </h3>
        <p style={{ marginBottom: '24px' }}>
          Ask a question to your business AI. The AI will search your knowledge base and return the best answer.
        </p>

        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '12px' }}>Request Parameters</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
          <thead style={{ borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.85rem' }}>Field</th>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.85rem' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.85rem' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px 0', fontFamily: 'monospace', color: '#BE185D' }}>question</td>
              <td style={{ padding: '12px 0', color: '#64748B', fontSize: '0.85rem' }}>string</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}><strong>Required.</strong> Max 500 characters. The question asked by the customer.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px 0', fontFamily: 'monospace', color: '#BE185D' }}>language</td>
              <td style={{ padding: '12px 0', color: '#64748B', fontSize: '0.85rem' }}>string</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>Optional. Force a specific language response. Options: <code>amharic</code>, <code>english</code>.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px 0', fontFamily: 'monospace', color: '#BE185D' }}>stream</td>
              <td style={{ padding: '12px 0', color: '#64748B', fontSize: '0.85rem' }}>boolean</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>Coming soon. Whether to stream the response as it is generated.</td>
            </tr>
          </tbody>
        </table>

        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '12px' }}>Example Request</h4>
        <div style={{ background: '#0F172A', padding: '24px', borderRadius: '12px', marginBottom: '24px', position: 'relative' }}>
          <pre style={{ margin: 0, color: '#E2E8F0', fontSize: '0.85rem', overflowX: 'auto' }}>
{`curl -X POST https://askmela.xyz/api/v1/ask \\
  -H "Authorization: Bearer ask_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What is the price of coffee?",
    "language": "amharic"
  }'`}
          </pre>
        </div>

        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '12px' }}>Example Response</h4>
        <div style={{ background: '#0F172A', padding: '24px', borderRadius: '12px' }}>
          <pre style={{ margin: 0, color: '#00FF88', fontSize: '0.85rem' }}>
{`{
  "answer": "ቡና 50 ብር ነው።",
  "business_id": "8f3a9...",
  "detected_language": "amharic",
  "was_answered": true
}`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2 id="errors" style={{ fontSize: '1.5rem', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '24px' }}>Error Codes</h2>
        <p style={{ marginBottom: '24px' }}>
          AskMela uses standard HTTP response codes to indicate the success or failure of an API request.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.85rem' }}>Code</th>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.85rem' }}>Message</th>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.85rem' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px 0', fontWeight: 700 }}>200</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>OK</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>Everything worked as expected.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px 0', fontWeight: 700 }}>401</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>Unauthorized</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>Invalid or missing API key.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px 0', fontWeight: 700 }}>429</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>Too Many Requests</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>You have reached your monthly question limit.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px 0', fontWeight: 700 }}>500</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>Server Error</td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>Something went wrong on our end.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2 id="rate-limits" style={{ fontSize: '1.5rem', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '24px' }}>Rate Limits</h2>
        <p style={{ marginBottom: '16px' }}>
          Rate limits are enforced based on your subscription plan. For the <strong>Free Plan</strong>, the limit is:
        </p>
        <div style={{ padding: '16px', background: '#F0F9FF', borderLeft: '4px solid #0EA5E9', borderRadius: '8px' }}>
          <span style={{ fontWeight: 700, color: '#0369A1' }}>Free Tier:</span> 10 requests per minute / 50 requests per month.
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ background: '#3B82F6', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800 }}>GET</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>/api/v1/conversations</span>
        </h3>
        <p style={{ marginBottom: '24px' }}>
          List the last 100 customer conversations for your business.
        </p>
        <div style={{ background: '#0F172A', padding: '24px', borderRadius: '12px' }}>
          <pre style={{ margin: 0, color: '#E2E8F0', fontSize: '0.85rem' }}>
{`# Response
[
  {
    "id": "...",
    "question": "Where are you located?",
    "answer": "We are in Bole, Addis Ababa.",
    "was_answered": true,
    "created_at": "2026-05-11T..."
  }
]`}
          </pre>
        </div>
      </section>
    </div>
  )
}
