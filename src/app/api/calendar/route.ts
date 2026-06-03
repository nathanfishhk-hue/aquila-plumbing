export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { redis } from '@/lib/redis'

function getSupabase(request: NextRequest) {
  let response = NextResponse.next()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
}

function getTenantSlug(request: NextRequest): string | null {
  const hostname = request.nextUrl.hostname
  const parts = hostname.split('.')
  if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    return parts[0]
  }
  return request.cookies.get('tenant_slug')?.value || null
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase(request)
  const tenantSlug = getTenantSlug(request)
  
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const plumberId = searchParams.get('plumberId')

  let tenantId: string | null = null
  if (tenantSlug) {
    const { data: tenant } = await supabase.from('tenants').select('id').eq('slug', tenantSlug).single()
    tenantId = tenant?.id || null
  }

  let query = supabase
    .from('bookings')
    .select(`
      *,
      services(name, base_price)
    `)
    .eq('scheduled_at', date)

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }
  if (plumberId) {
    query = query.eq('plumber_id', plumberId)
  }

  const { data: bookings, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const cacheKey = `calendar:${tenantId}:${plumberId || 'all'}:${date}`
  const cached = await getRedisValue(cacheKey)
  if (cached) return NextResponse.json(cached)

  const result = { date, bookings: bookings || [] }
  await setRedisValue(cacheKey, JSON.stringify(result), 300)

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase(request)
  const tenantSlug = getTenantSlug(request)
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action, bookingId, newScheduledAt, reason } = await request.json()

  if (action === 'restructure_for_urgent') {
    const { data: urgentBooking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (!urgentBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const urgentTime = new Date(newScheduledAt)

    const { data: overlapping } = await supabase
      .from('bookings')
      .select('*')
      .eq('plumber_id', urgentBooking.plumber_id)
      .eq('tenant_id', urgentBooking.tenant_id)
      .in('status', ['pending', 'confirmed'])

    const updates: any[] = []
    for (const booking of overlapping || []) {
      const existingTime = new Date(booking.scheduled_at)
      const timeDiff = Math.abs(existingTime.getTime() - urgentTime.getTime())
      const hoursDiff = timeDiff / (1000 * 60 * 60)

      if (hoursDiff < 2 && booking.id !== bookingId) {
        const newTime = new Date(existingTime.getTime() + (3 * 60 * 60 * 1000))
        updates.push({
          id: booking.id,
          old_time: existingTime.toISOString(),
          new_time: newTime.toISOString(),
        })
        
        await supabase
          .from('bookings')
          .update({ scheduled_at: newTime.toISOString() })
          .eq('id', booking.id)
      }
    }

    await supabase
      .from('bookings')
      .update({ scheduled_at: newScheduledAt })
      .eq('id', bookingId)

    const updatedBooking = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    return NextResponse.json({
      success: true,
      booking: updatedBooking.data,
      rescheduled: updates,
    })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

async function getRedisValue(key: string) {
  try {
    return await redis.get(key)
  } catch {
    return null
  }
}

async function setRedisValue(key: string, value: string, ex?: number) {
  try {
    if (ex) await redis.setex(key, ex, value)
    else await redis.set(key, value)
  } catch {}
}