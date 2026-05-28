import { createServerClient } from '@supabase/ssr'

function getSupabase(request: any) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return request?.cookies?.getAll?.() || []
        },
        setAll(cookiesToSet: any[]) {},
      },
    }
  )
}

export async function POST(request: any) {
  const supabase = getSupabase(request)

  const { data: { session } } = await supabase.auth.getSession()

  if (!session || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return new Response(JSON.stringify({ error: 'Unauthorized - configure Supabase env vars' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { service_id, scheduled_at, amount, notes } = await request.json()

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      user_id: session.user.id,
      service_id,
      scheduled_at,
      amount,
      notes,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(booking), { 
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  })
}