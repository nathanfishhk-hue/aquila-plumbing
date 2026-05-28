export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import AdminDashboardClient from '@/components/dashboard/AdminDashboardClient'

export default async function AdminDashboard() {
  const { supabase } = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard/user')
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, services(name), profiles(full_name)')
    .order('created_at', { ascending: false })

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('name')

  const { data: plumbers } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'plumber')

  return (
    <AdminDashboardClient 
      bookings={bookings || []} 
      services={services || []} 
      plumbers={plumbers || []}
    />
  )
}