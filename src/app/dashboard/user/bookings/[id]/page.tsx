'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'
import { CheckCircle, Calendar, ArrowLeft } from 'lucide-react'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  services: { name: string } | null
}

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking') || searchParams.get('id')
  const status = searchParams.get('status')
  const supabase = createClient()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setLoading(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('bookings')
        .select('*, services(name)')
        .eq('id', bookingId)
        .eq('user_id', session.user.id)
        .single()

      if (data) setBooking(data as Booking)
      setLoading(false)
    }

    fetchBooking()
  }, [bookingId, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-plumb-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!bookingId || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Booking Not Found</h2>
          <p className="text-muted-foreground">This booking doesn&apos;t exist or you don&apos;t have access to it.</p>
          <Link href="/services" className="text-plumb-green-600 hover:underline">Browse services</Link>
        </div>
      </div>
    )
  }

  const isSuccess = status === 'success'
  const isCancelled = status === 'cancelled'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-plumb-blue-50 to-plumb-green-50 p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
          isSuccess ? 'bg-green-100' : isCancelled ? 'bg-red-100' : 'bg-yellow-100'
        }`}>
          <CheckCircle className={`h-8 w-8 ${
            isSuccess ? 'text-green-600' : isCancelled ? 'text-red-600' : 'text-yellow-600'
          }`} />
        </div>

        <div>
          <h1 className="text-2xl font-black">
            {isSuccess ? 'Booking Confirmed!' : isCancelled ? 'Booking Cancelled' : 'Booking Pending'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSuccess
              ? 'Your appointment has been scheduled. We\'ll send you a reminder before your visit.'
              : isCancelled
              ? 'This booking was cancelled.'
              : 'Your booking request has been submitted.'}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
          <p><span className="font-medium">Service:</span> {booking.services?.name}</p>
          <p><span className="font-medium">Date:</span> {new Date(booking.scheduled_at).toLocaleString()}</p>
          <p><span className="font-medium">Status:</span> <span className="capitalize">{booking.status}</span></p>
          <p><span className="font-medium">Amount:</span> R{booking.amount}</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/user"
            className="flex-1 px-4 py-3 bg-plumb-green-600 text-white rounded-lg font-medium hover:bg-plumb-green-700 transition-colors text-center"
          >
            View Dashboard
          </Link>
          <Link
            href="/services"
            className="flex-1 px-4 py-3 border border-plumb-green-600 text-plumb-green-600 rounded-lg font-medium hover:bg-plumb-green-50 transition-colors text-center"
          >
            Book Another
          </Link>
        </div>
      </div>
    </div>
  )
}
