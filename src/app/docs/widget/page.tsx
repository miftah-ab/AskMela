import React from 'react'

export default function WidgetDocsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Website Widget</h1>
      <p style={{ fontSize: '1.2rem', color: '#64748B', marginBottom: '2rem' }}>
        Add a beautiful, AI-powered chat bubble to your website with just one line of code.
      </p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Installation</h2>
        <p style={{ marginBottom: '16px' }}>
          Paste the following script tag right before the closing <code>&lt;/body&gt;</code> tag of your HTML.
        </p>
        <div style={{ background: '#0F172A', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
          <pre style={{ margin: 0, color: '#E2E8F0', fontSize: '0.85rem', overflowX: 'auto' }}>
{`<script 
  src="https://askmela.xyz/widget.js" 
  data-business="YOUR_BUSINESS_ID"
></script>`}
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Customization</h2>
        <p style={{ marginBottom: '16px' }}>
          You can customize the widget&apos;s appearance by adding data attributes to the script tag.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
          <thead style={{ borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.85rem' }}>Attribute</th>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.85rem' }}>Default</th>
              <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '0.85rem' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px 0', fontFamily: 'monospace', color: '#BE185D' }}>data-color</td>
              <td style={{ padding: '12px 0', color: '#64748B', fontSize: '0.85rem' }}><code>#00FF88</code></td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}>Hex color for buttons and header.</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              <td style={{ padding: '12px 0', fontFamily: 'monospace', color: '#BE185D' }}>data-position</td>
              <td style={{ padding: '12px 0', color: '#64748B', fontSize: '0.85rem' }}><code>bottom-right</code></td>
              <td style={{ padding: '12px 0', fontSize: '0.85rem' }}><code>bottom-right</code> or <code>bottom-left</code>.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Advanced: Programmatic Open</h2>
        <p style={{ marginBottom: '16px' }}>
          If you want to trigger the widget from your own button, you can use the global <code>AskMela</code> object.
        </p>
        <div style={{ background: '#0F172A', padding: '24px', borderRadius: '12px' }}>
          <pre style={{ margin: 0, color: '#E2E8F0', fontSize: '0.85rem' }}>
{`// Open the widget
window.AskMela.open();

// Close the widget
window.AskMela.close();`}
          </pre>
        </div>
      </section>
    </div>
  )
}
