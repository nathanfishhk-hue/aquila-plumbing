'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+27 83 237 9132 (Steven Freislich)' },
  { icon: Mail, label: 'Email', value: 'punctualplumbers@outlook.com' },
  { icon: MapPin, label: 'Location', value: 'Garden Route, South Africa' },
  { icon: Clock, label: 'Hours', value: 'Available for commercial projects throughout Garden Route' },
]

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-plumb-green-600 to-plumb-blue-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Have a question or need a quote? Reach out and we&apos;ll respond within 24 hours.
          </p>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="p-3 bg-plumb-green-50 rounded-lg">
                    <Icon className="h-6 w-6 text-plumb-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{label}</h3>
                    <p className="text-muted-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-2xl border shadow-sm">
              <input
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
              />
              <input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
              />
              <textarea
                required
                placeholder="Tell us about your plumbing needs..."
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-plumb-green-600 text-white rounded-lg font-medium hover:bg-plumb-green-700 transition-colors"
              >
                <Send className="h-4 w-4" />
                {submitted ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
