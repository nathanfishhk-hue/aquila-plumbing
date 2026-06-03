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

export async function GET(request: NextRequest) {
  const supabase = getSupabase(request)
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('plumber_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ notifications })
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase(request)
  const { plumberId, title, message, type, bookingId } = await request.json()

  if (!plumberId || !title || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      plumber_id: plumberId,
      title,
      message,
      type: type || 'general',
      booking_id: bookingId,
      read: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  redis.publish(`notifications:${plumberId}`, JSON.stringify(notification))

  return NextResponse.json({ notification })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}