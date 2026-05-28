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

export async function GET(request: any) {
  const supabase = getSupabase(request)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return new Response(JSON.stringify([]), { 
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(services), { 
    headers: { 'Content-Type': 'application/json' }
  })
}