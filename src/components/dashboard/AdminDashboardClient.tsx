'use client'

import { useState } from 'react'
import { Calendar, BarChart3, Plus, Edit, Trash2, Wrench, UserCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database } from '@/lib/database.types'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  services: { name: string } | null
  profiles: { full_name: string } | null
}
type Service = Database['public']['Tables']['services']['Row']
type Plumber = { id: string; full_name: string }

interface AdminDashboardClientProps {
  bookings: Booking[]
  services: Service[]
  plumbers: Plumber[]
}

export default function AdminDashboardClient({ bookings, services, plumbers }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'plumbers' | 'analytics'>('bookings')
  const [assigningPlumber, setAssigningPlumber] = useState<string | null>(null)
  const [selectedPlumber, setSelectedPlumber] = useState<string>('')

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue: bookings.reduce((sum, b) => sum + Number(b.amount || 0), 0),
  }

  const handleAssignPlumber = async (bookingId: string, plumberId: string) => {
    if (!plumberId) return
    
    try {
      const res = await fetch(`/api/bookings/${bookingId}/plumber`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plumber_id: plumberId }),
      })
      
      if (res.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to assign plumber:', error)
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
          <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage bookings and services</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'plumb-blue' },
            { label: 'Pending', value: stats.pending, icon: Calendar, color: 'plumb-green' },
            { label: 'Completed', value: stats.completed, icon: Calendar, color: 'plumb-green' },
            { label: 'Revenue', value: `R${stats.revenue}`, icon: BarChart3, color: 'plumb-green' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-lg p-6 shadow-sm border"
            >
              <stat.icon className={`h-8 w-8 text-${stat.color}-600 mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex space-x-4 mb-8 border-b">
          {[
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'services', label: 'Services', icon: Wrench },
            { id: 'plumbers', label: 'Plumbers', icon: UserCheck },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 border-b-2 transition-colors flex items-center space-x-2 ${
                activeTab === tab.id 
                  ? 'border-plumb-green-600 text-plumb-green-600' 
                  : 'border-transparent'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-card rounded-lg p-6 shadow-sm border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{booking.services?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.profiles?.full_name} • {new Date(booking.scheduled_at || '').toLocaleString()}
                        </p>
                        {booking.plumber_id && (
                          <p className="text-sm text-plumb-green-600 mt-1">
                            Assigned: {plumbers.find(p => p.id === booking.plumber_id)?.full_name || 'Unknown'}
                          </p>
                        )}
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm bg-muted">
                        {booking.status}
                      </span>
                    </div>
                    
                    {!booking.plumber_id && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <select
                            value={assigningPlumber === booking.id ? selectedPlumber : ''}
                            onChange={(e) => {
                              setSelectedPlumber(e.target.value)
                              setAssigningPlumber(booking.id)
                            }}
                            className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-plumb-green-500"
                          >
                            <option value="">Assign a plumber...</option>
                            {plumbers.map((plumber) => (
                              <option key={plumber.id} value={plumber.id}>
                                {plumber.full_name || 'Unnamed Plumber'}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssignPlumber(booking.id, selectedPlumber)}
                            disabled={!selectedPlumber && assigningPlumber === booking.id}
                            className="px-3 py-1 bg-plumb-green-600 text-white rounded-md text-sm hover:bg-plumb-green-700 disabled:opacity-50"
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Services</h2>
                  <button className="px-4 py-2 rounded-lg bg-plumb-green-600 text-white flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Service</span>
                  </button>
                </div>
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-card rounded-lg p-6 shadow-sm border flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">R{service.base_price}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded hover:bg-muted">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded hover:bg-muted text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'plumbers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Plumbers</h2>
                  <button className="px-4 py-2 rounded-lg bg-plumb-green-600 text-white flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Plumber</span>
                  </button>
                </div>
                {plumbers.length === 0 ? (
                  <p className="text-muted-foreground">No plumbers found. Add plumbers to your team.</p>
                ) : (
                  plumbers.map((plumber) => (
                    <motion.div
                      key={plumber.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-card rounded-lg p-6 shadow-sm border flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold">{plumber.full_name || 'Unnamed Plumber'}</h3>
                        <p className="text-sm text-muted-foreground">Plumber</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 rounded hover:bg-muted">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded hover:bg-muted text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
                <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}