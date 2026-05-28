import { redirect } from 'next/navigation'
import UserDashboardClient from '@/components/dashboard/UserDashboardClient'

export const dynamic = 'force-dynamic'

export default async function UserDashboard() {
  redirect('/auth/login')
  
  const emptyProfile = {
    id: '',
    full_name: null,
    phone: null,
    address: null,
    role: 'user' as const,
    avatar_url: null,
    created_at: ''
  }

  return <UserDashboardClient user={null as any} profile={emptyProfile} bookings={[]} />
}