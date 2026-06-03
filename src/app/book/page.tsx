'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'
import { z } from 'zod'
import { CheckCircle, ArrowLeft } from 'lucide-react'

type Service = Database['public']['Tables']['services']['Row']

const bookingSchema = z.object({
  service_id: z.string().uuid(),
  date: z.string().min(1, 'Select a date'),
  time: z.string().min(1, 'Select a time'),
  notes: z.string().max(500).optional(),
})

function getQueryParam(param: string): string {
  if (typeof window === 'undefined') return ''
  return new URL(window.location.href).searchParams.get(param) || ''
}

export default function BookServicePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [error, setError] = useState<string | null>(null)
  const serviceId = getQueryParam('service')

  const [formData, setFormData] = useState({
    service_id: serviceId,
    date: '',
    time: '09:00',
    notes: '',
  })

  useEffect(() => {
    if (serviceId) setFormData((f) => ({ ...f, service_id: serviceId }))
  }, [serviceId])

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name')
      if (data) setServices(data)
      setLoading(false)
    })()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const parsed = bookingSchema.parse({
        ...formData,
        service_id: formData.service_id || '',
      })

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
        return
      }

      const service = services.find((s) => s.id === formData.service_id)

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          service_id: formData.service_id,
          scheduled_at: `${formData.date}T${formData.time}:00.000Z`,
          amount: service?.base_price || 0,
          notes: formData.notes || null,
          user_id: session.user.id,
          status: 'pending',
        })
        .select()
        .single()

      if (bookingError) throw bookingError
      if (booking && typeof window !== 'undefined') {
        window.location.href = `/dashboard/user?booking=success`
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-plumb-blue-50 to-plumb-green-50 p-4">
        <div className="w-12 h-12 border-4 border-plumb-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-plumb-blue-50 to-plumb-green-50 p-4">
      <div className="container mx-auto max-w-2xl py-12">
        <Link href="/services" className="inline-flex items-center gap-2 text-plumb-green-600 hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-black mb-2">Book a Service</h1>
          <p className="text-muted-foreground mb-8">Fill in the details below to schedule your appointment</p>
          {error && <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Service</label>
              <select
                required
                value={formData.service_id}
                onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} — ${service.base_price}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  required
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Time</label>
                <select
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
                >
                  {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes (optional)</label>
              <textarea
                rows={3}
                placeholder="Describe the issue or any special requirements..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-3 bg-plumb-green-600 text-white rounded-lg font-medium hover:bg-plumb-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
