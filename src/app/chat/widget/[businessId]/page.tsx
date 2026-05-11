'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import styles from './widget.module.css'

interface Message {
  id: string
  text: string
  sender: 'customer' | 'bot'
  timestamp: Date
}

export default function WidgetChatPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const businessId = params.businessId as string
  const accentColor = searchParams.get('color') || '#00FF88'

  const [businessName, setBusinessName] = useState('AskMela Assistant')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch business name
    fetch(`/api/v1/public/business/${businessId}`)
      .then(res => res.json())
      .then(data => {
        if (data.name) setBusinessName(data.name)
      })
      .catch(err => console.error('Failed to load business info', err))

    // Initial greeting
    setMessages([
      {
        id: '1',
        text: `👋 Hello! How can I help you today?`,
        sender: 'bot',
        timestamp: new Date()
      }
    ])
  }, [businessId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isTyping) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'customer',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/v1/public/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, question: userMsg.text })
      })

      const data = await response.json()
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || "I'm sorry, I couldn't find an answer to that.",
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error('Chat error:', err)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ backgroundColor: accentColor }}>
        <div className={styles.businessName}>{businessName}</div>
      </header>

      <main className={styles.messagesArea}>
        {messages.map(msg => (
          <div key={msg.id} className={msg.sender === 'bot' ? styles.botMsgRow : styles.userMsgRow}>
            <div className={msg.sender === 'bot' ? styles.botBubble : styles.userBubble} 
                 style={msg.sender === 'customer' ? { backgroundColor: accentColor } : {}}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={styles.botMsgRow}>
            <div className={styles.typingIndicator}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className={styles.footer}>
        <form className={styles.inputForm} onSubmit={handleSend}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className={styles.sendBtn} style={{ color: accentColor }}>
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </form>
        <div className={styles.poweredBy}>
          Powered by <a href="https://askmela.xyz" target="_blank" rel="noreferrer">AskMela</a>
        </div>
      </footer>
    </div>
  )
}
