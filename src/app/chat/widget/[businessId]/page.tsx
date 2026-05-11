'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

export default function WidgetChatPage({ params }: { params: { businessId: string } }) {
  const searchParams = useSearchParams()
  const accentColor = searchParams.get('color') || '#00FF88'
  const initialGreeting = searchParams.get('greeting') || 'Hello! How can I help you today?'
  
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: initialGreeting }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return
    const userText = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setIsTyping(true)

    try {
      const res = await fetch('/api/v1/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: userText, 
          business_id: params.businessId,
          source: 'widget'
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'bot', text: data.answer || "I'm sorry, I couldn't process that." }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to service." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', height: '100vh', 
      fontFamily: 'Inter, sans-serif', background: 'white' 
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px', borderBottom: '1px solid #E2E8F0', 
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'white'
      }}>
        <div style={{ 
          width: '32px', height: '32px', borderRadius: '8px', 
          background: accentColor, display: 'flex', alignItems: 'center', 
          justifyContent: 'center', fontWeight: 'bold' 
        }}>M</div>
        <div style={{ fontWeight: 600, fontSize: '15px' }}>Ask Mela</div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%', padding: '10px 14px', borderRadius: '14px',
            fontSize: '14px', lineHeight: 1.5,
            background: m.role === 'user' ? accentColor : '#F1F5F9',
            color: m.role === 'user' ? '#0F172A' : '#0F172A',
            borderBottomRightRadius: m.role === 'user' ? '2px' : '14px',
            borderBottomLeftRadius: m.role === 'bot' ? '2px' : '14px',
          }}>
            {m.text}
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: '#F1F5F9', borderRadius: '14px', borderBottomLeftRadius: '2px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8', animation: 'pulse 1s infinite' }}></div>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8', animation: 'pulse 1s 0.2s infinite' }}></div>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94A3B8', animation: 'pulse 1s 0.4s infinite' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            style={{ 
              flex: 1, padding: '10px 14px', border: '1px solid #E2E8F0', 
              borderRadius: '999px', fontSize: '14px', outline: 'none'
            }}
          />
          <button 
            onClick={handleSend}
            style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              background: accentColor, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#0F172A"/>
            </svg>
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10px', color: '#94A3B8' }}>
          Powered by <b>Ask Mela</b>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
