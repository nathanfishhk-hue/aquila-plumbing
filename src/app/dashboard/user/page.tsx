import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import UserDashboardClient from '@/components/dashboard/UserDashboardClient'
import { Database } from '@/lib/database.types'
import { User } from '@supabase/supabase-js'

type Profile = Database['public']['Tables']['profiles']['Row']
type Booking = Database['public']['Tables']['bookings']['Row'] & {
  services: { name: string; base_price: number } | null
}

function getTenantSlugFromCookies() {
  const cookieStore = cookies()
  return cookieStore.get('tenant_slug')?.value || null
}

export const dynamic = 'force-dynamic'

export default async function UserDashboard() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const user = session?.user

  if (!user) {
    redirect('/auth')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const tenantSlug = getTenantSlugFromCookies()

  let tenantId: string | null = null
  if (tenantSlug) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single()
    tenantId = tenant?.id || null
  }

  let bookingsQuery = supabase
    .from('bookings')
    .select('*, services(name, base_price)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (tenantId) {
    bookingsQuery = bookingsQuery.eq('tenant_id', tenantId)
  }

  const { data: bookings } = await bookingsQuery

  return <UserDashboardClient user={user as User} profile={profile as Profile | null} bookings={bookings || []} />
}