'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader2, Bell, CreditCard, Calendar, Users } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Intent = 'availability' | 'pricing' | 'scheduling' | 'notification' | 'payment' | 'general'

interface AIChatProps {
  context?: {
    serviceId?: string
    date?: string
    urgency?: 'low' | 'medium' | 'high'
    location?: string
  }
}

export function AIChat({ context }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
    }
    return ''
  })
  const [activeAction, setActiveAction] = useState<Intent | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          history: messages,
          context,
        }),
      })

      const data = await res.json()
      if (data.error) {
        setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
        if (data.intent) {
          setActiveAction(data.intent)
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    }

    setLoading(false)
  }

  const ActionButton = ({ intent, icon: Icon, label }: { intent: Intent, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveAction(intent)
        setInput(`I want to ${label.toLowerCase()}`)
      }}
      className="flex items-center space-x-2 px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-plumb-green-100 transition-colors"
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </button>
  )

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-plumb-green-600 text-white rounded-full shadow-lg hover:bg-plumb-green-700 transition-colors"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-plumb-green-600 text-white">
            <div>
              <h3 className="font-semibold">Punctual Plumbers Assistant</h3>
              <p className="text-xs text-green-100">Smart routing & payments</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 py-2 border-b border-gray-100 flex gap-2 overflow-x-auto">
            <ActionButton intent="availability" icon={Users} label="Check Availability" />
            <ActionButton intent="pricing" icon={CreditCard} label="Dynamic Pricing" />
            <ActionButton intent="scheduling" icon={Calendar} label="Schedule Booking" />
            <ActionButton intent="payment" icon={CreditCard} label="Payment Options" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                <p className="mb-2">Hi! I&apos;m Punctual Plumbers Assistant.</p>
                <p>I can check availability, calculate prices, and process payments.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-plumb-green-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-none">
                  <Loader2 className="h-4 w-4 animate-spin text-plumb-green-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about availability, pricing, or payments..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 bg-plumb-green-600 text-white rounded-lg hover:bg-plumb-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}