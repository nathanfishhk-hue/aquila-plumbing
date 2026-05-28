import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import UserDashboardClient from '@/components/dashboard/UserDashboardClient'

export default async function UserDashboard() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const {
    data: { session },
  } = await createClient().supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: profile } = await createClient().supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  const { data: bookings } = await createClient().supabase
    .from('bookings')
    .select('*, services(name, base_price)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return <UserDashboardClient user={session.user} profile={profile} bookings={bookings || []} />
}