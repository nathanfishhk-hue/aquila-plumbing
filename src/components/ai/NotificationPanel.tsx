'use client'

import { useEffect, useState, useCallback } from 'react'
import { Database } from '@/lib/database.types'

type Notification = Database['public']['Tables']['notifications']['Row']

export function NotificationPanel({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    const res = await fetch(`/api/notifications?userId=${userId}`)
    const data = await res.json()
    setNotifications(data.notifications || [])
    setUnreadCount(data.notifications?.filter((n: Notification) => !n.read).length || 0)
  }, [userId])

  const setupRealtimeSubscription = useCallback(() => {
    const eventSource = new EventSource(`/api/notifications/stream?userId=${userId}`)
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setNotifications(prev => [data, ...prev])
      setUnreadCount(prev => prev + 1)
    }

    return () => eventSource.close()
  }, [userId])

  useEffect(() => {
    fetchNotifications()
    const cleanup = setupRealtimeSubscription()
    return cleanup
  }, [fetchNotifications, setupRealtimeSubscription])

  const markAsRead = async (notificationId: string) => {
    await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-6 z-40 w-80 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto">
      {notifications.slice(0, 5).map((notification) => (
        <div
          key={notification.id}
          className={`p-4 border-b cursor-pointer transition-colors ${
            notification.read ? 'bg-white' : 'bg-plumb-green-50'
          }`}
          onClick={() => markAsRead(notification.id)}
        >
          <h4 className="font-semibold text-sm">{notification.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
          <span className="text-xs text-gray-400 mt-2 block">
            {new Date(notification.created_at).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  )
}