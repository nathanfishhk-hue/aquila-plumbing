export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import AdminDashboardClient from '@/components/dashboard/AdminDashboardClient'

export default async function AdminDashboard() {
  redirect('/auth/login')
  
  return (
    <AdminDashboardClient 
      bookings={[]} 
      services={[]} 
      plumbers={[]}
    />
  )
}