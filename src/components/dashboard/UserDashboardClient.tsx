'use client'

import { Calendar, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Booking = Database['public']['Tables']['bookings']['Row'] & {
  services: { name: string; base_price: number } | null
}

interface UserDashboardClientProps {
  user: User
  profile: Profile | null
  bookings: Booking[]
}

export default function UserDashboardClient({ user, profile, bookings }: UserDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')

  const upcomingBookings = bookings.filter(b => 
    ['pending', 'confirmed', 'in_progress'].includes(b.status || '')
  )
  const pastBookings = bookings.filter(b => 
    ['completed', 'cancelled'].includes(b.status || '')
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-500" />
      case 'cancelled': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Calendar className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-2">
            Welcome back, {profile?.full_name || user.email}
          </h1>
          <p className="text-muted-foreground">Manage your plumbing services</p>
        </motion.div>

        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-2 border-b-2 transition-colors ${
              activeTab === 'upcoming' 
                ? 'border-plumb-green-600 text-plumb-green-600' 
                : 'border-transparent'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-2 border-b-2 transition-colors ${
              activeTab === 'history' 
                ? 'border-plumb-green-600 text-plumb-green-600' 
                : 'border-transparent'
            }`}
          >
            History ({pastBookings.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">No upcoming bookings</p>
                  </div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(booking.status || '')}
                          <h3 className="font-semibold text-lg">
                            {booking.services?.name || 'Service'}
                          </h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status || '')}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Scheduled</span>
                          <p>{new Date(booking.scheduled_at || '').toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount</span>
                          <p className="font-semibold">${booking.amount}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Payment</span>
                          <p>{booking.payfast_payment_id ? 'Paid' : 'Pending'}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card rounded-lg p-6 shadow-sm border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{booking.services?.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status || '')}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Completed on {new Date(booking.scheduled_at || '').toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 px-6 py-4 rounded-full bg-plumb-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Booking</span>
        </motion.button>
      </div>
    </div>
  )
}