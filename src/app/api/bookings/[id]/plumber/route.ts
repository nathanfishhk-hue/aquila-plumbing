import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

function getSupabase(request: NextRequest) {
  let response = NextResponse.next()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabase(request)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const { plumber_id } = await request.json()

  if (!plumber_id) {
    return NextResponse.json({ error: 'Plumber ID required' }, { status: 400 })
  }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('id', params.id)
    .single()

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const { data: plumber, error: plumberError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', plumber_id)
    .eq('role', 'plumber')
    .single()

  if (plumberError || !plumber) {
    return NextResponse.json({ error: 'Invalid plumber' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ plumber_id })
    .eq('id', params.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  if (booking.status === 'confirmed') {
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        plumber_id,
        booking_id: booking.id,
        title: 'New Assignment',
        message: 'You have been assigned to a new booking',
        type: 'schedule',
        read: false,
        sent_at: new Date().toISOString(),
      })

    if (notificationError) {
      console.error('Failed to create notification:', notificationError)
    }
  }

  return NextResponse.json({ success: true })
}