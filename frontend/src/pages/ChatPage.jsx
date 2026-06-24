import { useState } from 'react'
import { sendChatMessage } from '../services/api'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input
    setMessages(prev => [...prev, { sender: 'customer', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const result = await sendChatMessage(userMessage)

      if (result.type === 'answer') {
        setMessages(prev => [...prev, { sender: 'ai', text: result.reply }])
      } else if (result.type === 'ticket_created') {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: `I've created a support ticket for this (Priority: ${result.ticket.priority}). Our team will follow up soon.`
        }])
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Something went wrong, please try again.' }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Connection error. Please try again.' }])
    }

    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h2>Customer Support Chat</h2>
      <div style={{
        border: '1px solid #ddd', borderRadius: '8px', height: '400px',
        overflowY: 'auto', padding: '16px', marginBottom: '12px', background: '#f9f9f9'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.sender === 'customer' ? 'right' : 'left',
            margin: '8px 0'
          }}>
            <span style={{
              display: 'inline-block', padding: '8px 12px', borderRadius: '12px',
              background: msg.sender === 'customer' ? '#4f46e5' : '#e5e7eb',
              color: msg.sender === 'customer' ? '#fff' : '#000',
              maxWidth: '80%'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p style={{ color: '#888' }}>AI is typing...</p>}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your issue..."
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button onClick={handleSend} style={{
          padding: '10px 20px', background: '#4f46e5', color: '#fff',
          border: 'none', borderRadius: '6px', cursor: 'pointer'
        }}>
          Send
        </button>
      </div>
    </div>
  )
}