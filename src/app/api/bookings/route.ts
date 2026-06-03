export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { redis } from '@/lib/redis'
import * as Sentry from '@sentry/nextjs'

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
  const cookieSlug = request.cookies.get('tenant_slug')?.value
  return cookieSlug || null
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase(request)
  const tenantSlug = getTenantSlug(request)

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { service_id, scheduled_at, amount, notes } = await request.json()

  if (!service_id || !scheduled_at || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  let tenantId: string | null = null
  if (tenantSlug) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single()
    tenantId = tenant?.id || null
  }

  try {
    const existing = await redis.get(`booking:${session.user.id}:${service_id}`)
    if (existing) {
      return NextResponse.json({ error: 'Duplicate booking detected' }, { status: 409 })
    }
  } catch {}

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      tenant_id: tenantId,
      user_id: session.user.id,
      service_id,
      scheduled_at,
      amount,
      notes,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    Sentry.captureException(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  try {
    await redis.setex(`booking:${session.user.id}:${service_id}`, 86400, JSON.stringify(booking))
  } catch {}

  return NextResponse.json(booking, { status: 201 })
}