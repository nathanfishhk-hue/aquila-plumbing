export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import AdminDashboardClient from '@/components/dashboard/AdminDashboardClient'
import { Database } from '@/lib/database.types'

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  services: { name: string } | null
  profiles: { full_name: string } | null
}
type Service = Database['public']['Tables']['services']['Row']

function getTenantSlug(): string | null {
  const cookieStore = cookies()
  const slug = cookieStore.get('tenant_slug')?.value
  return slug || null
}

export default async function AdminDashboard() {
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

  const tenantSlug = getTenantSlug()

  let tenantId: string | null = null
  if (tenantSlug) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single()
    tenantId = tenant?.id || null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'user'
  if (role !== 'admin') {
    redirect('/dashboard/user')
  }

  let bookingsQuery = supabase
    .from('bookings')
    .select('*, services(name), profiles!bookings_plumber_id_fkey(full_name)')
    .order('created_at', { ascending: false })

  if (tenantId) {
    bookingsQuery = bookingsQuery.eq('tenant_id', tenantId)
  }

  const { data: bookings } = await bookingsQuery

  let servicesQuery = supabase
    .from('services')
    .select('*')
    .order('name')

  if (tenantId) {
    servicesQuery = servicesQuery.eq('tenant_id', tenantId)
  }

  const { data: services } = await servicesQuery

  const { data: plumbers } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'plumber')
    .order('full_name')

  return (
    <AdminDashboardClient
      bookings={bookings || []}
      services={services || []}
      plumbers={plumbers || []}
    />
  )
}